// src/utils/validation.ts
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value.trim()) {
    return {
      isValid: false,
      errorMessage: `${fieldName} is required`,
    };
  }
  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return {
      isValid: false,
      errorMessage: 'Email is required',
    };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid email address',
    };
  }
  return { isValid: true };
};

export const validateAge = (age: string): ValidationResult => {
  if (!age.trim()) {
    return {
      isValid: false,
      errorMessage: 'Age is required',
    };
  }
  
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) {
    return {
      isValid: false,
      errorMessage: 'Age must be a number',
    };
  }
  
  if (ageNum < 1 || ageNum > 120) {
    return {
      isValid: false,
      errorMessage: 'Age must be between 1 and 120',
    };
  }
  return { isValid: true };
};

export const validateForm = (
  validations: Array<() => ValidationResult>
): { isValid: boolean; errorMessage?: string } => {
  for (const validation of validations) {
    const result = validation();
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};