import { validateAnswers, sanitizeAnswers } from "../validation.js";
import {
  findDraftApplication,
  createApplication,
  getApplicationById,
  updateApplicationStatus,
} from "../models/applicationModel.js";
import { getSectionsByFormId, getQuestionsBySectionId } from "../models/formModel.js";
import {
  deleteResponsesByApplicationId,
  insertResponses,
} from "../models/responseModel.js";

export async function startApplication(req, res) {
  try {
    const { userId, formId } = req.body;

    const [existingDraft] = await findDraftApplication(userId, formId);
    if (existingDraft) return res.json(existingDraft);

    const [application] = await createApplication(userId, formId, "draft");
    return res.json(application);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function saveAnswers(req, res) {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const [application] = await getApplicationById(id);

    const sections = await getSectionsByFormId(application.formId);
    const allQuestions = [];

    for (const section of sections) {
      const questions = await getQuestionsBySectionId(section.sectionId);
      allQuestions.push(...questions);
    }

    const validationErrors = validateAnswers(allQuestions, answers);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    const sanitizedAnswers = sanitizeAnswers(answers);
    const rows = sanitizedAnswers.map((a) => ({
      applicationId: id,
      questionId: a.questionId,
      answer: a.answer,
    }));

    await deleteResponsesByApplicationId(id);
    await insertResponses(rows);

    return res.json({ message: "Answers saved successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function submitApplication(req, res) {
  try {
    const { id } = req.params;
    const [application] = await getApplicationById(id);

    if (application.status === "submitted") {
      return res.status(400).json({ error: "Application already submitted" });
    }

    const [updatedApplication] = await updateApplicationStatus(id, "submitted");
    return res.json({
      message: "Application submitted successfully",
      applicationId: updatedApplication.applicationId,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
