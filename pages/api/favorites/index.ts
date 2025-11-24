import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  [key: string]: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // CORS for real requests
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Verify authentication
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let userId: string;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    userId = decoded.sub;
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const client = await connectionPool.connect();

  try {
    // GET - Fetch favorites
    if (req.method === "GET") {
      const result = await client.query(
        `SELECT product_id, created_at
         FROM favorites
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );
      return res.status(200).json(result.rows);
    }

    // POST - Add
    if (req.method === "POST") {
      const { product_id } = req.body;

      if (!product_id) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      try {
        await client.query(
          `INSERT INTO favorites (user_id, product_id)
           VALUES ($1, $2)`,
          [userId, product_id]
        );

        return res.status(201).json({
          message: "Added to favorites",
          product_id,
        });
      } catch (err: any) {
        if (err.code === "23505") {
          return res.status(409).json({ message: "Already in favorites" });
        }
        throw err;
      }
    }

    // DELETE - Remove
    if (req.method === "DELETE") {
      const product_id = req.body.product_id || req.query.product_id;

      if (!product_id) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const result = await client.query(
        `DELETE FROM favorites
         WHERE user_id = $1 AND product_id = $2`,
        [userId, product_id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      return res.status(200).json({ message: "Removed from favorites" });
    }

    // Not allowed
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  } catch (err) {
    console.error("Favorites API error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    client.release();
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
  },
};
