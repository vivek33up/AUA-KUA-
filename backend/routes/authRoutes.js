import express from "express";
import crypto from "crypto";
import db from "../db/index.js"; 
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

/******** REQUEST PASSWORD RESET ********/
// Changed to /request-reset to match likely frontend calls
router.post("/request-reset", async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists (destructuring to get the first user object)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      // Returning 404 so the frontend knows the email doesn't exist
      return res.status(404).json({ error: "No account found with this email." });
    }

    // 2. Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Set expiry time (1 hour from now)
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // 4. Save token and expiry in database
    await db
      .update(users)
      .set({
        resetToken: resetToken,
        resetTokenExpiry: expiry,
      })
      .where(eq(users.email, email));

    // 5. Respond with token 
    // In a real app, you would email a link: /reset-password?token=xxx
    res.json({
      message: "Reset token generated successfully",
      resetToken: resetToken, 
    });
  } catch (error) {
    console.error("Auth Route Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;