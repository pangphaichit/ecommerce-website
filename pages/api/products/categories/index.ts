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
    // If category_id is provided as a query parameter, fetch that specific category
    const category_id = req.query.category_id;

    if (category_id) {
      const query = "SELECT * FROM categories WHERE category_id = $1";
      const { rows } = await client.query(query, [category_id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      return res.status(200).json({
        message: "Category data fetched successfully",
        data: rows[0],
      });
    }

    // Otherwise, fetch all categories
    else {
      const query = "SELECT * FROM categories";
      const { rows } = await client.query(query);

      return res.status(200).json({
        message: "All categories fetched successfully",
        data: rows,
      });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching categories." });
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
