// /pages/api/cart/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/utils/supabase";
import connectionPool from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await connectionPool.connect();

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user)
      return res.status(401).json({ error: "Invalid token" });

    const userId = user.id;

    if (req.method === "GET") {
      const { rows } = await client.query(
        `
    SELECT 
      ci.product_id,
      ci.quantity,
      p.name,
      p.price,
      p.image_url,
      p.slug
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.product_id
    WHERE ci.user_id = $1
    `,
        [userId]
      );

      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { product_id, quantity } = req.body;
      await client.query(
        `INSERT INTO cart_items (user_id, product_id, quantity, added_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, product_id)
         DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
        [userId, product_id, quantity]
      );
      return res.status(200).json({ message: "Item added" });
    }

    if (req.method === "PUT") {
      const { product_id, quantity } = req.body;
      await client.query(
        "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
        [quantity, userId, product_id]
      );
      return res.status(200).json({ message: "Quantity updated" });
    }

    if (req.method === "DELETE") {
      const { product_id } = req.body;
      await client.query(
        "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
        [userId, product_id]
      );
      return res.status(200).json({ message: "Item removed" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Cart API error:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
}
