// Inline message shown under a form input. `id` links it via aria-describedby.
export default function FieldError({ id, message }) {
  if (!message) return null;
  return <p id={id} className="field-error" role="alert">{message}</p>;
}
