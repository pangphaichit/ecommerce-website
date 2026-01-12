import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: "productIds required" });
  }

  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      `
      SELECT
        product_id,
        slug,
        name,
        price,
        image_url
      FROM products
      WHERE product_id = ANY($1::text[])
      `,
      [productIds]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
}
