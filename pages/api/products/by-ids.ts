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
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // CORS for real requests
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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

  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: "productIds required" });
  }

  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      `
      SELECT
        f.product_id,
        f.created_at AS added_at,
         p.name,
        p.price,
        p.image_url,
        p.slug
       FROM favorites f
  JOIN products p ON p.product_id = f.product_id
  WHERE f.user_id = $1
    AND f.product_id = ANY($2::text[])
  ORDER BY f.created_at DESC
  `,
      [userId, productIds]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
}
