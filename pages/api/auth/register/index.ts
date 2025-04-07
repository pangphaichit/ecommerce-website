import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import supabase from "@/utils/supabase";
import { RegistrationRequestBody } from "../../../../types/auth/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password, firstName, lastName }: RegistrationRequestBody =
    req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      error: "Some required fields are missing. Please fill in all fields.",
    });
  }

  const client = await connectionPool.connect();

  try {
    await client.query("BEGIN");

    // Check if the user already exists in Supabase Auth
    const emailCheckQuery = `SELECT id FROM auth.users WHERE email = $1`;
    const { rows: existingUser } = await client.query(emailCheckQuery, [email]);

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Create user in Supabase Auth
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
        },
      },
    });

    if (supabaseError) {
      console.error("Supabase Error:", supabaseError);
      return res
        .status(400)
        .json({ error: "Failed to create user. Please try again." });
    }

    const supabaseUserId = data.user?.id;
    if (!supabaseUserId) {
      return res.status(500).json({ error: "Supabase user ID is missing" });
    }

    // Fetch role_id for "user" from the roles table
    const roleQuery = `SELECT role_id FROM roles WHERE role_name = $1`;
    const { rows: roleRows } = await client.query(roleQuery, ["user"]);

    if (roleRows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(500).json({ error: "Role not found" });
    }

    const roleId = roleRows[0]?.role_id;

    // Insert user data into the public.users table
    const insertUserQuery = `
      INSERT INTO public.users (
        user_id, 
        first_name, 
        last_name, 
        full_name, 
        role_id
      ) VALUES ($1, $2, $3, $4, $5)
    `;

    const insertValues = [
      supabaseUserId,
      firstName,
      lastName,
      `${firstName} ${lastName}`,
      roleId,
    ];

    await client.query(insertUserQuery, insertValues);

    await client.query("COMMIT");

    res.status(201).json({
      message: "User created successfully",
      userId: supabaseUserId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Registration Error:", error);
    res.status(500).json({
      error: "An error occurred during registration",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    client.release();
  }
}

// CORS configuration for API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
