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
    errorMessage: "Must contain only letters, numbers, hyphens, or slashes"
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
    errorMessage: "GSTN must be exactly 15 characters"
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
  
  "MPOC Official email address": { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address"
  },
  
  "MPOC Mobile number": { 
    required: true, 
    pattern: /^[6-9]\d{9}$/,
    errorMessage: "Mobile number must be 10 digits starting with 6-9"
  },
  
  "TPOC email": { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address"
  },
  
  "TPOC mobile": { 
    required: true, 
    pattern: /^[6-9]\d{9}$/,
    errorMessage: "Mobile number must be 10 digits starting with 6-9"
  },
  
  "Grievance email address": { 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address"
  },
  
  "Grievance helpdesk number": { 
    pattern: /^[6-9]\d{9}$/,
    errorMessage: "Must be a valid 10-digit number"
  },
  
  "Date": { 
    required: true,
    errorMessage: "Please select a date"
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
    if (Array.isArray(value)) {
      if (value.length === 0) {
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