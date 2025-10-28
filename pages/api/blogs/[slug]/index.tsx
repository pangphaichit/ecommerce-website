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

  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug is required" });
  }

  const client = await connectionPool.connect();

  try {
    const query = `
      SELECT 
        b.blog_id,
        b.title,
        b.article,
        b.image_url,
        b.create_at,
        b.update_at,
        TRIM(b.slug) AS slug,
        c.name AS category_name,
        a.name AS author_name,
        a.role AS author_role,
        a.avatar,
        s.likes,
        s.shares,
        s.total_reads,
        s.read_minutes
      FROM blogs b
      LEFT JOIN blog_categories c ON b.category = c.id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN blog_stats s ON b.blog_id = s.blog_id
      WHERE b.slug = $1
      LIMIT 1
    `;

    const result = await client.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    return res.status(200).json({
      message: "Blog fetched successfully",
      blog: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching blog:", error.message);
    return res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}
