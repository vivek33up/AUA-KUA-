import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import db from "./db/index.js";
import crypto from "crypto";
import { eq, and, asc } from "drizzle-orm";
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
      .values({ name, email, password: hashedPassword, role })
      .returning();

    if (role === "admin") {
      return res.json({
        message: "Admin created",
        adminId: result.userId,
        user: { ...result, password: undefined },
      });
    }

    res.json({ message: "User created", user: { ...result, password: undefined } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ LOGIN ************/
// app.post("/test/login", async (req, res) => {
//   try {
//     const { email, password, role, adminId } = req.body;
//     let user;

//     if (role === "admin") {
//       [user] = await db
//         .select()
//         .from(users)
//         .where(eq(users.userId, adminId));

//       if (!user) return res.status(404).json({ error: "Admin ID not found" });
//     } else {
//       [user] = await db
//         .select()
//         .from(users)
//         .where(and(eq(users.email, email), eq(users.role, role)));

//       if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
    
//     // DEBUG LOGS (You can remove these after testing)
//     if (!isMatch) {
//       console.log(`[Login Alert] Failed attempt for ${role}. ID/Email: ${adminId || email}`);
//       return res.status(401).json({ error: "Incorrect password" });
//     }

//     if (user.role === "user") {
//       const [firstForm] = await db.select().from(forms).limit(1);
//       if (firstForm) {
//         const [existingDraft] = await db
//           .select()
//           .from(applications)
//           .where(
//             and(
//               eq(applications.userId, user.userId),
//               eq(applications.formId, firstForm.formId),
//               eq(applications.status, "draft")
//             )
//           )
//           .limit(1);

//         if (!existingDraft) {
//           await db.insert(applications).values({
//             userId: user.userId,
//             formId: firstForm.formId,
//             status: "draft",
//           });
//         }
//       }
//     }

//     const token = generateToken({ userId: user.userId, role: user.role });

//     res.json({
//       message: "Login successful",
//       userId: user.userId,
//       role: user.role,
//       token,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

/************ LOGIN (UPDATED) ************/
/************ LOGIN (REFINED) ************/
app.post("/test/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Unified lookup: Both Admin and User now look up by email + role
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.role, role)));

    if (!user) {
      return res.status(404).json({ 
        error: role === "admin" ? "Admin account not found" : "USER_NOT_FOUND" 
      });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[Login Alert] Failed password for ${email} (${role})`);
      return res.status(401).json({ error: "Incorrect password" });
    }

    // 3. User-Specific Logic: Ensure a draft application exists
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

    // 4. Generate Session Token
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

/************ REQUEST PASSWORD RESET ************/
app.post("/test/forgot-password", async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.role, role)));

    if (!user) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await db
      .update(users)
      .set({ 
        resetToken: token, 
        resetTokenExpiry: expiry 
      })
      .where(eq(users.userId, user.userId));

    res.json({ 
      message: "Reset link generated successfully.",
      resetToken: token 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/************ COMPLETE PASSWORD RESET ************/
app.post("/test/complete-reset", async (req, res) => {
  try {
    const { token, role, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required." });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(and(
        eq(users.resetToken, token),
        eq(users.role, role)
      ));

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    if (new Date() > new Date(user.resetTokenExpiry)) {
      return res.status(400).json({ error: "Token has expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null 
      })
      .where(eq(users.userId, user.userId));

    res.json({ message: "Password reset successful! You can now login." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/************ FORMS & STRUCTURE ************/
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
app.post("/applications/start", authenticateToken, requireRole("user"), async (req, res) => {
  try {
    const { userId, formId } = req.body;
    const [existingDraft] = await db
      .select()
      .from(applications)
      .where(and(
        eq(applications.userId, userId),
        eq(applications.formId, formId),
        eq(applications.status, "draft")
      ))
      .limit(1);

    if (existingDraft) return res.json(existingDraft);

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

    const [application] = await db.select().from(applications).where(eq(applications.applicationId, id));
    if (!application) return res.status(404).json({ error: "Application not found" });

    const sections = await db.select().from(formSections).where(eq(formSections.formId, application.formId));
    const allQuestions = [];
    for (const section of sections) {
      const q = await db.select().from(formQuestions).where(eq(formQuestions.sectionId, section.sectionId));
      allQuestions.push(...q);
    }

    const validationErrors = validateAnswers(allQuestions, answers);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: "Validation failed", details: validationErrors });
    }

    const sanitizedAnswers = sanitizeAnswers(answers);
    const rows = sanitizedAnswers.map((a) => ({
      applicationId: id,
      questionId: a.questionId,
      answer: a.answer,
    }));

    await db.delete(responses).where(eq(responses.applicationId, id));
    await db.insert(responses).values(rows);
    res.json({ message: "Answers saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/applications/:id/submit", authenticateToken, requireRole("user"), async (req, res) => {
  try {
    const { id } = req.params;
    const [application] = await db.select().from(applications).where(eq(applications.applicationId, id));

    if (!application) return res.status(404).json({ error: "Application not found" });
    if (application.status === "submitted") return res.status(400).json({ error: "Application already submitted" });

    const sections = await db.select().from(formSections).where(eq(formSections.formId, application.formId));
    const allQuestions = [];
    for (const section of sections) {
      const q = await db.select().from(formQuestions).where(eq(formQuestions.sectionId, section.sectionId));
      allQuestions.push(...q);
    }

    const savedAnswers = await db.select().from(responses).where(eq(responses.applicationId, id));
    const validationErrors = validateAnswers(allQuestions, savedAnswers);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: "Cannot submit: Validation errors found", details: validationErrors });
    }

    const [updated] = await db
      .update(applications)
      .set({ status: "submitted" })
      .where(eq(applications.applicationId, id))
      .returning();

    res.json({ message: "Application submitted successfully", applicationId: updated.applicationId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ ADMIN ROUTES ************/
app.get("/admin/applications", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.select().from(applications);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
/************ ADMIN: VIEW SINGLE APPLICATION ************/
app.get("/admin/applications/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch the application and user info
    const [application] = await db
      .select({
        applicationId: applications.applicationId,
        status: applications.status,
        createdAt: applications.createdAt,
        userId: users.userId,
        username: users.name,
        formId: applications.formId
      })
      .from(applications)
      .innerJoin(users, eq(applications.userId, users.userId))
      .where(eq(applications.applicationId, id));

    if (!application) return res.status(404).json({ error: "Application not found" });

    // 2. Fetch the form structure (Sections and Questions)
    const sections = await db
      .select()
      .from(formSections)
      .where(eq(formSections.formId, application.formId))
      .orderBy(asc(formSections.order));

    const detailedSections = [];
    for (const section of sections) {
      const questions = await db
        .select()
        .from(formQuestions)
        .where(eq(formQuestions.sectionId, section.sectionId))
        .orderBy(asc(formQuestions.order));
      
      detailedSections.push({
        sectionTitle: section.title,
        questions: questions
      });
    }

    // 3. Fetch the user's answers
    const answers = await db
      .select()
      .from(responses)
      .where(eq(responses.applicationId, id));

    // 4. Combine everything
    res.json({
      ...application,
      sections: detailedSections,
      answers: answers
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ START SERVER ************/
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));