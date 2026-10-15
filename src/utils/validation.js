/**
 * Client-side form validation. Mirrors backend/src/validators/index.js so the
 * user gets instant feedback; the backend still re-validates everything.
 *
 * Each validator returns `{ errors, values }` where `errors` maps field → message
 * (empty object when valid) and `values` are the normalised values to submit.
 */

export const RULES = Object.freeze({
  NAME_MIN: 2,
  NAME_MAX: 80,
  EMAIL_MAX: 254,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 128,
  PHONE_MIN_DIGITS: 7,
  PHONE_MAX_DIGITS: 15,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^\+?[\d\s\-()]+$/;

export function validateName(value) {
  const v = (value || '').trim();
  if (!v) return 'Name is required';
  if (v.length < RULES.NAME_MIN) return `Name must be at least ${RULES.NAME_MIN} characters`;
  if (v.length > RULES.NAME_MAX) return `Name must be at most ${RULES.NAME_MAX} characters`;
  return '';
}

export function validateEmail(value) {
  const v = (value || '').trim();
  if (!v) return 'Email is required';
  if (v.length > RULES.EMAIL_MAX || !EMAIL_RE.test(v)) return 'Please enter a valid email address';
  return '';
}

export function validatePhone(value) {
  const v = (value || '').trim();
  if (!v) return 'Phone number is required';
  if (!PHONE_CHARS_RE.test(v)) return 'Phone number must contain digits only';
  const digits = v.replace(/\D/g, '');
  if (digits.length < RULES.PHONE_MIN_DIGITS || digits.length > RULES.PHONE_MAX_DIGITS) {
    return `Phone number must be ${RULES.PHONE_MIN_DIGITS}–${RULES.PHONE_MAX_DIGITS} digits`;
  }
  return '';
}

export function validatePassword(value) {
  if (!value) return 'Password is required';
  if (value.length < RULES.PASSWORD_MIN) return `Password must be at least ${RULES.PASSWORD_MIN} characters`;
  if (value.length > RULES.PASSWORD_MAX) return `Password must be at most ${RULES.PASSWORD_MAX} characters`;
  return '';
}

const collect = (checks) =>
  Object.fromEntries(Object.entries(checks).filter(([, msg]) => msg));

export function validateLogin({ email, password }) {
  const errors = collect({
    email:    validateEmail(email),
    password: password ? '' : 'Password is required',
  });
  return { errors, values: { email: email.trim().toLowerCase(), password } };
}

export function validateSignup({ name, email, phone, password, confirmPassword }) {
  const errors = collect({
    name:            validateName(name),
    email:           validateEmail(email),
    phone:           validatePhone(phone),
    password:        validatePassword(password),
    confirmPassword: !confirmPassword
      ? 'Please confirm your password'
      : confirmPassword !== password ? 'Passwords do not match' : '',
  });
  return {
    errors,
    values: {
      name:  name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.replace(/\D/g, ''),
      password,
    },
  };
}

/** Single-field validators keyed by form field name — used for on-blur checks. */
export const signupFieldValidators = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
  password: validatePassword,
};
