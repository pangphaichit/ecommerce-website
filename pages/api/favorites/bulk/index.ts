import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import { jwtDecode } from "jwt-decode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let userId: string;
  try {
    const decoded = jwtDecode<{ sub: string }>(token);
    userId = decoded.sub;
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Products array is required" });
  }

  const client = await connectionPool.connect();

  try {
    await client.query("BEGIN");

    // Prepare bulk insert values
    const values = products
      .map((product, idx) => `($1, $${idx + 2})`)
      .join(", ");
    const queryParams = [userId, ...products];

    // Insert all favorites, skip duplicates
    const result = await client.query(
      `INSERT INTO favorites (user_id, product_id) 
       VALUES ${values}
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING product_id`,
      queryParams
    );

    await client.query("COMMIT");

    const addedCount = Math.max(0, result.rowCount ?? 0);
    const skippedCount = products.length - addedCount;

    return res.status(201).json({
      message: `Favorites imported successfully`,
      added: addedCount,
      skipped: skippedCount,
      total: products.length,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Bulk favorites error:", err);
    return res.status(500).json({ message: "Failed to import favorites" });
  } finally {
    client.release();
  }
}
