import express from "express";
import cors from "cors";
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

const app = express();
app.use(cors());
app.use(express.json());

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

    // Insert new user
    const [result] = await db
      .insert(users)
      .values({ name, email, password, role })
      .returning();

    // For admins, send `adminId` explicitly
    if (role === "admin") {
      return res.json({
        message: "Admin created",
        adminId: result.userId, 
        user: result,
      });
    }

    // For users
    res.json({ message: "User created", user: result });

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

    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({ message: "Login successful", userId: user.userId, role: user.role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ FORMS & STRUCTURE ************/

app.get("/forms", async (req, res) => {
  try {
    const result = await db.select().from(forms);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/forms/:formId", async (req, res) => {
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

/************ APPLICATIONS ************/
app.post("/applications/start", async (req, res) => {
  try {
    const { userId, formId } = req.body;
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

app.post("/applications/:id/answers", async (req, res) => {
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

app.post("/applications/:id/submit", async (req, res) => {
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

app.get("/admin/applications", async (req, res) => {
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