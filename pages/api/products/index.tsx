import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

type ProductQueryParams = {
  search?: string; // General search term
  product_id?: string;
  name?: string;
  description?: string;
  category_id?: string;
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
      ingredients,
      collection,
      seasonal,
      minPrice,
      maxPrice,
      sort,
      is_available,
      page = "1",
      limit = "10",
    } = req.query as ProductQueryParams;

    let query = `
      SELECT products.*, categories.name as category_name
      FROM products
      LEFT JOIN categories ON categories.category_id = products.category_id
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
          categories.name ILIKE $${filterParams.length + 6}
        )
      `;
      filterParams.push(
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm
      );
    }

    // Optional specific filters
    if (category_id) addFilter("products.category_id =", category_id);

    // Handling multiple ingredients with checkboxes
    let ingredientList: string[] = [];
    if (ingredients) {
      ingredientList = ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      if (ingredientList.length > 0) {
        const ingredientConditions = ingredientList
          .map(
            (_, index) =>
              `products.ingredients ILIKE $${filterParams.length + index + 1}`
          )
          .join(" OR ");
        whereClause += ` AND (${ingredientConditions})`;
        ingredientList.forEach((ingredient) =>
          filterParams.push(`%${ingredient}%`)
        );
      }
    }

    if (collection) addFilter("products.collection =", collection);
    if (seasonal) addFilter("products.seasonal =", seasonal);
    if (is_available === "true") addFilter("products.is_available =", true);
    if (is_available === "false") addFilter("products.is_available =", false);
    if (minPrice) addFilter("products.price >=", Number(minPrice));
    if (maxPrice) addFilter("products.price <=", Number(maxPrice));

    query += whereClause;

    // Sorting logic
    if (sort === "newest") {
      query += ` ORDER BY products.created_at DESC`;
    } else if (sort === "oldest") {
      query += ` ORDER BY products.created_at ASC`;
    } else {
      query += ` ORDER BY products.name ASC`;
    }

    // Pagination calculation
    const pageNum = isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
    const limitNum = isNaN(parseInt(limit))
      ? 10
      : Math.min(20, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const queryParams = [...filterParams];
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${
      queryParams.length + 2
    }`;
    queryParams.push(limitNum, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products
      LEFT JOIN categories ON categories.category_id = products.category_id
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
      data: productsResult.rows,
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
