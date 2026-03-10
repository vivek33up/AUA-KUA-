import db from "./db/index.js"
import {forms,formSections,formQuestions,questionOptions} from "./db/schema.js"

const formStructure = [

/**************** APPLICANT DETAILS ****************/

{

 section: "Applicant Details",

 questions: [

  { text: "Name of the applicant", type: "text", required: true },

  { text: "Registration / Incorporation No", type: "text" , required: true },

  { text: "License No", type: "text" , required:true },

  { text: "Registered office address", type: "textarea"  , required:true },

  { text: "Correspondence address", type: "textarea"  , required:true  },

  { text: "GSTN registration number", type: "text" },

  { text: "TAN number", type: "text" },

  {

   text: "Type of Aadhaar Authentication facility",

   type: "checkbox",   required:true  ,

   options: [

    "Authentication facility (AUA)",

    "Authentication + eKYC facility (AUA + KUA)"

   ]

  },

  {

   text: "Provision of Aadhaar Act under which authentication is required",

   type: "checkbox" ,   required:true ,

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

   type: "checkbox",   required:true ,

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

   type: "file" , required:true 

  }

 ]

},

/**************** CONTACT DETAILS ****************/

{

 section: "Contact Details",

 questions: [

  { text: "MPOC Name", type: "text" , required:true },

  { text: "MPOC Full designation", type: "text" },

  { text: "MPOC Official email address", type: "text" , required:true },

  { text: "MPOC Mobile number", type: "text", required:true },

  { text: "MPOC Alternate telephone number", type: "text" },

  { text: "TPOC Name", type: "text" , required:true},

  { text: "TPOC designation", type: "text" },

  { text: "TPOC email", type: "text"  , required:true},

  { text: "TPOC mobile number", type: "text" , required:true},

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

  { text: "Name(s) of ASA", type: "text",required:true , repeatable:true,maxRepeats:3 },

  { text: "Declaration by ASA agreeing to provide connectivity", type: "file" , required:true }

 ]

},

/**************** AUTHENTICATION REQUIREMENTS ****************/

{

 section: "Authentication Requirements",

 questions: [

  {

   text: "Territorial extent for use of Authentication facility",

   type: "radio", required:true,

   options: [

    "Whole of India",

    "Specific States / UT"

   ]

  },

  {

   text: "Authentication used for financial transaction",

   type: "radio", required:true,

   options: ["Yes", "No"]

  },

  {

   text: "Device form factor",

   type: "checkbox", required:true,

   options: [

    "Discrete Biometric Device",

    "Integrated Biometric Device",

    "Laptop/Desktop",

    "Mobile phone"

   ]

  },

  {

   text: "Operator assisted or self use",

   type: "checkbox", required:true,

   options: [

    "Operator-assisted use",

    "Self-use"

   ]

  },

  {

   text: "Mode of authentication",

   type: "checkbox", required:true,

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

   type: "checkbox", required : true,

   options: [

    {label:"VPN"},

    {label:"Leased Line"},

    {label:"Other",hasInput:true}

   ]

  },

  {

   text: "Applicant has read UIDAI Information Security Policy",

   type: "radio", required:true,

   options: ["Yes", "No"]

  },

  {

   text: "Applicant has read UIDAI Model Privacy Policy",

   type: "radio", required:true,

   options: ["Yes", "No"]

  }

 ]

},

/**************** DECLARATION ****************/

{

 section: "Declaration",

 questions: [

  { text: "Name of applicant Ministry/Department/entity", type: "text" , required:true},

  { text: "Date", type: "date" , required:true },

  { text: "Place", type: "text" , required:true },

  { text: "Name of authorised signatory", type: "text" , required:true },

  { text: "Full designation", type: "text" , required:true}

 ]

}

];

async function seed() {

  await db.execute(`
    TRUNCATE TABLE "question_options", "form_questions", "form_sections", "forms" RESTART IDENTITY CASCADE;
  `);

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