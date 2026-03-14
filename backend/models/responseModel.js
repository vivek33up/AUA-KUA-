import { eq } from "drizzle-orm";

import db from "../db/index.js";
import { responses, formQuestions } from "../db/schema.js";

export function deleteResponsesByApplicationId(applicationId) {
  return db.delete(responses).where(eq(responses.applicationId, applicationId));
}

export function insertResponses(rows) {
  return db.insert(responses).values(rows);
}

export function getResponsesByApplicationId(applicationId) {
  return db
    .select({
      questionId: responses.questionId,
      answer: responses.answer,
      questionText: formQuestions.questionText,
      fieldType: formQuestions.fieldType,
    })
    .from(responses)
    .innerJoin(
      formQuestions,
      eq(responses.questionId, formQuestions.questionId),
    )
    .where(eq(responses.applicationId, applicationId));
}
