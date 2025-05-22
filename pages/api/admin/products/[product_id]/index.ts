import type { NextApiRequest, NextApiResponse } from "next";
import type formidable from "formidable";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { verify } from "jsonwebtoken";
import connectionPool from "@/utils/db";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const config = {
  api: {
    bodyParser: false, // disable built-in body parsing to handle multipart form data
  },
};

function parseForm(req: NextApiRequest) {
  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "API route is working" });
  }
  return await handleProductRequest(req, res);
}

async function handleProductRequest(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  if (req.method !== "PUT" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let client;
  try {
    client = await connectionPool.connect();
  } catch (error) {
    return res.status(500).json({ error: "Database connection error" });
  }

  try {
    await client.query("BEGIN");

    // Parse cookies manually (Next.js API does not do this automatically)
    const cookieHeader = req.headers.cookie || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map((cookie) => cookie.trim().split("="))
        .filter(([key]) => key && key.length > 0)
        .map(([key, ...v]) => [key, decodeURIComponent(v.join("="))])
    );

    const token = cookies.token;
    if (!token) {
      await client.query("ROLLBACK");
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      verify(token, secret);
    } catch (e) {
      await client.query("ROLLBACK");
      return res.status(401).json({ error: "Invalid token" });
    }

    const role = cookies.user_role;
    if (role !== "admin") {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const { product_id } = req.query;
    const productIdStr = Array.isArray(product_id) ? product_id[0] : product_id;

    if (!productIdStr) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ error: "Missing or invalid product_id in query" });
    }

    if (req.method === "PUT") {
      const { fields, files } = await parseForm(req);

      // Extract fields
      const name = Array.isArray(fields.name)
        ? fields.name[0]
        : (fields.name as string | undefined);
      const description = Array.isArray(fields.description)
        ? fields.description[0]
        : (fields.description as string | undefined);
      const priceRaw = fields.price;
      const priceStr = Array.isArray(priceRaw) ? priceRaw[0] : priceRaw;
      const price = priceStr ? Number.parseFloat(priceStr) : undefined;

      const isAvailableRaw = fields.is_available;
      const isAvailableStr = Array.isArray(isAvailableRaw)
        ? isAvailableRaw[0]
        : isAvailableRaw;
      let is_available: boolean | undefined = undefined;
      if (isAvailableStr !== undefined) {
        is_available = isAvailableStr === "true" || isAvailableStr === "1";
      }

      const categoryIdRaw = fields.category_id;
      const categoryIdStr = Array.isArray(categoryIdRaw)
        ? categoryIdRaw[0]
        : categoryIdRaw;
      const category_id = categoryIdStr
        ? Number.parseInt(categoryIdStr)
        : undefined;

      const size = Array.isArray(fields.size)
        ? fields.size[0]
        : (fields.size as string | undefined);
      const ingredients = Array.isArray(fields.ingredients)
        ? fields.ingredients[0]
        : (fields.ingredients as string | undefined);
      const allergens = Array.isArray(fields.allergens)
        ? fields.allergens[0]
        : (fields.allergens as string | undefined);
      const nutritional_info = Array.isArray(fields.nutritional_info)
        ? fields.nutritional_info[0]
        : (fields.nutritional_info as string | undefined);

      const seasonalRaw = fields.seasonal;
      const seasonalStr = Array.isArray(seasonalRaw)
        ? seasonalRaw[0]
        : seasonalRaw;
      let seasonal = undefined;
      if (seasonalStr !== undefined) {
        seasonal = seasonalStr === "" ? null : seasonalStr;
      }

      const collection = Array.isArray(fields.collection)
        ? fields.collection[0]
        : (fields.collection as string | undefined);

      const stockRaw = fields.stock_quantity;
      const stockStr = Array.isArray(stockRaw) ? stockRaw[0] : stockRaw;
      const stock_quantity = stockStr ? Number.parseInt(stockStr) : undefined;

      const minOrderRaw = fields.min_order_quantity;
      const minOrderStr = Array.isArray(minOrderRaw)
        ? minOrderRaw[0]
        : minOrderRaw;
      const min_order_quantity = minOrderStr
        ? Number.parseInt(minOrderStr)
        : undefined;

      // Extract direct image URL if provided
      const providedImageUrl = Array.isArray(fields.image_url)
        ? fields.image_url[0]
        : (fields.image_url as string | undefined);

      // Handle file upload or use provided image URL
      let image_url: string | undefined = undefined;

      // If there's an uploaded file, process it
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];
        if (!allowedTypes.includes(file.mimetype || "")) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            error:
              "Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.",
          });
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          await client.query("ROLLBACK");
          return res
            .status(400)
            .json({ error: "File too large. Maximum size is 5MB." });
        }

        const data = fs.readFileSync(file.filepath);
        const fileName = `${Date.now()}_${path.basename(
          file.originalFilename || "upload"
        )}`;

        // Get previous image URL
        const previousImageResult = await client.query(
          "SELECT image_url FROM products WHERE product_id = $1",
          [productIdStr]
        );
        const previousImageUrl =
          previousImageResult.rows.length > 0
            ? previousImageResult.rows[0].image_url
            : null;

        if (previousImageUrl && previousImageUrl.includes("supabase.co")) {
          try {
            const prevFileName = previousImageUrl.split("/").pop();
            if (prevFileName) {
              const { error } = await supabase.storage
                .from("products")
                .remove([prevFileName]);

              if (error) {
                console.warn(
                  `Warning: Failed to delete previous image: ${error.message}`
                );
              }
            }
          } catch (error) {
            console.error(
              "Error deleting previous image from Supabase:",
              error
            );
          }
        }

        try {
          const { data: uploadData, error } = await supabase.storage
            .from("products")
            .upload(fileName, data, {
              contentType: file.mimetype || "application/octet-stream",
              upsert: true,
            });

          if (error) {
            throw new Error(`Error uploading to Supabase: ${error.message}`);
          }

          const { data: publicUrlData } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

          if (publicUrlData && publicUrlData.publicUrl) {
            image_url = publicUrlData.publicUrl;
          } else {
            throw new Error("Failed to get public URL from Supabase");
          }
        } catch (error) {
          await client.query("ROLLBACK");
          return res.status(500).json({ error: "Failed to upload image" });
        }
      }
      // Use the image URL provided directly in the form data
      else if (providedImageUrl) {
        image_url = providedImageUrl;
      }

      // Generate slug if name provided
      let finalSlug: string | undefined;
      if (name) {
        const baseSlug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        const result = await client.query(
          "SELECT 1 FROM products WHERE slug = $1 AND product_id != $2",
          [baseSlug, productIdStr]
        );

        if (result.rowCount && result.rowCount > 0) {
          await client.query("ROLLBACK");
          return res
            .status(400)
            .json({ error: "A product with this name already exists" });
        }

        finalSlug = baseSlug;
      }

      // Build update fields dynamically
      const updateFields: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (name !== undefined) {
        updateFields.push(`name = $${idx++}`);
        values.push(name);
      }
      if (finalSlug !== undefined) {
        updateFields.push(`slug = $${idx++}`);
        values.push(finalSlug);
      }
      if (description !== undefined) {
        updateFields.push(`description = $${idx++}`);
        values.push(description);
      }
      if (price !== undefined) {
        if (isNaN(price) || price < 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "Invalid price value" });
        }
        updateFields.push(`price = $${idx++}`);
        values.push(price);
      }
      if (is_available !== undefined) {
        updateFields.push(`is_available = $${idx++}`);
        values.push(is_available);
      }
      if (category_id !== undefined) {
        if (isNaN(category_id) || category_id <= 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "Invalid category_id" });
        }
        updateFields.push(`category_id = $${idx++}`);
        values.push(category_id);
      }
      if (size !== undefined) {
        updateFields.push(`size = $${idx++}`);
        values.push(size);
      }
      if (ingredients !== undefined) {
        updateFields.push(`ingredients = $${idx++}`);
        values.push(ingredients);
      }
      if (allergens !== undefined) {
        updateFields.push(`allergens = $${idx++}`);
        values.push(allergens);
      }
      if (nutritional_info !== undefined) {
        updateFields.push(`nutritional_info = $${idx++}`);
        values.push(nutritional_info);
      }
      if (seasonal !== undefined) {
        updateFields.push(`seasonal = $${idx++}`);
        values.push(seasonal);
      }
      if (collection !== undefined) {
        updateFields.push(`collection = $${idx++}`);
        values.push(collection);
      }
      if (stock_quantity !== undefined) {
        if (isNaN(stock_quantity) || stock_quantity < 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "Invalid stock_quantity" });
        }
        updateFields.push(`stock_quantity = $${idx++}`);
        values.push(stock_quantity);
      }
      if (min_order_quantity !== undefined) {
        if (isNaN(min_order_quantity) || min_order_quantity < 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "Invalid min_order_quantity" });
        }
        updateFields.push(`min_order_quantity = $${idx++}`);
        values.push(min_order_quantity);
      }
      if (image_url !== undefined) {
        updateFields.push(`image_url = $${idx++}`);
        values.push(image_url);
      }

      if (updateFields.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "No fields to update" });
      }

      values.push(productIdStr);
      const updateQuery = `
        UPDATE products
        SET ${updateFields.join(", ")}
        WHERE product_id = $${idx}
        RETURNING *;
      `;

      const result = await client.query(updateQuery, values);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Product not found" });
      }

      await client.query("COMMIT");

      return res.status(200).json({ product: result.rows[0] });
    }

    if (req.method === "DELETE") {
      // Check if product exists
      const existingProduct = await client.query(
        "SELECT image_url FROM products WHERE product_id = $1",
        [productIdStr]
      );

      if (existingProduct.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Product not found" });
      }

      const imageUrl = existingProduct.rows[0].image_url;

      // Delete product from database
      await client.query("DELETE FROM products WHERE product_id = $1", [
        productIdStr,
      ]);

      // Delete image from Supabase storage if exists
      if (imageUrl && imageUrl.includes("supabase.co")) {
        try {
          const fileName = imageUrl.split("/").pop();
          if (fileName) {
            const { error } = await supabase.storage
              .from("products")
              .remove([fileName]);

            if (error) {
              console.warn(
                `Warning: Failed to delete image from Supabase: ${error.message}`
              );
            }
          }
        } catch (error) {
          console.error("Error deleting image from Supabase:", error);
        }
      }

      await client.query("COMMIT");
      return res.status(200).json({ message: "Product deleted" });
    }
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("Error processing product request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
  }
}
