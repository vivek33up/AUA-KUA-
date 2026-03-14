import { eq, asc } from "drizzle-orm";

import db from "../db/index.js";
import {
  forms,
  formSections,
  formQuestions,
  questionOptions,
} from "../db/schema.js";

export function getAllForms() {
  return db.select().from(forms);
}

export function getFirstForm() {
  return db.select().from(forms).limit(1);
}

export function getFormById(formId) {
  return db.select().from(forms).where(eq(forms.formId, formId));
}

export function getSectionsByFormId(formId) {
  return db
    .select()
    .from(formSections)
    .where(eq(formSections.formId, formId))
    .orderBy(asc(formSections.order));
}

export function getQuestionsBySectionId(sectionId) {
  return db
    .select()
    .from(formQuestions)
    .where(eq(formQuestions.sectionId, sectionId))
    .orderBy(asc(formQuestions.order));
}

export function getOptionsByQuestionId(questionId) {
  return db
    .select()
    .from(questionOptions)
    .where(eq(questionOptions.questionId, questionId))
    .orderBy(asc(questionOptions.order));
}
