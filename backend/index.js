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
import { validateAnswers, sanitizeAnswers } from "./validation.js";

// Import the crypto module for generating random IDs
import crypto from "crypto";

// Import the uuid library for generating valid UUIDs
import { v4 as uuidv4 } from "uuid";

// Function to generate a valid UUID and truncate it for display
function generate6CharId() {
  return uuidv4().split("-")[0]; // Generate a UUID and take the first segment (6 characters)
}

import multer from "multer";
//const path = require("path");
import path from "path";
// Update multer configuration to include original file extension
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Extract original file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Save file with original extension
  }
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const SALT_ROUNDS = 10;

/************ HEALTH CHECK ************/
app.get("/", (req, res) => res.send("Backend is working!"));

/************ SIGNUP ************/
app.post("/test/add-user", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.role, role)));

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: role === "admin" ? "ADMIN_EMAIL_TAKEN" : "USER_EXISTS" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
        userId: uuidv4(), // Generate valid UUID for database
      })
      .returning();

    if (role === "admin") {
      return res.json({
        message: "Admin created",
        adminId: result.userId.substring(0, 6), // Display truncated UUID
        user: { ...result, password: undefined },
      });
    }

    res.json({
      message: "User created",
      user: { ...result, password: undefined },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ LOGIN ************/
app.post("/test/login", async (req, res) => {
  try {
    const { email, password, role, adminId } = req.body;

    let user;

    if (role === "admin") {
  [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.role, "admin")));

  if (!user) {
    return res.status(404).json({ error: "Admin account not found" });
  }
}
    else {
      [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.role, role)));

      if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // ensure draft exists
    if (user.role === "user") {
      const [firstForm] = await db.select().from(forms).limit(1);

      if (firstForm) {
        const [existingDraft] = await db
          .select()
          .from(applications)
          .where(
            and(
              eq(applications.userId, user.userId),
              eq(applications.formId, firstForm.formId),
              eq(applications.status, "draft")
            )
          )
          .limit(1);

        if (!existingDraft) {
          await db.insert(applications).values({
            userId: user.userId,
            formId: firstForm.formId,
            status: "draft",
          });
        }
      }
    }

    const token = generateToken({ userId: user.userId, role: user.role });

    res.json({
      message: "Login successful",
      userId: user.userId,
      role: user.role,
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ RECOVER ADMIN ID ************/
app.post("/test/recover-admin-id", async (req, res) => {
  try {
    const { email } = req.body;

    const [admin] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.role, "admin")));

    if (!admin) {
      return res.status(404).json({ error: "No admin account found" });
    }

    res.json({ adminId: admin.userId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/************ RESET PASSWORD ************/
app.post("/test/reset-password", async (req, res) => {
  try {
    const { adminId, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.userId, adminId));

    res.json({ message: "Password updated successfully." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/************ FORMS ************/
app.get("/forms", authenticateToken, async (req, res) => {
  try {
    const result = await db.select().from(forms);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/************ GET FORM STRUCTURE ************/
app.get("/forms/:formId", authenticateToken, async (req, res) => {
  try {
    const { formId } = req.params;

    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.formId, formId));

    const sections = await db
      .select()
      .from(formSections)
      .where(eq(formSections.formId, formId))
      .orderBy(asc(formSections.order));

    const result = [];

    for (const section of sections) {

      const questions = await db
        .select()
        .from(formQuestions)
        .where(eq(formQuestions.sectionId, section.sectionId))
        .orderBy(asc(formQuestions.order));

      const questionList = [];

      for (const question of questions) {

        const options = await db
          .select()
          .from(questionOptions)
          .where(eq(questionOptions.questionId, question.questionId))
          .orderBy(asc(questionOptions.order));

        questionList.push({
          ...question,
          options
        });

      }

      result.push({
        ...section,
        questions: questionList
      });

    }

    res.json({ form, sections: result });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/************ START APPLICATION ************/
app.post("/applications/start", authenticateToken, requireRole("user"), async (req, res) => {
  try {
    const { userId, formId } = req.body;

    const [existingDraft] = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.userId, userId),
          eq(applications.formId, formId),
          eq(applications.status, "draft")
        )
      );

    if (existingDraft) return res.json(existingDraft);

    const [application] = await db
      .insert(applications)
      .values({ userId, formId, status: "draft" })
      .returning();

    res.json(application);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/************ SAVE ANSWERS ************/
app.post("/applications/:id/answers", authenticateToken, requireRole("user"), async (req, res) => {
  try {

    const { id } = req.params;
    const { answers } = req.body;

    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.applicationId, id));

    const sections = await db
      .select()
      .from(formSections)
      .where(eq(formSections.formId, application.formId));

    const allQuestions = [];

    for (const section of sections) {
      const questions = await db
        .select()
        .from(formQuestions)
        .where(eq(formQuestions.sectionId, section.sectionId));
      allQuestions.push(...questions);
    }

    const validationErrors = validateAnswers(allQuestions, answers);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors
      });
    }

    const sanitizedAnswers = sanitizeAnswers(answers);

    const rows = sanitizedAnswers.map((a) => ({
      applicationId: id,
      questionId: a.questionId,
      answer: a.answer
    }));

    await db.delete(responses).where(eq(responses.applicationId, id));
    await db.insert(responses).values(rows);

    res.json({ message: "Answers saved successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/************ SUBMIT APPLICATION ************/
app.post("/applications/:id/submit", authenticateToken, requireRole("user"), async (req, res) => {
  try {

    const { id } = req.params;

    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.applicationId, id));

    if (application.status === "submitted") {
      return res.status(400).json({ error: "Application already submitted" });
    }

    await db
      .update(applications)
      .set({ status: "submitted" })
      .where(eq(applications.applicationId, id));

    res.json({
      message: "Application submitted successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/************ ADMIN ROUTES ************/

// List all applications
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

    res.json(allApplications);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Get single application
app.get("/admin/applications/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {

    const { id } = req.params;

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

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const userAnswers = await db
      .select({
        questionId: responses.questionId,
        answer: responses.answer,
        questionText: formQuestions.questionText,
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

// File upload endpoint
app.post("/upload", authenticateToken, requireRole("user"), upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Respond with the file path
    res.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File upload failed" });
  }
});

/************ START SERVER ************/
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});