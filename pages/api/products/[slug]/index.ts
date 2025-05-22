import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = await connectionPool.connect();

  try {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: "invalid or missing slug" });
    }

    if (req.method === "GET") {
      try {
        const query = `
      SELECT products.*, categories.name AS category_name
      FROM products
      LEFT JOIN categories ON categories.category_id = products.category_id
      WHERE products.slug = $1
    `;
        const result = await client.query(query, [slug]);

        if (result.rows.length === 0) {
          return res.status(404).json({ error: "product not found" });
        }

        return res.status(200).json({ data: result.rows[0] });
      } catch (error) {
        console.error("error fetching product data:", error);
        return res.status(500).json({ error: "internal server error" });
      }
    }
  } finally {
    client.release();
  }
}

// CORS configuration for API route
export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
  },
};
