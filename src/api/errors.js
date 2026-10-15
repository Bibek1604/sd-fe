/**
 * Normalised API error. Every rejected request from `client` is an ApiError,
 * so components never need to dig through `err.response?.data?.error`.
 *
 * Backend error shape: { error: string, code: string, details?: { field: msg } }
 */
export class ApiError extends Error {
  constructor({ message, status = 0, code = 'UNKNOWN', fieldErrors = {}, cause } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;           // HTTP status, 0 = no response (network/timeout)
    this.code = code;               // backend error code, e.g. VALIDATION_ERROR
    this.fieldErrors = fieldErrors; // { email: "Email already in use", ... }
    this.cause = cause;
  }

  get isNetworkError()    { return this.status === 0; }
  get isValidationError() { return this.status === 400 || this.status === 409 || this.status === 422; }
  get isUnauthorized()    { return this.status === 401; }
  get isForbidden()       { return this.status === 403; }
  get isNotFound()        { return this.status === 404; }
}

const STATUS_FALLBACKS = {
  400: 'Some of the information you entered is invalid.',
  401: 'You need to log in to continue.',
  403: 'You do not have permission to do that.',
  404: 'The requested resource was not found.',
  409: 'That conflicts with existing data.',
  413: 'The request was too large.',
  429: 'Too many requests. Please slow down and try again.',
  500: 'Something went wrong on our side. Please try again.',
  502: 'The server is unreachable right now. Please try again shortly.',
  503: 'The service is temporarily unavailable. Please try again shortly.',
};

/** Converts any axios (or other) error into an ApiError. */
export function toApiError(err) {
  if (err instanceof ApiError) return err;

  // Request timed out
  if (err?.code === 'ECONNABORTED' || err?.code === 'ETIMEDOUT') {
    return new ApiError({ message: 'The request timed out. Please check your connection and try again.', code: 'TIMEOUT', cause: err });
  }

  // No response at all — backend down, CORS, offline
  if (err?.request && !err?.response) {
    return new ApiError({ message: 'Cannot reach the server. Please check your connection or try again later.', code: 'NETWORK_ERROR', cause: err });
  }

  if (err?.response) {
    const { status, data } = err.response;
    const body = data && typeof data === 'object' ? data : {};
    return new ApiError({
      message: body.error || body.message || STATUS_FALLBACKS[status] || `Request failed (${status})`,
      status,
      code: body.code || `HTTP_${status}`,
      fieldErrors: body.details && typeof body.details === 'object' ? body.details : {},
      cause: err,
    });
  }

  return new ApiError({ message: err?.message || 'An unexpected error occurred.', cause: err });
}

/** Safe, user-facing message for any error. */
export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return toApiError(err).message || fallback;
}
