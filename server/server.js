import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./src/db/connectDB.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
   cors({
      origin: "http://localhost:3000",
      credentials: true,
   })
);

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routeDir = path.join(__dirname, "src", "routes");

// Function to load routes dynamically
const loadRoutes = async (app) => {
   try {
      const routeFiles = fs.readdirSync(routeDir);
      for (const file of routeFiles) {
         const routeName = path.basename(file, ".js");
         const route = await import(`./src/routes/${file}`);
         app.use(`/api/v1/${routeName}`, route.default);
         console.log(`Loaded route: /api/v1/${routeName}`);
      }
   } catch (err) {
      console.error("Error loading routes:", err);
   }
};

// Start server
const startServer = async () => {
   try {
      await connectDB(); // Database connection handled in connectDB.js
      await loadRoutes(app);
      app.listen(port, () => {
         console.log(`Server is running on port ${port}`);
      });
   } catch (error) {
      console.error("Server startup error:", error);
   }
};

// Call the server start function
startServer();