import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { verify } from "jsonwebtoken";
import supabase from "@/utils/supabase";
import { promises as fs } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handlers = async (req: NextApiRequest, res: NextApiResponse) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Parse cookies manually
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter(([key]) => key && key.length > 0)
      .map(([key, ...v]) => [key, decodeURIComponent(v.join("="))])
  );

  const token = cookies.token;
  const role = cookies.user_role;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token found" });
  }

  try {
    // Verify and decode the token to get user information
    const decoded = verify(token, secret);

    // Check role after verifying token
    if (role !== "admin") {
      console.log("Access denied: User is not an admin");
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (req.method === "POST") {
    return handleFileUpload(req, res);
  } else if (req.method === "DELETE") {
    return handleFileDelete(req, res);
  } else {
    return res
      .status(405)
      .json({ status: "fail", message: "Method not allowed" });
  }
};

const handleFileUpload = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const files = await new Promise<Array<formidable.File>>(
      (resolve, reject) => {
        const form = formidable({ multiples: true });
        const fileList: formidable.File[] = [];

        form.on("file", (_, file) => {
          console.log("File received:", {
            name: file.originalFilename,
            type: file.mimetype,
          });
          fileList.push(file);
        });

        form.on("end", () => resolve(fileList));
        form.on("error", reject);

        form.parse(req);
      }
    );

    if (!files.length) {
      return res
        .status(400)
        .json({ status: "fail", message: "No files uploaded" });
    }

    const urls: string[] = [];
    console.log(`Uploading ${files.length} files to Supabase...`);

    for (const file of files) {
      const fileData = await fs.readFile(file.filepath);
      const fileName = `${Date.now()}_${file.originalFilename}`;
      console.log(`Uploading file: ${fileName}`);

      const { error: uploadError } = await supabase.storage
        .from("products") // products bucket
        .upload(fileName, fileData, {
          cacheControl: "3600",
          contentType: file.mimetype || "application/octet-stream",
        });

      if (uploadError) {
        console.error(
          `Error uploading file "${file.originalFilename}":`,
          uploadError.message
        );
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from("products").getPublicUrl(fileName); // products bucket

      if (!data?.publicUrl) {
        console.error(`Failed to retrieve public URL for file: ${fileName}`);
        throw new Error("Failed to retrieve public URL");
      }

      console.log(`Public URL for file "${fileName}": ${data.publicUrl}`);
      urls.push(data.publicUrl);
    }

    return res.status(200).json({
      status: "ok",
      message: "Files uploaded successfully",
      urls,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    return res.status(500).json({
      status: "fail",
      message: (error as Error).message || "Internal server error",
    });
  }
};

const handleFileDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // For DELETE requests, we'll parse JSON body
    // We need to manually parse the body since bodyParser is disabled
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }

    const buffer = Buffer.concat(chunks);
    let body;

    try {
      body = JSON.parse(buffer.toString());
    } catch (error) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid JSON body",
      });
    }

    // Validate request body
    const { imageUrl } = body;

    if (!imageUrl) {
      return res.status(400).json({
        status: "fail",
        message: "Image URL is required",
      });
    }

    // Extract the file name from the URL
    const fileName = extractFileNameFromUrl(imageUrl);

    if (!fileName) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid image URL format",
      });
    }

    console.log(`Deleting file: ${fileName}`);

    // Delete the file from Supabase storage
    const { error: deleteError } = await supabase.storage
      .from("products")
      .remove([fileName]);

    if (deleteError) {
      console.error(`Error deleting file "${fileName}":`, deleteError.message);
      throw new Error(deleteError.message);
    }

    return res.status(200).json({
      status: "ok",
      message: "File deleted successfully",
      deletedFile: fileName,
    });
  } catch (error) {
    console.error("Error during file deletion:", error);
    return res.status(500).json({
      status: "fail",
      message: (error as Error).message || "Internal server error",
    });
  }
};

// Helper function to extract file name from the URL
const extractFileNameFromUrl = (url: string): string | null => {
  try {
    const match = url.match(/\/products\/([^?]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    return null;
  } catch {
    return null;
  }
};

export default handlers;
