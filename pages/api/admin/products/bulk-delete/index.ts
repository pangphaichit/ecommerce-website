import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import connectionPool from "@/utils/db";

export const config = {
  api: {
    bodyParser: true, // default JSON body parsing enabled
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Parse cookies for token and role
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter(([key]) => key && key.length > 0)
      .map(([key, ...v]) => [key, decodeURIComponent(v.join("="))])
  );

  const token = cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    verify(token, secret);
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  const role = cookies.user_role;
  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: "No product IDs provided" });
  }

  const validProductIds = productIds
    .map((id) => String(id))
    .filter((id) => id.length > 0);

  if (validProductIds.length === 0) {
    return res.status(400).json({ error: "Invalid product IDs" });
  }

  // If some IDs were invalid but others passed validation
  if (validProductIds.length < productIds.length) {
    console.warn(
      `Some product IDs were invalid. Original: ${productIds.length}, Valid: ${validProductIds.length}`
    );
  }

  let client;
  try {
    client = await connectionPool.connect();
  } catch (error) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    await client.query("BEGIN");

    const deleteQuery = `DELETE FROM products WHERE product_id = ANY($1::text[]) RETURNING *`;
    const result = await client.query(deleteQuery, [validProductIds]);

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "No products found to delete" });
    }

    await client.query("COMMIT");

    return res
      .status(200)
      .json({ deletedCount: result.rowCount, deletedProducts: result.rows });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Bulk delete error:", error);
    return res.status(500).json({ error: "Failed to delete products" });
  } finally {
    client.release();
  }
}
