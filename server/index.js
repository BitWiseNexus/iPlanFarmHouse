// ============================================
// iPlanFarmHouse — Express Server Entry Point
// ============================================
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// --- Health check ---
app.get("/", (req, res) => {
  res.json({ message: "iPlanFarmHouse API is running 🌱" });
});

// --- Start server ---
async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🌱 Server running on http://localhost:${PORT}`);
  });
}

start();
