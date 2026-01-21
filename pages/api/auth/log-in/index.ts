import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/utils/supabase";
import connectionPool from "@/utils/db";
import type { LoginRequestBody } from "@/types/auth";
import { jwtDecode } from "jwt-decode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle preflight requests
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

  const { email, password, rememberMe }: LoginRequestBody = req.body;

  // Validate the request body
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide both email and password." });
  }

  const client = await connectionPool.connect();

  try {
    // Authenticate user with Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data || !data.user) {
      console.error("Supabase Auth Error:", authError);
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Extract the access token and user ID
    const token = data.session.access_token;
    const decodedToken = jwtDecode<{ sub: string }>(token);
    const userId = decodedToken.sub;

    // Query for user role based on userId
    const roleQuery = `
      SELECT r.role_name 
      FROM roles r
      LEFT JOIN admin a ON a.user_id = $1 AND r.role_id = a.role_id
      LEFT JOIN public.users u ON u.user_id = $1 AND r.role_id = u.role_id
      WHERE a.user_id IS NOT NULL OR u.user_id IS NOT NULL
      LIMIT 1;
    `;

    const { rows } = await client.query(roleQuery, [userId]);

    if (rows.length === 0) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { role_name } = rows[0];

    // Set session cookies with HttpOnly flag

    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();

    const isProd = process.env.NODE_ENV === "production"; // check if production

    const sameSiteFlag = isProd ? "Strict" : "Lax";
    const secureFlag = isProd ? "; Secure" : "";

    const sessionCookie = `user_session=${encodeURIComponent(
      `${userId}:${role_name}`
    )}; Path=/; Max-Age=${maxAge}; Expires=${expires}; ; HttpOnly${secureFlag}; SameSite=${sameSiteFlag}`;
    const roleCookie = `user_role=${encodeURIComponent(
      role_name
    )}; Path=/; Max-Age=${maxAge}; Expires=${expires}; ; HttpOnly${secureFlag}; SameSite=${sameSiteFlag}`;
    const tokenCookie = `token=${token}; Path=/; Max-Age=${maxAge}; ; HttpOnly${secureFlag}; SameSite=${sameSiteFlag}`;

    res.setHeader("Set-Cookie", [sessionCookie, roleCookie, tokenCookie]);

    // Respond with success
    return res.status(200).json({
      message: "Login successful",
      token,
      userId,
      role: role_name,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "An error occurred during login." });
  } finally {
    client.release();
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
  },
};
