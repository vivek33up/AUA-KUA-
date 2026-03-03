import express from "express";
import db from "./db/index.js";
import { users, forms } from "./db/schema.js";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

/************ TEST ENDPOINTS ************/
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

// list all users
app.get("/test/users", async (req, res) => {
  try {
    const result = await db.select().from(users);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/************ FORMS TEST ************/
// create a form (returns generated formId)
app.post("/test/add-form", async (req, res) => {
  try {
    const { userId, status = "pending", formData } = req.body;

    const [result] = await db
      .insert(forms)
      .values({ userId, status, formData })
      .returning();

    res.json({ message: "Form added", form: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// get all forms
app.get("/test/forms", async (req, res) => {
  try {
    const result = await db.select().from(forms);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// get forms for a specific user
app.get("/test/forms/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db
      .select()
      .from(forms)
      .where(eq(forms.userId, userId));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// mark an existing form as submitted; return its id
app.post("/test/submit-form", async (req, res) => {
  try {
    const { userId } = req.body;
    const [updated] = await db
      .update(forms)
      .set({ status: "submitted" })
      .where(eq(forms.userId, userId))
      .returning({ id: forms.formId });

    if (!updated) {
      return res.status(404).json({ error: "form not found" });
    }

    res.json({ message: "Form submitted", formId: updated.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//  list only the application id of submitted forms
app.get("/test/forms/submitted", async (req, res) => {
  try {
    const rows = await db
      .select({ id: forms.formId })
      .from(forms)
      .where(eq(forms.status, "submitted"));

    res.json(rows.map(r => r.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});