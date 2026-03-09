import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import db from "./db/index.js";
import { eq, and } from "drizzle-orm";
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

const SALT_ROUNDS = 10;

/************ HEALTH CHECK ************/
app.get("/", (req, res) => res.send("Backend is working!"));

/************ SIGNUP ************/
app.post("/test/add-user", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user/email already exists
    const existing = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.role, role)));

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: role === "admin" ? "ADMIN_EMAIL_TAKEN" : "USER_EXISTS" });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user with hashed password
    const [result] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning();

    // For admins, send `adminId` explicitly
    if (role === "admin") {
      return res.json({
        message: "Admin created",
        adminId: result.userId,
        user: { ...result, password: undefined },
      });
    }

    // For users
    res.json({ message: "User created", user: { ...result, password: undefined } });

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
        .where(eq(users.userId, adminId));

      if (!user) return res.status(404).json({ error: "Admin ID not found" });

    } else {
      [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.role, role)));

      if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Ensure a draft application exists for user logins
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

    // Generate JWT token
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
    if (!email) return res.status(400).json({ error: "Email is required" });

    const [admin] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.role, "admin")));

    if (!admin) {
      return res.status(404).json({ error: "No admin account found for this email." });
    }

    res.json({ adminId: admin.userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ RESET PASSWORD ************/
app.post("/test/reset-password", async (req, res) => {
  try {
    const { adminId, newPassword } = req.body;
    if (!adminId || !newPassword) {
      return res.status(400).json({ error: "Admin ID and new password are required." });
    }

    const [admin] = await db
      .select()
      .from(users)
      .where(eq(users.userId, adminId));

    if (!admin) {
      return res.status(404).json({ error: "Admin ID not found." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.userId, adminId));

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ FORMS & STRUCTURE (Protected — any authenticated user) ************/

app.get("/forms", authenticateToken, async (req, res) => {
  try {
    const result = await db.select().from(forms);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/forms/:formId", authenticateToken, async (req, res) => {
  try {
    const { formId } = req.params;
    const [form] = await db.select().from(forms).where(eq(forms.formId, formId));
    if (!form) return res.status(404).json({ error: "Form not found" });

    const sections = await db.select().from(formSections).where(eq(formSections.formId, formId));

    const result = [];
    for (const section of sections) {
      const questions = await db
        .select()
        .from(formQuestions)
        .where(eq(formQuestions.sectionId, section.sectionId));

      const questionList = [];
      for (const question of questions) {
        const options = await db
          .select()
          .from(questionOptions)
          .where(eq(questionOptions.questionId, question.questionId));

        questionList.push({ ...question, options });
      }

      result.push({ ...section, questions: questionList });
    }

    res.json({ form, sections: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ APPLICATIONS (Protected — user role only) ************/
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
      )
      .limit(1);

    if (existingDraft) {
      return res.json(existingDraft);
    }

    const [application] = await db
      .insert(applications)
      .values({ userId, formId, status: "draft" })
      .returning();

    res.json(application);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/applications/:id/answers", authenticateToken, requireRole("user"), async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const rows = answers.map(a => ({
      applicationId: id,
      questionId: a.questionId,
      answer: a.answer
    }));

    await db.insert(responses).values(rows);
    res.json({ message: "Answers saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/applications/:id/submit", authenticateToken, requireRole("user"), async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db
      .update(applications)
      .set({ status: "submitted" })
      .where(eq(applications.applicationId, id))
      .returning();

    res.json({ message: "Application submitted", applicationId: updated.applicationId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ ADMIN ROUTES (Protected — admin role only) ************/
app.get("/admin/applications", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.select().from(applications);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ START SERVER ************/
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
