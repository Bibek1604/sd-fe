import FieldError from './FieldError';

// Eye icons are module-level so their identity never changes across re-renders.
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/*
  Password input with show/hide toggle and inline error.
  Must stay a top-level component: declaring it inside a page component would
  create a new component type on every keystroke → remount → lost value/focus.
*/
export default function PasswordField({
  name, value, onChange, onBlur, show, onToggle,
  placeholder = 'Password', autoComplete = 'current-password', error, disabled,
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          className={`form-input${error ? ' has-error' : ''}`}
          name={name}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          style={{ paddingRight: '44px' }}
        />
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '4px',
            display: 'flex', alignItems: 'center', lineHeight: 0,
          }}
        >
          {show ? <EyeOpen /> : <EyeOff />}
        </button>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
