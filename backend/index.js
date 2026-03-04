import cors from "cors";
import express from "express";
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
import { eq } from "drizzle-orm";

const app = express();
app.use(cors());
app.use(express.json());

/************ HEALTH CHECK ************/

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

/************ TEST USER ENDPOINTS ************/

// add dummy user
app.post("/test/add-user", async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    const [result] = await db
      .insert(users)
      .values({ name, email, password, role })
      .returning();

    res.json({ message: "User added", user: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// list users
app.get("/test/users", async (req, res) => {
  try {

    const result = await db.select().from(users);

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ FORM STRUCTURE API ************/

/*
GET /forms/:formId

Returns:
form
sections
questions
options
*/
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

    /* get form */

    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.formId, formId));

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    /* get sections */

    const sections = await db
      .select()
      .from(formSections)
      .where(eq(formSections.formId, formId));

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

    res.json({
      form,
      sections: result
    });

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
      .values({
        userId,
        formId,
        status: "draft"
      })
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

    const rows = answers.map((a) => ({
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

    res.json({
      message: "Application submitted",
      applicationId: updated.applicationId
    });

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
/************ SERVER ************/

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});