import express from "express";
import crypto from "crypto";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

/******** FORGOT PASSWORD ********/
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // expiry time (1 hour)
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // save token in database
    await db
      .update(users)
      .set({
        resetToken: resetToken,
        resetTokenExpiry: expiry,
      })
      .where(eq(users.email, email));

    res.json({
      message: "Reset token generated",
      resetToken: resetToken, // later this will be sent via email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;