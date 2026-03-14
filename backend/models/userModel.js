import { and, eq } from "drizzle-orm";

import db from "../db/index.js";
import { users } from "../db/schema.js";

export function findUserByEmail(email) {
  return db.select().from(users).where(eq(users.email, email));
}

export function findUserByEmailAndRole(email, role) {
  return db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.role, role)));
}

export function findUserByResetToken(token) {
  return db.select().from(users).where(eq(users.resetToken, token));
}

export function createUser(data) {
  return db.insert(users).values(data).returning();
}

export function updateUserPasswordById(userId, password) {
  return db.update(users).set({ password }).where(eq(users.userId, userId));
}

export function updateResetTokenByEmail(email, resetToken, resetTokenExpiry) {
  return db
    .update(users)
    .set({ resetToken, resetTokenExpiry })
    .where(eq(users.email, email));
}

export function clearResetTokenByUserId(userId) {
  return db
    .update(users)
    .set({ resetToken: null, resetTokenExpiry: null })
    .where(eq(users.userId, userId));
}
