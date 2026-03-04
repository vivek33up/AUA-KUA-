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
});

/************ FORMS ************/
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