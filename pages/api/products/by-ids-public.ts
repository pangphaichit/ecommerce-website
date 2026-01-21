import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { productIds } = req.body;

  // Validate input
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: "productIds required" });
  }

  // Ensure text[] for Postgres
  const ids = productIds.map(String);

  const client = await connectionPool.connect();
  try {
    const { rows } = await client.query(
      `
      SELECT
        product_id,
        name,
        price,
        image_url,
        slug
      FROM products
      WHERE product_id = ANY($1::text[])
      `,
      [ids]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Public product lookup error:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
}
