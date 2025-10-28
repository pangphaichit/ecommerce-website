// File: /pages/api/blog-categories.ts
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
    const result = await client.query(`
      SELECT *
      FROM blog_categories
      ORDER BY name ASC
    `);

    return res.status(200).json({
      message: "Categories fetched successfully",
      categories: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch categories" });
  } finally {
    client.release();
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
  },
};
