import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { generateToken } from "../middleware/auth.js";
import {
  createUser,
  findUserByEmail,
  findUserByEmailAndRole,
  findUserByResetToken,
  updateResetTokenByEmail,
  updateUserPasswordById,
  clearResetTokenByUserId,
} from "../models/userModel.js";
import { getFirstForm } from "../models/formModel.js";
import {
  createApplication,
  findDraftApplication,
} from "../models/applicationModel.js";

const SALT_ROUNDS = 10;

export async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const existing = await findUserByEmailAndRole(email, role);
    if (existing.length > 0) {
      return res.status(400).json({
        error: role === "admin" ? "ADMIN_EMAIL_TAKEN" : "USER_EXISTS",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      userId: uuidv4(),
    });

    if (role === "admin") {
      return res.json({
        message: "Admin created",
        adminId: result.userId.substring(0, 6),
        user: { ...result, password: undefined },
      });
    }

    return res.json({
      message: "User created",
      user: { ...result, password: undefined },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    let user;
    if (role === "admin") {
      [user] = await findUserByEmailAndRole(email, "admin");
      if (!user) {
        return res.status(404).json({ error: "Admin account not found" });
      }
    } else {
      [user] = await findUserByEmailAndRole(email, role);
      if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    if (user.role === "user") {
      const [firstForm] = await getFirstForm();
      if (firstForm) {
        const [existingDraft] = await findDraftApplication(
          user.userId,
          firstForm.formId,
        );
        if (!existingDraft) {
          await createApplication(user.userId, firstForm.formId, "draft");
        }
      }
    }

    const token = generateToken({
      userId: user.userId,
      role: user.role,
      name: user.name,
    });

    return res.json({
      message: "Login successful",
      userId: user.userId,
      role: user.role,
      name: user.name,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function recoverAdminId(req, res) {
  try {
    const { email } = req.body;
    const [admin] = await findUserByEmailAndRole(email, "admin");

    if (!admin) {
      return res.status(404).json({ error: "No admin account found" });
    }

    return res.json({ adminId: admin.userId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function completeReset(req, res) {
  try {
    const { token, newPassword } = req.body;
    const [user] = await findUserByResetToken(token);

    if (!user) {
      return res.status(400).json({ error: "Invalid reset token." });
    }

    if (new Date() > new Date(user.resetTokenExpiry)) {
      return res.status(400).json({ error: "Reset token has expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await updateUserPasswordById(user.userId, hashedPassword);
    await clearResetTokenByUserId(user.userId);

    return res.json({ message: "Password updated successfully." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { adminId, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await updateUserPasswordById(adminId, hashedPassword);
    return res.json({ message: "Password updated successfully." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    const [user] = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await updateResetTokenByEmail(email, resetToken, expiry);

    return res.json({
      message: "Reset token generated successfully",
      resetToken,
    });
  } catch (error) {
    console.error("Auth Route Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
