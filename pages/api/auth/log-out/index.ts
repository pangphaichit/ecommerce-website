import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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

  const expiredCookie =
    "Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; Secure; SameSite=Strict";

  res.setHeader("Set-Cookie", [
    `user_session=; ${expiredCookie}`,
    `user_role=; ${expiredCookie}`,
    `token=; ${expiredCookie}`,
  ]);

  res.status(200).json({ message: "Logged out successfully" });
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
  },
};
