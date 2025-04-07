import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/utils/supabase";

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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error("Supabase Auth Error:", error);
      return res
        .status(400)
        .json({ error: "Failed to send password reset email" });
    }

    return res
      .status(200)
      .json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
}
