import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in the environment variables.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
});

export const testDatabaseConnection = async (retries = 5, delay = 2000) => {
  let attempts = 0;

  while (attempts < retries) {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT NOW()");
      client.release();
      console.log(`Database connected successfully: ${result.rows[0].now}`);
      return true;
    } catch (err: unknown) {
      attempts++;

      if (err instanceof Error) {
        console.error(
          `Database connection attempt ${attempts}/${retries} failed:`,
          err.message
        );
      } else {
        console.error(
          `Unknown error occurred during database connection attempt ${attempts}/${retries}`
        );
      }

      if (attempts >= retries) {
        console.error(
          "Max connection attempts reached. Database connection failed."
        );
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default pool;
