import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Import constants and utilities
import { port } from "./utils/constants.js";
import { routes } from "./routes/index.js";
import { connect } from "./config/db.js";
import { initSocketIO } from "./socket/SocketIOManager.js";

// Load environment variables from .env file
dotenv.config();

// Get the directory name and file name for path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();

// Connect to MongoDB
connect(); // This will use the MONGO_URI from .env

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (if needed for image uploads)
app.use("/api/blog/upload-image", express.static(path.join(__dirname, "uploads")));

// Mount API routes
app.use("/api", routes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

// Start the server and listen for incoming requests
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
