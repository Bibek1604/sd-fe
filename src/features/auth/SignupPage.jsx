import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api";
import { toApiError } from "../../api/errors";
import { validateSignup, signupFieldValidators, RULES } from "../../utils/validation";
import { FormAlert, TextField, PasswordField } from "../../components/form";

const INITIAL = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

export default function SignupPage() {
  const [form,        setForm]        = useState(INITIAL);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError,   setFormError]   = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: "" }));
    if (formError) setFormError("");
  };

  // Validate a field when the user leaves it — only if they typed something,
  // so tabbing through an empty form doesn't light up every field.
  const handleBlur = e => {
    const { name, value } = e.target;
    if (!value) return;
    const message = name === "confirmPassword"
      ? (value !== form.password ? "Passwords do not match" : "")
      : signupFieldValidators[name]?.(value) || "";
    setFieldErrors(prev => ({ ...prev, [name]: message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const { errors, values } = validateSignup(form);
    setFieldErrors(errors);
    setFormError("");
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const { user, token } = await authApi.signup(values);
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      const apiError = toApiError(err);
      // Server field errors (e.g. "Email already in use") go under the matching input
      setFieldErrors(apiError.fieldErrors);
      if (!Object.keys(apiError.fieldErrors).length) setFormError(apiError.message);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav style={{ background: "var(--bg-panel)", borderBottom: "1px solid var(--border-subtle)", height: "60px", flexShrink: 0 }}>
        <div className="pg-nav-inner">
          <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.04em" }}>
            Safety<span style={{ color: "var(--accent-safety)" }}> Detective</span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={() => navigate("/")} className="btn-secondary" style={{ padding: "7px 16px", fontSize: "13px" }}>← Back</button>
            <Link to="/login" className="btn-secondary" style={{ padding: "8px 18px", fontSize: "14px" }}>Log In</Link>
          </div>
        </div>
      </nav>

      {/* Centered form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px var(--pg-pad)",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Create account</h1>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "32px" }}>
            Join Safety Detective and start your training.
          </p>

          <FormAlert message={formError} />

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <TextField
              name="name" type="text" placeholder="Full name" autoComplete="name"
              value={form.name} onChange={handleChange} onBlur={handleBlur}
              error={fieldErrors.name} disabled={submitting} maxLength={RULES.NAME_MAX}
            />
            <TextField
              name="email" type="email" placeholder="Email address" autoComplete="email"
              value={form.email} onChange={handleChange} onBlur={handleBlur}
              error={fieldErrors.email} disabled={submitting} maxLength={RULES.EMAIL_MAX}
            />
            <TextField
              name="phone" type="tel" placeholder="Phone number" autoComplete="tel" inputMode="tel"
              value={form.phone} onChange={handleChange} onBlur={handleBlur}
              error={fieldErrors.phone} disabled={submitting}
            />

            <PasswordField
              name="password"
              placeholder={`Password (min. ${RULES.PASSWORD_MIN} characters)`}
              autoComplete="new-password"
              show={showPw}
              onToggle={() => setShowPw(v => !v)}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.password}
              disabled={submitting}
            />
            <PasswordField
              name="confirmPassword"
              placeholder="Confirm password"
              autoComplete="new-password"
              show={showConfirm}
              onToggle={() => setShowConfirm(v => !v)}
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.confirmPassword}
              disabled={submitting}
            />

            <button type="submit" className="btn-primary" disabled={submitting}
                    style={{ marginTop: "4px", padding: "13px", fontSize: "16px", width: "100%" }}>
              {submitting ? "Creating account…" : "Sign Up"}
            </button>
          </form>

          <p style={{ marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent-safety)", textDecoration: "underline" }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
