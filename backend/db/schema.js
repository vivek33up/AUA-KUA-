import {
  pgTable,
  varchar,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  serial
} from "drizzle-orm/pg-core";

/************ USERS ************/
export const users = pgTable("users", {
  userId: uuid("userId").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  organization: varchar("organization", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

/************ COMPLIANCE CATEGORIES ************/
export const complianceCategories = pgTable("compliance_categories", {
  categoryId: serial("categoryId").primaryKey(),
  code: varchar("code", { length: 5 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  sortOrder: integer("sortOrder").notNull(),
});

/************ COMPLIANCE CONTROLS ************/
export const complianceControls = pgTable("compliance_controls", {
  controlId: serial("controlId").primaryKey(),
  categoryId: integer("categoryId")
    .references(() => complianceCategories.categoryId)
    .notNull(),
  controlNo: integer("controlNo").notNull(),
  shortTitle: varchar("shortTitle", { length: 255 }).notNull(),
  description: text("description").notNull(),
});

/************ AUDIT SESSIONS ************/
export const auditSessions = pgTable("audit_sessions", {
  auditId: uuid("auditId").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .references(() => users.userId)
    .notNull(),
  auditorId: uuid("auditorId")
    .references(() => users.userId),
  status: varchar("status", { length: 30 }).notNull().default("draft"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  submittedAt: timestamp("submittedAt"),
});

/************ AUDIT RESPONSES ************/
export const auditResponses = pgTable("audit_responses", {
  responseId: serial("responseId").primaryKey(),
  auditId: uuid("auditId")
    .references(() => auditSessions.auditId)
    .notNull(),
  controlId: integer("controlId")
    .references(() => complianceControls.controlId)
    .notNull(),
  complianceStatus: varchar("complianceStatus", { length: 30 }),
  auditorObservation: text("auditorObservation"),
  managementComments: text("managementComments"),
});

/************ FORMS (kept for application form) ************/
export const forms = pgTable("forms", {
  formId: uuid("formId").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
});

/************ FORM SECTIONS ************/
export const formSections = pgTable("form_sections", {
  sectionId: serial("sectionId").primaryKey(),
  formId: uuid("formId")
    .references(() => forms.formId)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  order: integer("order").notNull(),
});

/************ FORM QUESTIONS ************/
export const formQuestions = pgTable("form_questions", {
  questionId: serial("questionId").primaryKey(),
  sectionId: integer("sectionId")
    .references(() => formSections.sectionId)
    .notNull(),
  questionText: text("questionText").notNull(),
  fieldType: varchar("fieldType", { length: 50 }).notNull(),
  isRequired: boolean("isRequired").default(false),
  order: integer("order").notNull(),
});

/************ QUESTION OPTIONS ************/
export const questionOptions = pgTable("question_options", {
  optionId: serial("optionId").primaryKey(),
  questionId: integer("questionId")
    .references(() => formQuestions.questionId)
    .notNull(),
  optionText: varchar("optionText", { length: 255 }).notNull(),
  order: integer("order").notNull(),
});

/************ APPLICATIONS ************/
export const applications = pgTable("applications", {
  applicationId: uuid("applicationId").defaultRandom().primaryKey(),
  formId: uuid("formId")
    .references(() => forms.formId)
    .notNull(),
  userId: uuid("userId")
    .references(() => users.userId)
    .notNull(),
  status: varchar("status", { length: 20 }).default("draft"),
  createdAt: timestamp("createdAt").defaultNow(),
});

/************ RESPONSES ************/
export const responses = pgTable("responses", {
  responseId: serial("responseId").primaryKey(),
  applicationId: uuid("applicationId")
    .references(() => applications.applicationId)
    .notNull(),
  questionId: integer("questionId")
    .references(() => formQuestions.questionId)
    .notNull(),
  answer: text("answer"),
});