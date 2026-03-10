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

  const [form] = await db.insert(forms)

    .values({

      title: "AUA / KUA Application Form"

    })

    .returning();

  const formId = form.formId;

  let sectionOrder = 1;

  for (const sectionData of formStructure) {

    const [section] = await db.insert(formSections)

      .values({

        formId,

        title: sectionData.section,

        order: sectionOrder++

      })

      .returning();

    let questionOrder = 1;

    for (const questionData of sectionData.questions) {

      const [question] = await db.insert(formQuestions)

        .values({

          sectionId: section.sectionId,

          questionText: questionData.text,

          fieldType: questionData.type,

          isRequired: questionData.required || false,

          order: questionOrder++

        })

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
seed()

  .then(() => {

    console.log("Seeding done");

    process.exit(0);

  })

  .catch(err => {

    console.error(err);

    process.exit(1);

  });