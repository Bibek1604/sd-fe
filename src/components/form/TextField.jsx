import FieldError from './FieldError';

// Text/email/tel input with inline error and proper aria wiring.
export default function TextField({ name, error, className = '', ...inputProps }) {
  const errorId = `${name}-error`;
  return (
    <div>
      <input
        className={`form-input${error ? ' has-error' : ''} ${className}`.trim()}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
