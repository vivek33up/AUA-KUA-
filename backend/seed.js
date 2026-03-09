import db from "./db/index.js";
import {
  forms,
  formSections,
  formQuestions,
  questionOptions
} from "./db/schema.js";

async function seed() {
  console.log("Starting seed...");

  /* ---------------- FORM ---------------- */
  const [form] = await db
    .insert(forms)
    .values({ title: "AUA / KUA Application Form" })
    .returning();

  const formId = form.formId;

  /* ---------------- SECTIONS ---------------- */
  const sections = await db
    .insert(formSections)
    .values([
      { formId, title: "Applicant Details", order: 1 },
      { formId, title: "Contact Details", order: 2 },
      { formId, title: "ASA Details", order: 3 },
      { formId, title: "Authentication Requirements", order: 4 },
      { formId, title: "Declaration", order: 5 }
    ])
    .returning();

  const section = {};
  sections.forEach((s) => (section[s.title] = s.sectionId));

  /* ---------------- QUESTIONS ----------------
     Notes:
     - The list below includes all fields reflected in the official PDF.
     - Table-like items (MPOC/TPOC and DC/DR infra) are flattened as individual questions.
     - Field types:
       text     → single-line text
       textarea → multi-line
       radio    → single select with options
       checkbox → multi-select with options
       date     → date input
       file     → file upload
  ------------------------------------------------ */

  const questions = await db
    .insert(formQuestions)
    .values([
      /* ========== SECTION 1 — Applicant Details ========== */
      { sectionId: section["Applicant Details"], questionText: "Name of the applicant", fieldType: "text", order: 1 },
      { sectionId: section["Applicant Details"], questionText: "Registration / Incorporation No", fieldType: "text", order: 2 },
      { sectionId: section["Applicant Details"], questionText: "License No", fieldType: "text", order: 3 },
      { sectionId: section["Applicant Details"], questionText: "Registered office address", fieldType: "textarea", order: 4 },
      { sectionId: section["Applicant Details"], questionText: "Correspondence address", fieldType: "textarea", order: 5 },
      { sectionId: section["Applicant Details"], questionText: "GSTN registration number of the applicant as per Form GST REG-06", fieldType: "text", order: 6 },
      { sectionId: section["Applicant Details"], questionText: "TAN of the applicant", fieldType: "text", order: 7 },
      { sectionId: section["Applicant Details"], questionText: "Type of Aadhaar Authentication facility", fieldType: "checkbox", order: 8 },
      { sectionId: section["Applicant Details"], questionText: "Board resolution / authorisation letter for submitting application", fieldType: "file", order: 9 },
      { sectionId: section["Applicant Details"], questionText: "Provision of Aadhaar Act under which authentication is required", fieldType: "checkbox", order: 10 },
      { sectionId: section["Applicant Details"], questionText: "Category of the applicant Ministry/Department/Secretariat/Office/Agency/Entity", fieldType: "checkbox", order: 11 },

      /* ========== SECTION 2 — Contact Details ========== */
      // MPOC row
      { sectionId: section["Contact Details"], questionText: "Management Point of Contact (MPOC) Name", fieldType: "text", order: 1 },
      { sectionId: section["Contact Details"], questionText: "MPOC Full designation", fieldType: "text", order: 2 },
      { sectionId: section["Contact Details"], questionText: "MPOC Official email address", fieldType: "text", order: 3 },
      { sectionId: section["Contact Details"], questionText: "MPOC Mobile number", fieldType: "text", order: 4 },
      { sectionId: section["Contact Details"], questionText: "MPOC Alternate office/telephone number", fieldType: "text", order: 5 },

      // TPOC row
      { sectionId: section["Contact Details"], questionText: "Technical Point of Contact (TPOC) Name", fieldType: "text", order: 6 },
      { sectionId: section["Contact Details"], questionText: "TPOC Full designation", fieldType: "text", order: 7 },
      { sectionId: section["Contact Details"], questionText: "TPOC Official email address", fieldType: "text", order: 8 },
      { sectionId: section["Contact Details"], questionText: "TPOC Mobile number", fieldType: "text", order: 9 },

      // AUA/KUA Infrastructure DC
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DC - Contact Name", fieldType: "text", order: 10 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DC - Email address", fieldType: "text", order: 11 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DC - Telephone/Mobile No", fieldType: "text", order: 12 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DC - Address", fieldType: "textarea", order: 13 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DC - District", fieldType: "text", order: 14 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DC - State", fieldType: "text", order: 15 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DC - PIN Code", fieldType: "text", order: 16 },

      // AUA/KUA Infrastructure DR
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DR - Contact Name", fieldType: "text", order: 17 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DR - Email address", fieldType: "text", order: 18 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DR - Telephone/Mobile No", fieldType: "text", order: 19 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DR - Address", fieldType: "textarea", order: 20 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DR - District", fieldType: "text", order: 21 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DR - State", fieldType: "text", order: 22 },
      { sectionId: section["Contact Details"], questionText: "AUA/KUA Infrastructure DR - PIN Code", fieldType: "text", order: 23 },

      // Grievance redressal
      { sectionId: section["Contact Details"], questionText: "Grievance website URL", fieldType: "text", order: 24 },
      { sectionId: section["Contact Details"], questionText: "Grievance email address", fieldType: "text", order: 25 },
      { sectionId: section["Contact Details"], questionText: "Grievance helpdesk number", fieldType: "text", order: 26 },

      /* ========== SECTION 3 — ASA Details ========== */
      { sectionId: section["ASA Details"], questionText: "Name(s) of ASA", fieldType: "text", order: 1 },
      { sectionId: section["ASA Details"], questionText: "Declaration by ASA agreeing to provide connectivity", fieldType: "textarea", order: 2 },

      /* ========== SECTION 4 — Authentication Requirements ========== */
      { sectionId: section["Authentication Requirements"], questionText: "Territorial extent for use of Authentication facility", fieldType: "checkbox", order: 1 },
      { sectionId: section["Authentication Requirements"], questionText: "Authentication used for financial transaction", fieldType: "radio", order: 2 },
      { sectionId: section["Authentication Requirements"], questionText: "Device form factor", fieldType: "checkbox", order: 3 },
      { sectionId: section["Authentication Requirements"], questionText: "Operator assisted or self use", fieldType: "checkbox", order: 4 },
      { sectionId: section["Authentication Requirements"], questionText: "Mode of authentication", fieldType: "checkbox", order: 5 },
      { sectionId: section["Authentication Requirements"], questionText: "Connectivity supported between AUA/KUA and ASA", fieldType: "checkbox", order: 6 },
      { sectionId: section["Authentication Requirements"], questionText: "Applicant has read UIDAI Information Security Policy", fieldType: "radio", order: 7 },
      { sectionId: section["Authentication Requirements"], questionText: "Applicant has read UIDAI Model Privacy Policy", fieldType: "radio", order: 8 },

      /* ========== SECTION 5 — Declaration ========== */
      { sectionId: section["Declaration"], questionText: "Name of applicant Ministry/Department/entity", fieldType: "text", order: 1 },
      { sectionId: section["Declaration"], questionText: "Date", fieldType: "date", order: 2 },
      { sectionId: section["Declaration"], questionText: "Place", fieldType: "text", order: 3 },
      { sectionId: section["Declaration"], questionText: "Name of authorised signatory", fieldType: "text", order: 4 },
      { sectionId: section["Declaration"], questionText: "Full designation", fieldType: "text", order: 5 }
    ])
    .returning();

  // Map: questionText → questionId
  const q = {};
  questions.forEach((x) => (q[x.questionText] = x.questionId));

  /* ---------------- OPTIONS ----------------
     Each option list mirrors the choices available in the official form.
  ------------------------------------------------ */

  const optionRows = [
    /* Type of Authentication Facility (multi-select) */
    { questionText: "Type of Aadhaar Authentication facility", optionText: "Authentication facility (AUA)", order: 1 },
    { questionText: "Type of Aadhaar Authentication facility", optionText: "Authentication + eKYC facility (AUA + KUA)", order: 2 },

    /* Aadhaar Act Provision (multi-select) */
    { questionText: "Provision of Aadhaar Act under which authentication is required", optionText: "Section 7", order: 1 },
    { questionText: "Provision of Aadhaar Act under which authentication is required", optionText: "Section 4(4)(b)(i) with PMLA", order: 2 },
    { questionText: "Provision of Aadhaar Act under which authentication is required", optionText: "Section 4(4)(b)(i) other central act", order: 3 },
    { questionText: "Provision of Aadhaar Act under which authentication is required", optionText: "Section 4(4)(b)(ii)", order: 4 },
    { questionText: "Provision of Aadhaar Act under which authentication is required", optionText: "Section 4(7)", order: 5 },

    /* Category of the applicant */
    { questionText: "Category of the applicant Ministry/Department/entity", optionText: "Central Government Ministry/Department/Office/Agency (Section 7)", order: 1 },
    { questionText: "Category of the applicant Ministry/Department/entity", optionText: "State/UT Ministry/Department/Office/Agency (Section 7)", order: 2 },
    { questionText: "Category of the applicant Ministry/Department/entity", optionText: "Entity permitted under Section 4(4)(b)(i) - other Central Act", order: 3 },
    { questionText: "Category of the applicant Ministry/Department/entity", optionText: "Entity permitted under Section 4(4)(b)(i) - PMLA (reporting entity etc.)", order: 4 },
    { questionText: "Category of the applicant Ministry/Department/entity", optionText: "Entity authorised under Section 4(4)(b)(ii)", order: 5 },
    { questionText: "Category of the applicant Ministry/Department/entity", optionText: "Entity required to perform mandatory authentication under Section 4(7)", order: 6 },

    /* Territory (multi-select) */
    { questionText: "Territorial extent for use of Authentication facility", optionText: "Whole of India", order: 1 },
    { questionText: "Territorial extent for use of Authentication facility", optionText: "Specific States / UT", order: 2 },

    /* Device form factor (multi-select) */
    { questionText: "Device form factor", optionText: "Discrete Biometric Device", order: 1 },
    { questionText: "Device form factor", optionText: "Integrated Biometric Device", order: 2 },
    { questionText: "Device form factor", optionText: "Laptop/Desktop", order: 3 },
    { questionText: "Device form factor", optionText: "Mobile phone", order: 4 },

    /* Operator/Self use (multi-select) */
    { questionText: "Operator assisted or self use", optionText: "Operator-assisted use", order: 1 },
    { questionText: "Operator assisted or self use", optionText: "Self-use", order: 2 },

    /* Mode of authentication (multi-select) */
    { questionText: "Mode of authentication", optionText: "Demographic", order: 1 },
    { questionText: "Mode of authentication", optionText: "OTP", order: 2 },
    { questionText: "Mode of authentication", optionText: "Fingerprint", order: 3 },
    { questionText: "Mode of authentication", optionText: "Iris", order: 4 },
    { questionText: "Mode of authentication", optionText: "Face", order: 5 },

    /* Connectivity (multi-select) */
    { questionText: "Connectivity supported between AUA/KUA and ASA", optionText: "VPN", order: 1 },
    { questionText: "Connectivity supported between AUA/KUA and ASA", optionText: "Leased Line", order: 2 },
    { questionText: "Connectivity supported between AUA/KUA and ASA", optionText: "Other", order: 3 },

    /* Yes / No radios */
    { questionText: "Authentication used for financial transaction", optionText: "Yes", order: 1 },
    { questionText: "Authentication used for financial transaction", optionText: "No", order: 2 },

    { questionText: "Applicant has read UIDAI Information Security Policy", optionText: "Yes", order: 1 },
    { questionText: "Applicant has read UIDAI Information Security Policy", optionText: "No", order: 2 },

    { questionText: "Applicant has read UIDAI Model Privacy Policy", optionText: "Yes", order: 1 },
    { questionText: "Applicant has read UIDAI Model Privacy Policy", optionText: "No", order: 2 }
  ].map((row) => ({
    questionId: q[row.questionText],
    optionText: row.optionText,
    order: row.order
  }));

  await db.insert(questionOptions).values(optionRows);

  console.log("Seed completed successfully");
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});