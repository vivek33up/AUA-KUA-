// seed.js
import db from "./db/index.js";
import {
  forms,
  formSections,
  formQuestions,
  questionOptions
} from "./db/schema.js";


const formStructure = [
  /**************** APPLICANT DETAILS ****************/
  {
    section: "Applicant Details",
    questions: [
      { text: "Name of the applicant", type: "text", required: true },
      { text: "Registration / Incorporation No", type: "text", required: true },
      { text: "License No", type: "text", required: true },
      { text: "Registered office address", type: "textarea", required: true },
      { text: "Correspondence address", type: "textarea", required: true },
      { text: "GSTN registration number", type: "text" },
      { text: "TAN number", type: "text" },

      {
        text: "Type of Aadhaar Authentication facility",
        type: "checkbox",
        required: true,
        options: [
          "Authentication facility (AUA)",
          "Authentication + eKYC facility (AUA + KUA)"
        ]
      },
      {
        text: "Provision of Aadhaar Act under which authentication is required",
        type: "checkbox",
        required: true,
        options: [
          "Section 7",
          "Section 4(4)(b)(i) with PMLA",
          "Section 4(4)(b)(i) other central act",
          "Section 4(4)(b)(ii)",
          "Section 4(7)"
        ]
      },
      {
        text:
          "Category of the applicant Ministry/Department/entity",
        type: "checkbox",
        required: true,
        options: [
          "Central Government Ministry/Department",
          "State Government Ministry/Department",
          "Entity permitted under Section 4(4)(b)(i)",
          "Entity permitted under Section 4(4)(b)(ii)",
          "Entity required under Section 4(7)"
        ]
      },
      {
        text: "Board resolution / authorisation letter for submitting application",
        type: "file",
        required: true
      }
    ]
  },

  /**************** CONTACT DETAILS ****************/
  {
    section: "Contact Details",
    questions: [
      // Prefer clearer labels from admin_side_setup
      { text: "Management Point of Contact (MPOC) Name", type: "text", required: true },
      { text: "MPOC Full designation", type: "text" },
      { text: "MPOC Official email address", type: "text", required: true },
      { text: "MPOC Mobile number", type: "text", required: true },
      { text: "MPOC Alternate telephone number", type: "text" },

      { text: "Technical Point of Contact (TPOC) Name", type: "text", required: true },
      { text: "TPOC designation", type: "text" },
      { text: "TPOC email", type: "text", required: true },
      { text: "TPOC mobile number", type: "text", required: true },

      // New high-level DC/DR address questions (from admin_side_setup)
      { text: "AUA/KUA Infrastructure DC address", type: "textarea" },
      { text: "AUA/KUA Infrastructure DR address", type: "textarea" },

      // Detailed DC fields (from HEAD)
      { text: "DC MPOC/TPOC Name", type: "text" },
      { text: "DC Email address", type: "text" },
      { text: "DC Telephone/Mobile number", type: "text" },
      { text: "DC Address", type: "textarea" },
      { text: "DC District", type: "text" },
      { text: "DC State", type: "text" },
      { text: "DC PIN Code", type: "text" },

      // Detailed DR fields (from HEAD)
      { text: "DR MPOC/TPOC Name", type: "text" },
      { text: "DR Email address", type: "text" },
      { text: "DR Telephone/Mobile number", type: "text" },
      { text: "DR Address", type: "textarea" },
      { text: "DR District", type: "text" },
      { text: "DR State", type: "text" },
      { text: "DR PIN Code", type: "text" },

      // Grievance details (present in both)
      { text: "Grievance website URL", type: "text" },
      { text: "Grievance email address", type: "text" },
      { text: "Grievance helpdesk number", type: "text" }
    ]
  },

  /**************** ASA DETAILS ****************/
  {
    section: "ASA Details",
    questions: [
      {
        text: "Name(s) of ASA",
        type: "text",
        required: true,
        repeatable: true,
        maxRepeats: 3
      },
      {
        text: "Declaration by ASA agreeing to provide connectivity",
        type: "file", // prefer file upload from HEAD
        required: true
      }
    ]
  },

  /**************** AUTHENTICATION REQUIREMENTS ****************/
  {
    section: "Authentication Requirements",
    questions: [
      {
        text: "Territorial extent for use of Authentication facility",
        type: "radio", // keep as radio from HEAD (pick one)
        required: true,
        options: [
          "Whole of India",
          "Specific States / UT"
        ]
      },
      {
        text: "Authentication used for financial transaction",
        type: "radio",
        required: true,
        options: ["Yes", "No"]
      },
      {
        text: "Device form factor",
        type: "checkbox",
        required: true,
        options: [
          "Discrete Biometric Device",
          "Integrated Biometric Device",
          "Laptop/Desktop",
          "Mobile phone"
        ]
      },
      {
        text: "Operator assisted or self use",
        type: "radio",
        required: true,
        options: [
          "Operator-assisted use",
          "Self-use"
        ]
      },
      {
        text: "Mode of authentication",
        type: "checkbox",
        required: true,
        options: [
          "Demographic",
          "OTP",
          "Fingerprint",
          "Iris",
          "Face"
        ]
      },
      {
        text: "Connectivity supported between AUA/KUA and ASA",
        type: "checkbox",
        required: true,
        options: [
          { label: "VPN" },
          { label: "Leased Line" },
          { label: "Other", hasInput: true }
        ]
      },
      {
        text: "Applicant has read UIDAI Information Security Policy",
        type: "radio",
        required: true,
        options: ["Yes", "No"]
      },
      {
        text: "Applicant has read UIDAI Model Privacy Policy",
        type: "radio",
        required: true,
        options: ["Yes", "No"]
      }
    ]
  },

  /**************** DECLARATION ****************/
  {
    section: "Declaration",
    questions: [
      { text: "Name of applicant Ministry/Department/entity", type: "text", required: true },
      { text: "Date", type: "date", required: true },
      { text: "Place", type: "text", required: true },
      { text: "Name of authorised signatory", type: "text", required: true },
      { text: "Full designation", type: "text", required: true }
    ]
  }
];

async function seed() {
  // Clear
  await db.execute(`
    TRUNCATE TABLE "question_options", "form_questions", "form_sections", "forms" RESTART IDENTITY CASCADE;
  `);

  console.log("Starting seed...");

  // FORM
  const [form] = await db.insert(forms)
    .values({ title: "AUA / KUA Application Form" })
    .returning();
  const formId = form.formId;

  // SECTIONS
  const sectionRows = formStructure.map((s, idx) => ({
    formId,
    title: s.section,
    order: idx + 1
  }));

  const sections = await db.insert(formSections).values(sectionRows).returning();

  // Map section title -> id
  const sectionIdMap = {};
  for (const s of sections) {
    sectionIdMap[s.title] = s.sectionId;
  }

  // QUESTIONS
  const questionRows = [];
  for (const s of formStructure) {
    const secId = sectionIdMap[s.section];
    s.questions.forEach((q, idx) => {
      questionRows.push({
        sectionId: secId,
        questionText: q.text,
        fieldType: q.type,               // "text", "textarea", "file", "checkbox", "radio", "date"
        order: idx + 1,
        // Validation (make sure your schema has these; if names differ, update here)
        isRequired: !!q.required,
        isRepeatable: !!q.repeatable || false,
        maxRepeats: q.repeatable ? (q.maxRepeats ?? null) : null
      });
    });
  }

  const insertedQuestions = await db.insert(formQuestions)
    .values(questionRows)
    .returning();

  // Map question text -> id
  const questionIdMap = {};
  for (const q of insertedQuestions) {
    questionIdMap[q.questionText] = q.questionId;
  }

  // OPTIONS
  const optionRows = [];
  for (const s of formStructure) {
    for (const q of s.questions) {
      if (!q.options) continue;
      const qId = questionIdMap[q.text];
      if (!qId) continue;

      q.options.forEach((opt, idx) => {
        // support strings or {label, hasInput}
        const optionText = typeof opt === "string" ? opt : (opt.label ?? "");
        const hasInput = typeof opt === "object" ? !!opt.hasInput : false;

        optionRows.push({
          questionId: qId,
          optionText,
          hasInput,
          order: idx + 1
        });
      });
    }
  }

  if (optionRows.length) {
    await db.insert(questionOptions).values(optionRows);
  }

  console.log("Seed completed successfully");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });