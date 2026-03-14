export const VALIDATION_RULES = {
  "Name of the applicant": { 
    required: true, 
    minLength: 2,
    maxLength: 100 
  },
  
  "Registration / Incorporation No": { 
    required: true, 
    pattern: /^[A-Z0-9\-\/]+$/,
    errorMessage: "Must contain only UpperCase alphabets, numbers, hyphens, or slashes"
  },
  
  "License No": { 
    required: true,
    minLength: 5
  },
  
  "Registered office address": { 
    required: true, 
    minLength: 10,
    maxLength: 500
  },
  
  "Correspondence address": { 
    required: true, 
    minLength: 10,
    maxLength: 500
  },
  
  "GSTN registration number": { 
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
    errorMessage: "GSTN must be exactly 15 characters in the correct format (e.g., 22AAAAA0000A1Z5)"
  },
  
  "TAN number": { 
    pattern: /^[A-Z]{4}\d{5}[A-Z]{1}$/,
    errorMessage: "TAN format is invalid (e.g., AAAA12345A)"
  },
  
  "Type of Aadhaar Authentication facility": { 
    required: true,
    errorMessage: "Please select an authentication type"
  },
  
  "Provision of Aadhaar Act under which authentication is required": { 
    required: true,
    errorMessage: "Please select a provision"
  },
  
  "Category of the applicant Ministry/Department/entity": { 
    required: true,
    errorMessage: "Please select a category"
  },
  "Board resolution / authorisation letter for submitting application": { 
    required: true,
    errorMessage: "Please choose a file"
  },

  "Management Point of Contact (MPOC) Name": {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s.]+$/,
  errorMessage: "Name must contain only letters, spaces, or periods"
},
"MPOC Full designation": {

  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s./-]+$/,
  errorMessage: "Designation must contain only letters, spaces, periods, slashes, or hyphens"
},
 
  
  "MPOC Official email address": { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address"
  },
  
  "MPOC Mobile number": { 
    required: true, 
    pattern: /^[6-9]\d{9}$/,
    errorMessage: "Enter a valid mobile number"
  },

  "Technical Point of Contact (TPOC) Name": {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s.]+$/,
  errorMessage: "Name must contain only letters, spaces, or periods"
},
"TPOC designation": {

  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s./-]+$/,
  errorMessage: "Designation must contain only letters, spaces, periods, slashes, or hyphens"
},
  
  "TPOC email": { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address"
  },
  
  "TPOC mobile number": { 
    required: true, 
    pattern: /^[6-9]\d{9}$/,
    errorMessage: "Enter a valid mobile number"
  },

    "DC Email address": { 
    
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address"
  },
    "DC Telephone/Mobile number": { 
   pattern: /^[6-9]\d{9}$/,
    errorMessage: "Enter a valid mobile number"
  },
 "DC Address": {
  minLength: 10,
  maxLength: 500,
  errorMessage: "Please enter a valid address (10-500 characters)"
},
"DC District": {
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s.]+$/,
  errorMessage: "District must contain only letters, spaces, or periods"
},
"DC State": {
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s.]+$/,
  errorMessage: "State must contain only letters, spaces, or periods"
},
"DC PIN Code": {
  pattern: /^\d{6}$/,
  errorMessage: "PIN Code must be a 6-digit number"
},
"DR MPOC/TPOC Name": {
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s.]+$/,
  errorMessage: "Name must contain only letters, spaces, or periods"
},
"DR Email address": {
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  errorMessage: "Please enter a valid email address"
},
"DR Telephone/Mobile number": {
  pattern: /^[6-9]\d{9}$/,
  errorMessage: "Enter a valid mobile number"
},
"DR Address": {
  minLength: 10,
  maxLength: 500,
  errorMessage: "Please enter a valid address (10-500 characters)"
},
"DR District": {
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s.]+$/,
  errorMessage: "District must contain only letters, spaces, or periods"
},
"DR State": {
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s.]+$/,
  errorMessage: "State must contain only letters, spaces, or periods"
},
"DR PIN Code": {
  pattern: /^\d{6}$/,
  errorMessage: "PIN Code must be a 6-digit number"
},
"Grievance website URL": {
  pattern: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/,
  errorMessage: "Please enter a valid URL"
},
"Grievance email address": {
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  errorMessage: "Please enter a valid email address"
},
"Grievance helpdesk number": {
  pattern: /^[6-9]\d{9}$/,
  errorMessage: "Enter a valid mobile number"
},
  "Grievance email address": { 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address"
  },
  
  "Grievance helpdesk number": { 
    pattern: /^[6-9]\d{9}$/,
    errorMessage: "Must be a valid 10-digit number"
  },
  "Name(s) of ASA": {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z0-9\s.()-]+$/,
  errorMessage: "Name must contain only letters, numbers, spaces, periods, parentheses, or hyphens"
},
"Declaration by ASA agreeing to provide connectivity": {
  required: true,
  errorMessage: "Please upload the declaration file"
},
"Territorial extent for use of Authentication facility": {
  required: true,
  errorMessage: "Please select the territorial extent"
},
"Authentication used for financial transaction": {
  required: true,
  errorMessage: "Please specify if used for financial transactions"
},
"Device form factor": {
  required: true,
  errorMessage: "Please select at least one device form factor"
},
"Operator assisted or self use": {
  required: true,
  errorMessage: "Please specify operator/self use"
},
"Mode of authentication": {
  required: true,
  errorMessage: "Please select at least one mode"
},
"Connectivity supported between AUA/KUA and ASA": {
  required: true,
  errorMessage: "Please specify connectivity"
},
"Applicant has read UIDAI Information Security Policy": {
  required: true,
  errorMessage: "This confirmation is required"
},
"Applicant has read UIDAI Model Privacy Policy": {
  required: true,
  errorMessage: "This confirmation is required"
},
  
 "Name of applicant Ministry/Department/entity": {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z0-9\s.()-]+$/,
  errorMessage: "Name must contain only letters, numbers, spaces, periods, parentheses, or hyphens"
},
"Date": {
  required: true,
  errorMessage: "Please select a date"
},
"Place": {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s.]+$/,
  errorMessage: "Place must contain only letters, spaces, or periods"
},
"Name of authorised signatory": {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s.]+$/,
  errorMessage: "Name must contain only letters, spaces, or periods"
},
"Full designation": {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s./-]+$/,
  errorMessage: "Designation must contain only letters, spaces, periods, slashes, or hyphens"
},
};
/**
 * Validate a single answer
 * @param {string} questionText - The question text
 * @param {any} answer - The answer value
 * @returns {string|null} - Error message or null if valid
 */
export const validateAnswer = (questionText, answer) => {
  const rules = VALIDATION_RULES[questionText];

  if (!rules) return null; // No rules defined

  // Check required
  if (rules.required) {
  if (Array.isArray(answer) || (typeof FileList !== "undefined" && answer instanceof FileList)) {
    if (answer.length === 0) {
      return rules.errorMessage || `${questionText} is required`;
    }
  } else if (typeof File !== "undefined" && answer instanceof File) {
    if (!answer.name) {
      return rules.errorMessage || `${questionText} is required`;
    }
  } else if (typeof answer === "string") {
    if (answer.trim() === "") {
      return rules.errorMessage || `${questionText} is required`;
    }
  } else if (answer === null || answer === undefined) {
    return rules.errorMessage || `${questionText} is required`;
  }
}

  // Skip further validation if not required and empty
  if (
    !rules.required &&
    (!answer || (typeof answer === "string" && answer.trim() === ""))
  ) {
    return null;
  }

  // Check pattern
  if (rules.pattern && typeof answer === "string") {
    if (!rules.pattern.test(answer)) {
      return rules.errorMessage || `${questionText} format is invalid`;
    }
  }

  // Check minLength
  if (rules.minLength && typeof answer === "string") {
    if (answer.length < rules.minLength) {
      return `${questionText} must be at least ${rules.minLength} characters`;
    }
  }

  // Check maxLength
  if (rules.maxLength && typeof answer === "string") {
    if (answer.length > rules.maxLength) {
      return `${questionText} must not exceed ${rules.maxLength} characters`;
    }
  }

  return null;
};

/**
 * Validate multiple answers
 * @param {Array} questions - Array of question objects with questionText
 * @param {Array} answers - Array of answer objects { questionId, answer }
 * @returns {Array} - Array of error objects
 */
export const validateAnswers = (questions, answers) => {
  const errors = [];
  const answerMap = {};

  // Create a map for quick lookup
  answers.forEach((ans) => {
    answerMap[ans.questionId] = ans.answer;
  });

  // Validate each question
  questions.forEach((question) => {
    const answer = answerMap[question.questionId];
    const error = validateAnswer(question.questionText, answer);

    if (error) {
      errors.push({
        questionId: question.questionId,
        questionText: question.questionText,
        error,
      });
    }
  });

  return errors;
};

/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .trim();
};

/**
 * Sanitize all answers
 * @param {Array} answers - Array of answer objects
 * @returns {Array} - Sanitized answers
 */
export const sanitizeAnswers = (answers) => {
  return answers.map((ans) => ({
    ...ans,
    answer: Array.isArray(ans.answer)
      ? ans.answer.map((item) => sanitizeInput(item))
      : sanitizeInput(ans.answer),
  }));
};