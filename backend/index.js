import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { eq, and, asc } from "drizzle-orm";

import db from "./db/index.js";
import {
  users,
  forms,
  formSections,
  formQuestions,
  questionOptions,
  applications,
  responses
} from "./db/schema.js";

import { authenticateToken, requireRole, generateToken } from "./middleware/auth.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const SALT_ROUNDS = 10;

/************ ADMIN ROUTES ************/
// Get list of all applications
app.get("/admin/applications", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const allApplications = await db
      .select({
        applicationId: applications.applicationId,
        userId: applications.userId,
        status: applications.status,
        username: users.name, 
        createdAt: applications.createdAt
      })
      .from(applications)
      .innerJoin(users, eq(applications.userId, users.userId));
    return res.json(allApplications); 
  } catch (err) { return res.status(500).json({ error: "Failed to fetch applications" }); }
});

// Get SINGLE application with Question Text labels
app.get("/admin/applications/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get Application & User info
    const [application] = await db
      .select({
        applicationId: applications.applicationId,
        userId: applications.userId,
        status: applications.status,
        createdAt: applications.createdAt,
        username: users.name
      })
      .from(applications)
      .innerJoin(users, eq(applications.userId, users.userId))
      .where(eq(applications.applicationId, id))
      .limit(1);

    if (!application) return res.status(404).json({ error: "Application not found" });

    // 2. Fetch answers JOINED with questions to get the labels
    const userAnswers = await db
      .select({
        questionId: responses.questionId,
        answer: responses.answer,
        questionText: formQuestions.questionText, // Pulling actual question text
        fieldType: formQuestions.fieldType
      })
      .from(responses)
      .innerJoin(formQuestions, eq(responses.questionId, formQuestions.questionId))
      .where(eq(responses.applicationId, id));

    res.json({
      ...application,
      answers: userAnswers,
      fileBaseUrl: "http://localhost:3000/uploads/"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/************ REST OF YOUR ROUTES (Login, Signup, etc) ************/
// ... (Keep your existing login/signup/form routes here)

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));