// ============================================
// Database Configuration — PostgreSQL (Neon)
// ============================================
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});


export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected at:", result.rows[0].now);
  } catch (err) {
    console.error("⚠️  Database connection failed:", err.message);
    console.error("   The server will start, but DB queries will fail.");
    console.error("   Check your DATABASE_URL in .env file.");
  }
}

export default pool;
