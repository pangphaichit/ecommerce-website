import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

interface Product {
  product_id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  category_name?: string;
  created_at: Date;
  online_exclusive?: boolean;
  key_ingredients?: string[];
}

interface ProductImage {
  id: number;
  image_url: string;
  created_at: Date;
}

interface ProductWithDetails extends Product {
  images: ProductImage[];
  isBestSelling: boolean;
  isNewArrival: boolean;
  youMayAlsoLike: Product[];
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
    const rawSlug = req.query.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ error: "Invalid or missing slug" });
    }

    // 1) Main product (+ category name)
    const productQuery = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.category_id = p.category_id
      WHERE p.slug = $1
      LIMIT 1
    `;
    const productResult = await client.query(productQuery, [slug]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const product = productResult.rows[0] as Product;

    // 2) Images
    const imagesQuery = `
      SELECT id, image_url, created_at
      FROM product_images
      WHERE product_id = $1
      ORDER BY created_at ASC
    `;
    const imagesResult = await client.query(imagesQuery, [product.product_id]);

    // 3) Best-selling IDs (top 8) - Fixed: removed ::int cast
    const bestSellingIdsQuery = `
      SELECT product_id
      FROM (
        SELECT oi.product_id, SUM(oi.quantity) AS total_sold
        FROM order_items oi
        JOIN orders o ON o.order_id = oi.order_id
        WHERE o.status = 'paid'
        GROUP BY oi.product_id
        ORDER BY total_sold DESC
        LIMIT 8
      ) t
    `;
    const bestSellingIdsRes = await client.query(bestSellingIdsQuery);
    const bestSellingIds: string[] = bestSellingIdsRes.rows.map((r) =>
      String(r.product_id)
    );

    const isBestSelling = bestSellingIds.includes(product.product_id);

    // 4) New arrivals (latest 8) - Fixed: removed ::int cast
    const newArrivalQuery = `
      SELECT product_id
      FROM products
      ORDER BY created_at DESC
      LIMIT 8
    `;
    const newArrivalRes = await client.query(newArrivalQuery);
    const newArrivalIds: string[] = newArrivalRes.rows.map((r) =>
      String(r.product_id)
    );

    const isNewArrival = newArrivalIds.includes(product.product_id);

    // Helper: normalize/parse key_ingredients from the DB row
    const parseKeyIngredients = (value: unknown): string[] => {
      if (!value) return [];
      try {
        const arr = Array.isArray(value) ? value : JSON.parse(String(value));
        if (!Array.isArray(arr)) return [];
        // normalize: trim, lowercase, dedupe
        const cleaned = Array.from(
          new Set(
            arr
              .filter((v) => typeof v === "string")
              .map((v) => v.trim().toLowerCase())
              .filter(Boolean)
          )
        );
        return cleaned;
      } catch {
        return [];
      }
    };

    const currentKeyIngredients = parseKeyIngredients(
      (product as any).key_ingredients
    );

    // Build recommendations up to 3
    let youMayAlsoLike: Product[] = [];

    // 1) Explicit recommendations
    const explicitQuery = `
      SELECT p.*, c.name AS category_name
      FROM product_recommendations pr
      JOIN products p ON pr.recommended_product_id = p.product_id
      LEFT JOIN categories c ON c.category_id = p.category_id
      WHERE pr.product_id = $1
        AND p.product_id != $1
      LIMIT 3
    `;
    const explicitRes = await client.query(explicitQuery, [product.product_id]);
    youMayAlsoLike = explicitRes.rows;

    // 2) Key-ingredient matches (rank by number of matches desc, then recency)
    if (youMayAlsoLike.length < 3 && currentKeyIngredients.length > 0) {
      const keyIngredientsQuery = `
        SELECT p.*, c.name AS category_name,
               (
                 SELECT COUNT(*)
                 FROM jsonb_array_elements_text(p.key_ingredients) ing
                 WHERE lower(trim(ing)) = ANY($2::text[])
               ) AS matching_ingredients
        FROM products p
        LEFT JOIN categories c ON c.category_id = p.category_id
        WHERE p.product_id != $1
          AND p.key_ingredients IS NOT NULL
          AND jsonb_typeof(p.key_ingredients) = 'array'
          AND EXISTS (
            SELECT 1
            FROM jsonb_array_elements_text(p.key_ingredients) ing
            WHERE lower(trim(ing)) = ANY($2::text[])
          )
        ORDER BY matching_ingredients DESC, p.created_at DESC
        LIMIT $3
      `;
      const keyRes = await client.query(keyIngredientsQuery, [
        product.product_id,
        currentKeyIngredients, // text[]
        3 - youMayAlsoLike.length,
      ]);

      // filter out duplicates if any overlap with explicit
      const existingIds = new Set(youMayAlsoLike.map((p) => p.product_id));
      const toAdd = keyRes.rows.filter((p) => !existingIds.has(p.product_id));
      youMayAlsoLike = [...youMayAlsoLike, ...toAdd].slice(0, 3);
    }

    // 3) Same category (newest first)
    if (youMayAlsoLike.length < 3 && product.category_id) {
      const categoryQuery = `
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON c.category_id = p.category_id
        WHERE p.category_id = $1
          AND p.product_id != $2
        ORDER BY p.created_at DESC
        LIMIT $3
      `;
      const catRes = await client.query(categoryQuery, [
        product.category_id,
        product.product_id,
        3 - youMayAlsoLike.length,
      ]);
      // merge without duplicates
      const existingIds = new Set(youMayAlsoLike.map((p) => p.product_id));
      const toAdd = catRes.rows.filter((p) => !existingIds.has(p.product_id));
      youMayAlsoLike = [...youMayAlsoLike, ...toAdd].slice(0, 3);
    }

    // 4) Best-selling fill
    if (youMayAlsoLike.length < 3 && bestSellingIds.length > 0) {
      const existingIds = new Set(youMayAlsoLike.map((p) => p.product_id));
      const availableBest = bestSellingIds.filter(
        (id) => id !== product.product_id && !existingIds.has(id)
      );

      if (availableBest.length > 0) {
        const bestFillQuery = `
          SELECT p.*, c.name AS category_name
          FROM products p
          LEFT JOIN categories c ON c.category_id = p.category_id
          WHERE p.product_id = ANY($1::text[])
         ORDER BY
         CASE p.product_id
         ${availableBest.map((id, i) => `WHEN '${id}' THEN ${i}`).join(" ")}
        END

          LIMIT $2
        `;
        const bestFillRes = await client.query(bestFillQuery, [
          availableBest,
          3 - youMayAlsoLike.length,
        ]);

        const toAdd = bestFillRes.rows.filter(
          (p) => !existingIds.has(p.product_id)
        );
        youMayAlsoLike = [...youMayAlsoLike, ...toAdd].slice(0, 3);
      }
    }

    // 5) Random fallback (avoid duplicates, works even if exclusion list empty)
    if (youMayAlsoLike.length < 3) {
      const excludeIds = [
        product.product_id,
        ...youMayAlsoLike.map((p) => p.product_id),
      ];
      const randomQuery = `
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON c.category_id = p.category_id
        WHERE p.product_id <> $1
          AND (cardinality($2::text[]) = 0 OR p.product_id <> ALL($2::text[]))
        ORDER BY RANDOM()
        LIMIT $3
      `;
      const randRes = await client.query(randomQuery, [
        product.product_id,
        excludeIds,
        3 - youMayAlsoLike.length,
      ]);
      const existingIds = new Set(youMayAlsoLike.map((p) => p.product_id));
      const toAdd = randRes.rows.filter((p) => !existingIds.has(p.product_id));
      youMayAlsoLike = [...youMayAlsoLike, ...toAdd].slice(0, 3);
    }

    const productWithDetails: ProductWithDetails = {
      ...product,
      images: imagesResult.rows,
      isBestSelling,
      isNewArrival,
      youMayAlsoLike,
    };

    // Cache a bit (5 min)
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return res.status(200).json({ success: true, data: productWithDetails });
  } catch (error) {
    console.error("Error fetching product data:", error);
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
