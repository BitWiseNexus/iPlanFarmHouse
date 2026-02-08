// ============================================
// Seed Script — populates database with sample data
// Run with: node seed.js
// ============================================
import pool, { testConnection } from "./db.js";
import fs from "fs";

async function seed() {
  await testConnection();

  // 1. Run the schema first
  const schema = fs.readFileSync(
    new URL("./schema.sql", import.meta.url),
    "utf8",
  );
  await pool.query(schema);
  console.log("✅ Schema created");

  // 2. Clear existing data
  await pool.query("DELETE FROM tasks");
  await pool.query("DELETE FROM users");
  console.log("🗑️  Cleared old data");

  // 3. Insert users
  const usersResult = await pool.query(`
    INSERT INTO users (name, role) VALUES
      ('Admin', 'admin'),
      ('Ram', 'worker'),
      ('Sita', 'worker'),
      ('Raju', 'worker')
    RETURNING id, name, role
  `);
  console.log("✅ Users seeded:", usersResult.rows);

  const workers = usersResult.rows.filter((u) => u.role === "worker");

  // 4. Insert sample tasks across this month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // Helper: format date as YYYY-MM-DD
  const fmt = (d) => d.toISOString().split("T")[0];

  const tasks = [
    // Past tasks (some pending = carry-forward, some completed)
    {
      title: "Sowing - Tomato seeds Zone 1",
      user: workers[0].id,
      date: new Date(year, month, 1),
      status: "completed",
    },
    {
      title: "Irrigation - Drip Zone 2",
      user: workers[1].id,
      date: new Date(year, month, 2),
      status: "completed",
    },
    {
      title: "Fertilizer - Zone 1 organic",
      user: workers[0].id,
      date: new Date(year, month, 4),
      status: "completed",
    },
    {
      title: "Irrigation - Zone 3 manual",
      user: workers[2].id,
      date: new Date(year, month, 5),
      status: "pending",
    },
    {
      title: "Weeding - Zone 2 beds",
      user: workers[1].id,
      date: new Date(year, month, 5),
      status: "completed",
    },
    {
      title: "Pest Control - Zone 2 spray",
      user: workers[0].id,
      date: new Date(year, month, 6),
      status: "pending",
    },
    {
      title: "Irrigation - Zone 1 drip",
      user: workers[0].id,
      date: new Date(year, month, 6),
      status: "completed",
    },
    {
      title: "Fertilizer - Zone 3 compost",
      user: workers[2].id,
      date: new Date(year, month, 6),
      status: "pending",
    },

    // Current week tasks
    {
      title: "Transplant - Chilli Zone 2",
      user: workers[1].id,
      date: new Date(year, month, today.getDate()),
      status: "pending",
    },
    {
      title: "Irrigation - Zone 1 drip x2",
      user: workers[0].id,
      date: new Date(year, month, today.getDate()),
      status: "pending",
    },
    {
      title: "Pest Control - Zone 2 neem",
      user: workers[1].id,
      date: new Date(year, month, today.getDate()),
      status: "pending",
    },

    // Future tasks
    {
      title: "Sowing - Bitter Gourd Zone 1",
      user: workers[0].id,
      date: new Date(year, month, today.getDate() + 1),
      status: "pending",
    },
    {
      title: "Harvest - Zone 3 tomatoes",
      user: workers[2].id,
      date: new Date(year, month, today.getDate() + 3),
      status: "pending",
    },
    {
      title: "Irrigation - Zone 1 manual",
      user: workers[0].id,
      date: new Date(year, month, today.getDate() + 3),
      status: "pending",
    },
    {
      title: "Fertilizer - Zone 2 NPK",
      user: workers[1].id,
      date: new Date(year, month, today.getDate() + 5),
      status: "pending",
    },
    {
      title: "Irrigation - Zone 3 drip",
      user: workers[2].id,
      date: new Date(year, month, today.getDate() + 7),
      status: "pending",
    },
    {
      title: "Harvest - Zone 3 chilli",
      user: workers[2].id,
      date: new Date(year, month, today.getDate() + 10),
      status: "pending",
    },
    {
      title: "Transplant - Zone 1 okra",
      user: workers[0].id,
      date: new Date(year, month, today.getDate() + 14),
      status: "pending",
    },
  ];

  for (const t of tasks) {
    await pool.query(
      `INSERT INTO tasks (title, assigned_user_id, scheduled_date, status, completion_date)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        t.title,
        t.user,
        fmt(t.date),
        t.status,
        t.status === "completed" ? fmt(t.date) : null,
      ],
    );
  }
  console.log(`✅ ${tasks.length} tasks seeded`);

  await pool.end();
  console.log("🎉 Seeding complete!");
}

seed().catch(console.error);
