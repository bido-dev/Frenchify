import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import courseRoutes from "./routes/course.routes";
import questionRoutes from "./routes/question.routes";
import studentRoutes from "./routes/student.routes";
import teacherRoutes from "./routes/teacher.routes";

const app = express();

// Allow Cross-Origin Requests (Vital for Frontend to talk to Backend)
app.use(cors({ origin: true }));
app.use(express.json());

// Register Routes
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/courses", courseRoutes);
app.use("/questions", questionRoutes);
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);

// Export the API to Firebase Cloud Functions
export const api = functions.https.onRequest(app);