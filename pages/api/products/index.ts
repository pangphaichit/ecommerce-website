import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

type ProductQueryParams = {
  search?: string; // General search term
  product_id?: string;
  name?: string;
  description?: string;
  category_id?: string;
  category_slug?: string;
  ingredients?: string;
  collection?: string;
  seasonal?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  is_available?: "true" | "false";
  page?: string;
  limit?: string;
};

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
      category_id,
      category_slug,
      ingredients,
      collection,
      seasonal,
      minPrice,
      maxPrice,
      sort,
      is_available,
      page = "1",
      limit = "12",
    } = req.query as ProductQueryParams;

    let query = `
       SELECT 
        products.*, 
        categories.name as category_name,
        COALESCE(MAX(
          CASE 
            WHEN coupons.discount_type = 'percentage' AND coupons.discount_value IS NOT NULL THEN products.price * (coupons.discount_value / 100.0)
            WHEN coupons.discount_type = 'fixed_amount' AND coupons.discount_value IS NOT NULL THEN coupons.discount_value
            ELSE 0
          END
        ), 0) AS discount_amount
      FROM products
      LEFT JOIN categories ON categories.category_id = products.category_id
      LEFT JOIN coupons ON (
        coupons.is_active = true
        AND NOW() BETWEEN coupons.valid_from AND coupons.valid_until
        AND (
          coupons.applies_to_all_products = true
          OR (coupons.applies_to_product_ids IS NOT NULL AND products.product_id = ANY(coupons.applies_to_product_ids))
          OR (coupons.applies_to_category_ids IS NOT NULL AND products.category_id = ANY(coupons.applies_to_category_ids))
        )
      )
      LEFT JOIN (
    SELECT product_id, SUM(quantity) as total_sold
    FROM order_items
    GROUP BY product_id
  ) sales ON sales.product_id = products.product_id
      WHERE 1=1
    `;

    let whereClause = "";
    const filterParams: any[] = [];

    const addFilter = (condition: string, value: any) => {
      whereClause += ` AND ${condition} $${filterParams.length + 1}`;
      filterParams.push(value);
    };

    // General search handling
    if (search) {
      const searchTerm = `%${search}%`;
      whereClause += `
        AND (
          products.product_id::text ILIKE $${filterParams.length + 1} OR
          products.name ILIKE $${filterParams.length + 2} OR
          products.description ILIKE $${filterParams.length + 3} OR
          products.ingredients ILIKE $${filterParams.length + 4} OR
          products.collection ILIKE $${filterParams.length + 5} OR
          categories.name ILIKE $${filterParams.length + 6} OR
          products.seasonal::text ILIKE $${filterParams.length + 7}

        )
      `;
      filterParams.push(
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm
      );
    }

    // Optional specific filters
    if (category_id) {
      addFilter("products.category_id =", category_id);
    } else if (category_slug) {
      addFilter("categories.category_slug =", category_slug);
    }
    // Handling multiple ingredients with checkboxes
    let ingredientList: string[] = [];
    if (ingredients) {
      ingredientList = ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      if (ingredientList.length > 0) {
        // JSONB array contains any of the ingredients (case-insensitive)
        const ingredientConditions = ingredientList
          .map(
            (_, index) =>
              `EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(products.key_ingredients) AS ki
            WHERE ki ILIKE $${filterParams.length + index + 1}
          )`
          )
          .join(" OR ");
        whereClause += ` AND (${ingredientConditions})`;
        ingredientList.forEach((ingredient) =>
          filterParams.push(`%${ingredient}%`)
        );
      }
    }

    if (collection) addFilter("products.collection =", collection);
    const validSeasonals = [
      "Christmas",
      "Valentine's",
      "Easter",
      "New Year",
      "Halloween",
      "Mother's Day",
      "Father's Day",
    ];

    if (
      seasonal &&
      seasonal.trim() !== "" &&
      validSeasonals.includes(seasonal)
    ) {
      addFilter("products.seasonal =", seasonal);
    }
    if (is_available === "true") addFilter("products.is_available =", true);
    if (is_available === "false") addFilter("products.is_available =", false);
    if (minPrice) addFilter("products.price >=", Number(minPrice));
    if (maxPrice) addFilter("products.price <=", Number(maxPrice));

    query += whereClause;

    query += `
      GROUP BY 
        products.product_id,
        products.name,
        products.description,
        products.price,
        products.is_available,
        products.category_id,
        products.size,
        products.ingredients,
        products.allergens,
        products.nutritional_info,
        products.seasonal,
        products.collection,
        products.stock_quantity,
        products.min_order_quantity,
        products.image_url,
        products.slug,
        products.created_at,
        categories.name,
        sales.total_sold
    `;

    // Sorting logic
    if (sort === "newest") {
      query += ` ORDER BY products.created_at DESC`;
    } else if (sort === "oldest") {
      query += ` ORDER BY products.created_at ASC`;
    } else if (sort === "best_selling") {
      query += ` ORDER BY sales.total_sold DESC NULLS LAST`;
    } else if (sort === "discount_high") {
      query += ` ORDER BY discount_amount DESC`;
    } else if (sort === "discount_low") {
      query += ` ORDER BY discount_amount ASC`;
    } else if (sort === "price_high") {
      query += ` ORDER BY products.price DESC`;
    } else if (sort === "price_low") {
      query += ` ORDER BY products.price ASC`;
    } else if (sort === "alphabet_desc") {
      query += ` ORDER BY products.name DESC`; // Z to A
    } else {
      query += ` ORDER BY products.name ASC`; // default A to Z
    }

    // Pagination calculation
    const pageNum = isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
    const limitNum = isNaN(parseInt(limit))
      ? 12
      : Math.min(12, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const queryParams = [...filterParams];
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${
      queryParams.length + 2
    }`;
    queryParams.push(limitNum, offset);

    const countQuery = `
      SELECT COUNT(DISTINCT products.product_id) as total
      FROM products
      LEFT JOIN categories ON categories.category_id = products.category_id
      LEFT JOIN coupons ON (
        coupons.is_active = true
        AND NOW() BETWEEN coupons.valid_from AND coupons.valid_until
        AND (
          coupons.applies_to_all_products = true
          OR (coupons.applies_to_product_ids IS NOT NULL AND products.product_id = ANY(coupons.applies_to_product_ids))
          OR (coupons.applies_to_category_ids IS NOT NULL AND products.category_id = ANY(coupons.applies_to_category_ids))
        )
      )
      WHERE 1=1 ${whereClause}
    `;

    const [productsResult, countResult] = await Promise.all([
      client.query(query, queryParams), // full query: filters + limit/offset
      client.query(countQuery, filterParams), // count query: only filters
    ]);

    const totalProducts = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalProducts / limitNum);

    return res.status(200).json({
      message: "Products fetched successfully",
      product: productsResult.rows,
      pagination: {
        total: totalProducts,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error.message, error.stack);
    return res.status(500).json({
      error: error.message || "An error occurred while fetching products.",
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
