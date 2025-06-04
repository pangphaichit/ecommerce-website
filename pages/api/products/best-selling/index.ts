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
        p.*,
        SUM(oi.quantity) AS total_quantity
      FROM order_items oi
      JOIN products p ON p.product_id = oi.product_id
      GROUP BY p.product_id
      ORDER BY total_quantity DESC
      LIMIT 8;
    `;

    const result = await client.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No sales data found" });
    }

    return res.status(200).json({
      message: "Best selling products fetched successfully",
      product: result.rows,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return res.status(500).json({
      error: "An error occurred while fetching sales data.",
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
