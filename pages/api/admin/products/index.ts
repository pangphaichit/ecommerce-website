import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import { verify } from "jsonwebtoken";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number | null;
  is_available: boolean;
  category_id: number | null;
  size: string;
  ingredients: string;
  allergens: string;
  nutritional_info: string;
  seasonal: string;
  collection: string;
  stock_quantity: number;
  min_order_quantity: number;
  image_url: string;
  slug: string;
  image_file?: File;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const client = await connectionPool.connect();

  try {
    await client.query("BEGIN");

    const token = req.cookies.token;
    if (!token) {
      await client.query("ROLLBACK");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify JWT token to ensure it's valid
    try {
      verify(token, secret);
    } catch (e) {
      await client.query("ROLLBACK");
      return res.status(401).json({ error: "Invalid token" });
    }

    // Get user role from cookies
    const role = req.cookies.user_role;
    if (role !== "admin") {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const {
      name,
      description,
      price,
      is_available,
      category_id,
      size,
      ingredients,
      allergens,
      nutritional_info,
      seasonal,
      collection,
      stock_quantity,
      min_order_quantity,
      image_url,
    } = req.body as Product;
    if (
      !name ||
      !description ||
      !price ||
      is_available === undefined ||
      !stock_quantity ||
      !category_id ||
      !ingredients ||
      !allergens ||
      !nutritional_info ||
      !min_order_quantity ||
      !image_url
    ) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if product name already exists
    const nameCheck = await client.query(
      `SELECT product_id FROM products WHERE name = $1`,
      [name]
    );
    if (nameCheck?.rowCount && nameCheck.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Product name already exists" });
    }

    // Get last product_id and increment
    const idResult = await client.query(`
      SELECT product_id FROM products
      WHERE product_id LIKE 'oaw-%'
      ORDER BY product_id DESC
      LIMIT 1
    `);

    let nextIdNum = 1;
    if (idResult.rowCount && idResult.rowCount > 0) {
      const lastNum = parseInt(idResult.rows[0].product_id.replace("oaw-", ""));
      if (!isNaN(lastNum)) nextIdNum = lastNum + 1;
    }

    const newProductId = `oaw-${String(nextIdNum).padStart(3, "0")}`;

    // Generate slug from name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    let finalSlug = baseSlug;
    let counter = 1;

    // Ensure slug uniqueness
    while (true) {
      const slugCheck = await client.query(
        `SELECT slug FROM products WHERE slug = $1`,
        [finalSlug]
      );
      if (slugCheck.rowCount === 0) break;
      finalSlug = `${baseSlug}-${counter++}`;
    }

    // Insert new product
    const insertQuery = `
      INSERT INTO products (
        product_id, name, slug, description, price, is_available, category_id,
        size, ingredients, allergens, nutritional_info, seasonal, collection,
        stock_quantity, min_order_quantity, image_url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      newProductId,
      name,
      finalSlug,
      description,
      price,
      is_available ?? true,
      category_id,
      size ?? "none",
      ingredients,
      allergens,
      nutritional_info,
      seasonal === "" ? null : seasonal,
      collection,
      stock_quantity ?? 0,
      min_order_quantity ?? 1,
      image_url,
    ]);

    await client.query("COMMIT");

    return res.status(201).json({ data: result.rows[0] });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("POST /products error:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
  },
};
