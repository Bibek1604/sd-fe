/*
  FormAlert — banner for form-level / request-level messages.
  Renders nothing when `message` is empty.
*/
const VARIANTS = {
  error:   { color: 'var(--accent-danger)',  bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.28)' },
  success: { color: 'var(--accent-success)', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.28)' },
};

export default function FormAlert({ message, variant = 'error', onRetry, style }) {
  if (!message) return null;
  const v = VARIANTS[variant] || VARIANTS.error;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      style={{
        color: v.color, fontSize: '14px',
        padding: '11px 14px', marginBottom: '16px',
        background: v.bg, borderRadius: '6px', border: `1px solid ${v.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        ...style,
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary" style={{ padding: '5px 12px', fontSize: '13px', flexShrink: 0 }}>
          Retry
        </button>
      )}
    </div>
  );
}
