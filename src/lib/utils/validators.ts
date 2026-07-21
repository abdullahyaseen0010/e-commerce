import { PASSWORD_MIN_LENGTH } from "./constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loosely permissive: allows +, spaces, dashes, parens, 7-15 digits
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const digitCount = value.replace(/\D/g, "").length;
  return PHONE_REGEX.test(value.trim()) && digitCount >= 7 && digitCount <= 15;
}

export function isValidPassword(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH;
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password.length > 0 && password === confirmPassword;
}

export function isRequired(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim().length > 0;
}

export function isValidPostalCode(value: string, country: string = "USA"): boolean {
  const trimmed = value.trim();
  switch (country) {
    case "USA":
      return /^\d{5}(-\d{4})?$/.test(trimmed);
    case "Canada":
      return /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(trimmed);
    case "UK":
      return /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/.test(trimmed);
    default:
      // Fallback: require at least 3 alphanumeric characters
      return /^[A-Za-z0-9\- ]{3,10}$/.test(trimmed);
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates login credentials. Returns field-level error messages.
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isRequired(email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isRequired(password)) {
    errors.password = "Password is required.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Validates a registration form, including password strength and confirmation match.
 */
export function validateRegisterForm(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isRequired(input.firstName)) errors.firstName = "First name is required.";
  if (!isRequired(input.lastName)) errors.lastName = "Last name is required.";

  if (!isRequired(input.email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(input.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isRequired(input.password)) {
    errors.password = "Password is required.";
  } else if (!isValidPassword(input.password)) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (!passwordsMatch(input.password, input.confirmPassword)) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Validates a shipping/billing address form.
 */
export function validateAddressForm(input: {
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isRequired(input.fullName)) errors.fullName = "Full name is required.";
  if (!isRequired(input.phone)) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhone(input.phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!isRequired(input.line1)) errors.line1 = "Street address is required.";
  if (!isRequired(input.city)) errors.city = "City is required.";
  if (!isRequired(input.country)) errors.country = "Country is required.";

  if (!isRequired(input.postalCode)) {
    errors.postalCode = "Postal code is required.";
  } else if (!isValidPostalCode(input.postalCode, input.country)) {
    errors.postalCode = "Enter a valid postal code.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
