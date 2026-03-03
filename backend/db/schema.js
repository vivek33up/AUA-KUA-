import {
  pgTable,
  varchar,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

// users table
export const users = pgTable("users", {
  userId: uuid("userId").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  // store bcrypt hash
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
});

// forms table
export const forms = pgTable("forms", {
  formId: uuid("formId").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.userId),   // point at users.userId
  status: varchar("status", { length: 20 })
    .notNull()
    .default("pending"),
  formData: jsonb("formData"),       // entire form payload
});

