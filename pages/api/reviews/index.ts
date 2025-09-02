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
    const query = `
      SELECT 
        r.review_id,
        r.product_id,
        p.slug AS slug,
        r.rating,
        r.title,
        r.review_text,
        r.image_url,
        r.created_at,
        COUNT(rs.support_id) AS support_count,
        u.user_id,
        u.full_name,
        u.image AS user_image
      FROM reviews r
      LEFT JOIN review_supports rs ON r.review_id = rs.review_id
      JOIN users u ON r.user_id = u.user_id
      JOIN products p ON r.product_id::text = p.product_id::text
      WHERE r.status = 'approved'
      GROUP BY r.review_id, u.user_id, p.slug
      ORDER BY support_count DESC
      LIMIT 4;
    `;

    const result = await client.query(query);

    const formatted = result.rows.map((row) => ({
      review_id: row.review_id,
      product_id: row.product_id,
      product_slug: row.slug,
      rating: row.rating,
      title: row.title,
      review_text: row.review_text,
      image_url: row.image_url,
      created_at: row.created_at,
      support_count: Number(row.support_count),
      user: {
        user_id: row.user_id,
        full_name: row.full_name,
        image: row.user_image,
      },
    }));

    return res.status(200).json({
      message: "Top supported reviews fetched successfully",
      reviews: formatted,
    });
  } catch (error) {
    console.error("Error fetching top reviews:", error);
    return res.status(500).json({
      error: "An error occurred while fetching top supported reviews.",
    });
  } finally {
    client.release();
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
