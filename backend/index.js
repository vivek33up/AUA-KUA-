import express from "express";
import cors from "cors";
import db from "./db/index.js";
import { eq, and, sql } from "drizzle-orm";
import {
  users,
  complianceCategories,
  complianceControls,
  auditSessions,
  auditResponses,
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
app.get("/", (req, res) => res.send("AUA/KUA Compliance Backend is running!"));

/* ============================================================
   AUTH
   ============================================================ */

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }
    if (!["user", "auditor", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existing = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.role, role)));

    if (existing.length > 0) {
      return res.status(400).json({ error: "EMAIL_TAKEN" });
    }

    const [result] = await db
      .insert(users)
      .values({ name, email, password, role, organization: organization || null })
      .returning();

    res.json({ message: "Account created", user: { userId: result.userId, name: result.name, email: result.email, role: result.role, organization: result.organization } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.role, role)));

    if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });
    if (user.password !== password) {
      return res.status(401).json({ error: "INVALID_PASSWORD" });
    }

    res.json({
      message: "Login successful",
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   COMPLIANCE CONTROLS (read-only)
   ============================================================ */

app.get("/api/controls", async (req, res) => {
  try {
    const categories = await db
      .select()
      .from(complianceCategories)
      .orderBy(complianceCategories.sortOrder);

    const controls = await db
      .select()
      .from(complianceControls)
      .orderBy(complianceControls.controlNo);

    const grouped = categories.map(cat => ({
      ...cat,
      controls: controls.filter(c => c.categoryId === cat.categoryId)
    }));

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   AUDIT SESSIONS
   ============================================================ */

// Create a new audit
app.post("/api/audits", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const [audit] = await db
      .insert(auditSessions)
      .values({ userId, status: "draft" })
      .returning();

    // Pre-populate all control responses
    const controls = await db.select().from(complianceControls);
    if (controls.length > 0) {
      const rows = controls.map(c => ({
        auditId: audit.auditId,
        controlId: c.controlId,
      }));
      await db.insert(auditResponses).values(rows);
    }

    res.json(audit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// List audits (role-filtered)
app.get("/api/audits", async (req, res) => {
  try {
    const { role, userId } = req.query;
    let result;

    if (role === "admin") {
      result = await db.select().from(auditSessions).orderBy(auditSessions.createdAt);
    } else if (role === "auditor") {
      result = await db.select().from(auditSessions).where(eq(auditSessions.auditorId, userId)).orderBy(auditSessions.createdAt);
    } else {
      result = await db.select().from(auditSessions).where(eq(auditSessions.userId, userId)).orderBy(auditSessions.createdAt);
    }

    // Enrich with user names
    const enriched = [];
    for (const audit of result) {
      const [u] = await db.select({ name: users.name, organization: users.organization }).from(users).where(eq(users.userId, audit.userId));
      let auditorName = null;
      if (audit.auditorId) {
        const [a] = await db.select({ name: users.name }).from(users).where(eq(users.userId, audit.auditorId));
        auditorName = a?.name || null;
      }
      enriched.push({ ...audit, userName: u?.name, userOrganization: u?.organization, auditorName });
    }

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get single audit with all responses
app.get("/api/audits/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [audit] = await db.select().from(auditSessions).where(eq(auditSessions.auditId, id));
    if (!audit) return res.status(404).json({ error: "Audit not found" });

    const [u] = await db.select({ name: users.name, organization: users.organization, email: users.email }).from(users).where(eq(users.userId, audit.userId));
    let auditorInfo = null;
    if (audit.auditorId) {
      const [a] = await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.userId, audit.auditorId));
      auditorInfo = a || null;
    }

    const resps = await db.select().from(auditResponses).where(eq(auditResponses.auditId, id));

    const categories = await db.select().from(complianceCategories).orderBy(complianceCategories.sortOrder);
    const controls = await db.select().from(complianceControls).orderBy(complianceControls.controlNo);

    const grouped = categories.map(cat => ({
      ...cat,
      controls: controls
        .filter(c => c.categoryId === cat.categoryId)
        .map(c => {
          const resp = resps.find(r => r.controlId === c.controlId);
          return { ...c, response: resp || null };
        })
    }));

    res.json({ audit: { ...audit, userName: u?.name, userOrganization: u?.organization, userEmail: u?.email, auditorInfo }, categories: grouped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update audit status
app.put("/api/audits/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["draft", "in_progress", "submitted", "under_review", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updates = { status, updatedAt: new Date() };
    if (status === "submitted") updates.submittedAt = new Date();

    const [updated] = await db
      .update(auditSessions)
      .set(updates)
      .where(eq(auditSessions.auditId, id))
      .returning();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Assign auditor
app.post("/api/audits/:id/assign", async (req, res) => {
  try {
    const { id } = req.params;
    const { auditorId } = req.body;

    const [updated] = await db
      .update(auditSessions)
      .set({ auditorId, status: "under_review", updatedAt: new Date() })
      .where(eq(auditSessions.auditId, id))
      .returning();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   AUDIT RESPONSES
   ============================================================ */

app.put("/api/audits/:id/responses", async (req, res) => {
  try {
    const { id } = req.params;
    const { responses: respList } = req.body;

    for (const r of respList) {
      const existing = await db
        .select()
        .from(auditResponses)
        .where(and(eq(auditResponses.auditId, id), eq(auditResponses.controlId, r.controlId)));

      if (existing.length > 0) {
        await db.update(auditResponses)
          .set({
            complianceStatus: r.complianceStatus ?? existing[0].complianceStatus,
            auditorObservation: r.auditorObservation ?? existing[0].auditorObservation,
            managementComments: r.managementComments ?? existing[0].managementComments,
          })
          .where(eq(auditResponses.responseId, existing[0].responseId));
      } else {
        await db.insert(auditResponses).values({
          auditId: id,
          controlId: r.controlId,
          complianceStatus: r.complianceStatus || null,
          auditorObservation: r.auditorObservation || null,
          managementComments: r.managementComments || null,
        });
      }
    }

    await db.update(auditSessions).set({ updatedAt: new Date() }).where(eq(auditSessions.auditId, id));

    res.json({ message: "Responses saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   AUDITORS LIST (for admin assignment)
   ============================================================ */

app.get("/api/auditors", async (req, res) => {
  try {
    const result = await db
      .select({ userId: users.userId, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.role, "auditor"));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   FORM ENDPOINTS (kept from original)
   ============================================================ */

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