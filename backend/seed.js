import db from "./db/index.js"
import {forms,formSections,formQuestions,questionOptions} from "./db/schema.js"

const formStructure = [

/**************** APPLICANT DETAILS ****************/

{

 section: "Applicant Details",

 questions: [

  { text: "Name of the applicant", type: "text", required: true },

  { text: "Registration / Incorporation No", type: "text" },

  { text: "License No", type: "text" },

  { text: "Registered office address", type: "textarea" },

  { text: "Correspondence address", type: "textarea" },

  { text: "GSTN registration number", type: "text" },

  { text: "TAN number", type: "text" },

  {

   text: "Type of Aadhaar Authentication facility",

   type: "checkbox",

   options: [

    "Authentication facility (AUA)",

    "Authentication + eKYC facility (AUA + KUA)"

   ]

  },

  {

   text: "Provision of Aadhaar Act under which authentication is required",

   type: "checkbox",

   options: [

    "Section 7",

    "Section 4(4)(b)(i) with PMLA",

    "Section 4(4)(b)(i) other central act",

    "Section 4(4)(b)(ii)",

    "Section 4(7)"

   ]

  },

  {

   text: "Category of the applicant Ministry/Department/entity",

   type: "checkbox",

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

   type: "file"

  }

 ]

},

/**************** CONTACT DETAILS ****************/

{

 section: "Contact Details",

 questions: [

  { text: "MPOC Name", type: "text" },

  { text: "MPOC Full designation", type: "text" },

  { text: "MPOC Official email address", type: "text" },

  { text: "MPOC Mobile number", type: "text" },

  { text: "MPOC Alternate telephone number", type: "text" },

  { text: "TPOC Name", type: "text" },

  { text: "TPOC designation", type: "text" },

  { text: "TPOC email", type: "text" },

  { text: "TPOC mobile number", type: "text" },

  /******** DC ********/

  { text: "DC MPOC/TPOC Name", type: "text" },

  { text: "DC Email address", type: "text" },

  { text: "DC Telephone/Mobile number", type: "text" },

  { text: "DC Address", type: "textarea" },

  { text: "DC District", type: "text" },

  { text: "DC State", type: "text" },

  { text: "DC PIN Code", type: "text" },

  /******** DR ********/

  { text: "DR MPOC/TPOC Name", type: "text" },

  { text: "DR Email address", type: "text" },

  { text: "DR Telephone/Mobile number", type: "text" },

  { text: "DR Address", type: "textarea" },

  { text: "DR District", type: "text" },

  { text: "DR State", type: "text" },

  { text: "DR PIN Code", type: "text" },

  /******** GRIEVANCE ********/

  { text: "Grievance website URL", type: "text" },

  { text: "Grievance email address", type: "text" },

  { text: "Grievance helpdesk number", type: "text" }

 ]

},

/**************** ASA DETAILS ****************/

{

 section: "ASA Details",

 questions: [

  { text: "Name(s) of ASA", type: "text",repeatable:true,maxRepeats:3 },

  { text: "Declaration by ASA agreeing to provide connectivity", type: "file" }

 ]

},

/**************** AUTHENTICATION REQUIREMENTS ****************/

{

 section: "Authentication Requirements",

 questions: [

  {

   text: "Territorial extent for use of Authentication facility",

   type: "radio",

   options: [

    "Whole of India",

    "Specific States / UT"

   ]

  },

  {

   text: "Authentication used for financial transaction",

   type: "radio",

   options: ["Yes", "No"]

  },

  {

   text: "Device form factor",

   type: "checkbox",

   options: [

    "Discrete Biometric Device",

    "Integrated Biometric Device",

    "Laptop/Desktop",

    "Mobile phone"

   ]

  },

  {

   text: "Operator assisted or self use",

   type: "checkbox",

   options: [

    "Operator-assisted use",

    "Self-use"

   ]

  },

  {

   text: "Mode of authentication",

   type: "checkbox",

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

   options: [

    {label:"VPN"},

    {label:"Leased Line"},

    {label:"Other",hasInput:true}

   ]

  },

  {

   text: "Applicant has read UIDAI Information Security Policy",

   type: "radio",

   options: ["Yes", "No"]

  },

  {

   text: "Applicant has read UIDAI Model Privacy Policy",

   type: "radio",

   options: ["Yes", "No"]

  }

 ]

},

/**************** DECLARATION ****************/

{

 section: "Declaration",

 questions: [

  { text: "Name of applicant Ministry/Department/entity", type: "text" },

  { text: "Date", type: "date" },

  { text: "Place", type: "text" },

  { text: "Name of authorised signatory", type: "text" },

  { text: "Full designation", type: "text" }

 ]

}

];

async function seed() {


  console.log("Starting seed...");

  /* ---------------- FORM ---------------- */
  const [form] = await db
    .insert(forms)
    .values({ title: "AUA / KUA Application Form" })
    .returning();

  const formId = form.formId;

  /* ---------------- SECTIONS ---------------- */

  const sections = await db.insert(formSections).values([
    { formId, title: "Applicant Details", order: 1 },
    { formId, title: "Contact Details", order: 2 },
    { formId, title: "ASA Details", order: 3 },
    { formId, title: "Authentication Requirements", order: 4 },
    { formId, title: "Declaration", order: 5 }
  ]).returning();

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

      // insert options if present

      if (questionData.options) {

        const options = questionData.options.map((opt, index) => ({

          questionId: question.questionId,

          optionText: typeof opt === "string" ? opt : opt.label,

          order: index + 1

        }));

        await db.insert(questionOptions).values(options);

      }

    }

  }

  console.log("Seed completed successfully");
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});