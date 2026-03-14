// Validation rules for form fields
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
 * Validate a single field
 * @param {Object} question - Question object from API
 * @param {any} value - The value to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (question, value) => {
  const rules = VALIDATION_RULES[question.questionText];
  
  if (!rules) return null; // No rules defined for this field

  // Check if field is required
  if (rules.required) {
  if (Array.isArray(value) || value instanceof FileList) {
    if (value.length === 0) {
      return rules.errorMessage || `${question.questionText} is required`;
    }
  } else if (value instanceof File) {
    if (!value.name) {
      return rules.errorMessage || `${question.questionText} is required`;
    }
  } else if (typeof value === "string") {
    if (value.trim() === "") {
      return rules.errorMessage || `${question.questionText} is required`;
    }
  } else if (value === null || value === undefined) {
    return rules.errorMessage || `${question.questionText} is required`;
  }
}
  // For non-required fields, skip further validation if empty
  if (!rules.required && (!value || (typeof value === "string" && value.trim() === ""))) {
    return null;
  }

  // Check pattern (regex)
  if (rules.pattern && typeof value === "string") {
    if (!rules.pattern.test(value)) {
      return rules.errorMessage || `${question.questionText} format is invalid`;
    }
  }

  // Check minLength
  if (rules.minLength && typeof value === "string") {
    if (value.length < rules.minLength) {
      return `${question.questionText} must be at least ${rules.minLength} characters`;
    }
  }

  // Check maxLength
  if (rules.maxLength && typeof value === "string") {
    if (value.length > rules.maxLength) {
      return `${question.questionText} must not exceed ${rules.maxLength} characters`;
    }
  }

  return null;
};

/**
 * Validate all fields in an answers object
 * @param {Array} allQuestions - All question objects
 * @param {Object} answers - Object with questionId as key and value as answer
 * @returns {Object} - Object with questionId as key and error message as value
 */
export const validateAllFields = (allQuestions, answers) => {
  const errors = {};

  allQuestions.forEach((question) => {
    const value = answers[question.questionId];
    const error = validateField(question, value);
    
    if (error) {
      errors[question.questionId] = error;
    }
  });

  return errors;
};

/**
 * Check if there are any validation errors
 * @param {Object} errors - Errors object from validateAllFields
 * @returns {boolean}
 */
export const hasValidationErrors = (errors) => {
  return Object.keys(errors).length > 0;
};