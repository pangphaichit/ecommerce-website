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
        const productQuery = `
          SELECT products.*, categories.name AS category_name
          FROM products
          LEFT JOIN categories ON categories.category_id = products.category_id
          WHERE products.slug = $1
        `;

        const productResult = await client.query(productQuery, [slug]);

        if (productResult.rows.length === 0) {
          return res.status(404).json({ error: "product not found" });
        }

        const product = productResult.rows[0];

        // Second query - get product images
        const imagesQuery = `
          SELECT id, image_url, created_at
          FROM product_images
          WHERE product_id = $1
          ORDER BY created_at ASC
        `;

        const imagesResult = await client.query(imagesQuery, [
          product.product_id,
        ]);

        const productWithImages = {
          ...product,
          images: imagesResult.rows,
        };

        return res.status(200).json({ data: productWithImages });
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
