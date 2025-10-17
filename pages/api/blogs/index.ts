import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

interface Blog {
  blog_id: number;
  title: string;
  slug: string;
  category: number;
  article: string;
  image_url: string;
  author_id: number;
  created_at: Date;
  update_at: Date;
  page?: string;
  limit?: string;
}

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
    const {
      search,
      category,
      author_role,
      sort,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT 
        b.blog_id,
        b.title,
        b.article,
        b.image_url,
        b.create_at,
        b.update_at,
        b.slug,
        c.name AS category_name,
        a.name AS author_name,
        a.role AS author_role,
        s.likes,
        s.shares,
        s.total_reads,
        s.read_minutes
      FROM blogs b
      LEFT JOIN blog_categories c ON b.category = c.id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN blog_stats s ON b.blog_id = s.blog_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // --- Search ---
    if (search) {
      query += ` AND (b.title ILIKE $${paramIndex} OR b.article ILIKE $${
        paramIndex + 1
      } OR a.name ILIKE $${paramIndex + 2})`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      paramIndex += 3;
    }

    // --- Category Filter ---
    if (category) {
      query += ` AND b.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // --- Author Role Filter ---
    if (author_role) {
      query += ` AND a.role = $${paramIndex}`;
      params.push(author_role);
      paramIndex++;
    }

    // --- Sorting ---
    switch (sort) {
      case "newest":
        query += " ORDER BY b.create_at DESC";
        break;
      case "oldest":
        query += " ORDER BY b.create_at ASC";
        break;
      case "most_liked":
        query += " ORDER BY s.likes DESC NULLS LAST";
        break;
      case "most_read":
        query += " ORDER BY s.total_reads DESC NULLS LAST";
        break;
      default:
        query += " ORDER BY b.create_at DESC";
    }

    // --- Pagination ---
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limitNum, offset);

    // --- Execute Query ---
    const result = await client.query(query, params);

    // --- Get Total Count ---
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM blogs b
      LEFT JOIN blog_categories c ON b.category = c.id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE 1=1
    `;
    const countParams: any[] = [];
    let countIndex = 1;

    if (search) {
      countQuery += ` AND (b.title ILIKE $${countIndex} OR b.article ILIKE $${
        countIndex + 1
      } OR a.name ILIKE $${countIndex + 2})`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      countIndex += 3;
    }
    if (category) {
      countQuery += ` AND b.category = $${countIndex}`;
      countParams.push(category);
      countIndex++;
    }
    if (author_role) {
      countQuery += ` AND a.role = $${countIndex}`;
      countParams.push(author_role);
      countIndex++;
    }

    const countResult = await client.query(countQuery, countParams);
    const totalBlogs = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalBlogs / limitNum);

    return res.status(200).json({
      message: "Blogs fetched successfully",
      blogs: result.rows,
      pagination: {
        total: totalBlogs,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching blogs:", error.message);
    return res.status(500).json({
      error: error.message || "An error occurred while fetching blogs.",
    });
  } finally {
    client.release();
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
  },
};
