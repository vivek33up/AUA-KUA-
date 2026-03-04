

import db from "./db/index.js";
import {
  forms,
  formSections,
  formQuestions,
  questionOptions
} from "./db/schema.js";

async function seed() {

  /* ---------- FORM ---------- */

  const [form] = await db.insert(forms).values({
    title: "AUA/KUA Application Form",
    description: "UIDAI Authentication Application"
  }).returning();

  console.log("Form created:", form);

  /* ---------- SECTION 1 ---------- */

  const [section] = await db.insert(formSections).values({
    formId: form.formId,
    title: "Applicant Details",
    order: 1
  }).returning();

  console.log("Section created:", section);

  /* ---------- QUESTIONS ---------- */

  const questions = await db.insert(formQuestions).values([
    {
      sectionId: section.sectionId,
      questionText: "Applicant Name",
      fieldType: "text",
      isRequired: true,
      order: 1
    },
    {
      sectionId: section.sectionId,
      questionText: "Registration / Incorporation Number",
      fieldType: "text",
      order: 2
    },
    {
      sectionId: section.sectionId,
      questionText: "License Number",
      fieldType: "text",
      order: 3
    },
    {
      sectionId: section.sectionId,
      questionText: "Registered Office Address",
      fieldType: "textarea",
      isRequired: true,
      order: 4
    },
    {
      sectionId: section.sectionId,
      questionText: "Correspondence Address",
      fieldType: "textarea",
      order: 5
    },
    {
      sectionId: section.sectionId,
      questionText: "GSTN",
      fieldType: "text",
      order: 6
    },
    {
      sectionId: section.sectionId,
      questionText: "TAN",
      fieldType: "text",
      order: 7
    },
    {
      sectionId: section.sectionId,
      questionText: "Type of facility",
      fieldType: "checkbox",
      isRequired: true,
      order: 8
    },
    {
      sectionId: section.sectionId,
      questionText: "Applicable Provision of Aadhaar Act",
      fieldType: "radio",
      order: 9
    },
    {
      sectionId: section.sectionId,
      questionText: "Category of Applicant",
      fieldType: "dropdown",
      order: 10
    }
  ]).returning();

  console.log("Questions inserted:", questions);

  /* ---------- OPTIONS ---------- */

  const facilityQuestion = questions.find(
    q => q.questionText === "Type of facility"
  );

  await db.insert(questionOptions).values([
    {
      questionId: facilityQuestion.questionId,
      optionText: "AUA",
      order: 1
    },
    {
      questionId: facilityQuestion.questionId,
      optionText: "KUA",
      order: 2
    }
  ]);

  const aadhaarQuestion = questions.find(
    q => q.questionText === "Applicable Provision of Aadhaar Act"
  );

  await db.insert(questionOptions).values([
    {
      questionId: aadhaarQuestion.questionId,
      optionText: "Section 7",
      order: 1
    },
    {
      questionId: aadhaarQuestion.questionId,
      optionText: "Section 4(4)(b)(i) read with PMLA",
      order: 2
    },
    {
      questionId: aadhaarQuestion.questionId,
      optionText: "Section 4(4)(b)(i) read with other Central Act",
      order: 3
    },
    {
      questionId: aadhaarQuestion.questionId,
      optionText: "Section 4(4)(b)(ii)",
      order: 4
    },
    {
      questionId: aadhaarQuestion.questionId,
      optionText: "Section 4(7)",
      order: 5
    }
  ]);

  console.log("Options inserted");

  console.log("Seed complete");
}

seed();