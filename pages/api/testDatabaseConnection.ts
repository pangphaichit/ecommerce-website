import type { NextApiRequest, NextApiResponse } from "next";
import { testDatabaseConnection } from "../../utils/db";
import pool from "../../utils/db";

const getDatabaseInfo = async () => {
  const client = await pool.connect();
  const result = await client.query("SELECT NOW() as time");
  client.release();
  return result.rows[0];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const isConnected = await testDatabaseConnection();

    if (isConnected) {
      const dbInfo = await getDatabaseInfo();

      res.status(200).json({
        success: true,
        message: "Database connected successfully",
        timestamp: dbInfo.time,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }
  } catch (error) {
    console.error("Error testing database connection:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: errorMessage,
    });
  }
}
