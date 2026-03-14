import {
  getAllForms,
  getFormById,
  getSectionsByFormId,
  getQuestionsBySectionId,
  getOptionsByQuestionId,
} from "../models/formModel.js";

export async function listForms(req, res) {
  try {
    const result = await getAllForms();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getFormStructure(req, res) {
  try {
    const { formId } = req.params;
    const [form] = await getFormById(formId);

    const sections = await getSectionsByFormId(formId);
    const result = [];

    for (const section of sections) {
      const questions = await getQuestionsBySectionId(section.sectionId);
      const questionList = [];

      for (const question of questions) {
        const options = await getOptionsByQuestionId(question.questionId);
        questionList.push({
          ...question,
          options,
        });
      }

      result.push({
        ...section,
        questions: questionList,
      });
    }

    return res.json({ form, sections: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
