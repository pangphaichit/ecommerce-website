// /api/auth/me.ts
import { NextApiRequest, NextApiResponse } from "next";
import { jwtDecode } from "jwt-decode";
import connectionPool from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const token = req.cookies.token;
  const role = req.cookies.user_role;

  if (!token || !role) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const client = await connectionPool.connect();

  try {
    const decoded = jwtDecode<{ sub: string }>(token);
    return res.status(200).json({
      userId: decoded.sub,
      role,
    });
  } catch (err) {
    console.error("Error decoding token:", err);
    return res.status(401).json({ error: "Invalid token" });
  } finally {
    client.release();
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
  },
};
