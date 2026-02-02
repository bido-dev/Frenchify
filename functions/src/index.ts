import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";

// Initialize Express App
const app = express();

// Middleware
app.use(cors({ origin: true })); // Allows requests from your React Frontend
app.use(express.json());         // Parses incoming JSON data

// Health Check Route (To test if it works)
app.get("/", (req, res) => {
    res.status(200).send("Frenchify API is running!");
});

// Export the Express App as a Cloud Function
// This creates a single HTTPS endpoint named 'api'
export const api = functions.https.onRequest(app);