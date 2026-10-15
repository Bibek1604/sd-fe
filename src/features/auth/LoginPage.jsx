import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api";
import { toApiError } from "../../api/errors";
import { validateLogin } from "../../utils/validation";
import { FormAlert, TextField, PasswordField } from "../../components/form";

export default function LoginPage() {
  const [form,        setForm]        = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError,   setFormError]   = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the user edits it
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: "" }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const { errors, values } = validateLogin(form);
    setFieldErrors(errors);
    setFormError("");
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const { user, token } = await authApi.login(values);
      login(user, token);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const apiError = toApiError(err);
      setFieldErrors(apiError.fieldErrors);
      // Field-specific problems show under the input; everything else in the banner
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
            <Link to="/signup" className="btn-primary" style={{ padding: "8px 18px", fontSize: "14px" }}>Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Centered form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px var(--pg-pad)" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Welcome back</h1>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "32px" }}>
            Log in to continue your safety training.
          </p>

          <FormAlert message={formError} />

          {/* noValidate: our own validation renders consistent inline messages */}
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <TextField
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              error={fieldErrors.email}
              autoComplete="email"
              disabled={submitting}
            />

            <PasswordField
              name="password"
              value={form.password}
              onChange={handleChange}
              show={showPw}
              onToggle={() => setShowPw(v => !v)}
              error={fieldErrors.password}
              disabled={submitting}
            />

            <button type="submit" className="btn-primary" disabled={submitting}
                    style={{ marginTop: "4px", padding: "13px", fontSize: "16px", width: "100%" }}>
              {submitting ? "Logging in…" : "Log In"}
            </button>
          </form>

          <p style={{ marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link to="/signup" style={{ color: "var(--accent-safety)", textDecoration: "underline" }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
