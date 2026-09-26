import React, { useState } from "react";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Dono password match nahi karte.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup request failed.");
      setMessage(data.message);
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (requestError) {
      setError(requestError.message || "Signup service se connect nahi ho paya. Backend chalu karke dobara try karein.");
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="container py-5" style={{ maxWidth: 560 }}>
    <h1 className="h2 mb-2">Create your demo account</h1>
    <p className="text-muted mb-4">College project ke practice account ke liye details bharein. Yeh real Zerodha account nahi banata.</p>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {message && <div className="alert alert-success" role="status">{message}</div>}
    <form onSubmit={submit}>
      <div className="mb-3"><label className="form-label" htmlFor="signup-name">Full name</label><input id="signup-name" className="form-control" name="name" autoComplete="name" value={form.name} onChange={update} minLength={2} maxLength={80} required /></div>
      <div className="mb-3"><label className="form-label" htmlFor="signup-email">Email</label><input id="signup-email" className="form-control" name="email" type="email" autoComplete="email" value={form.email} onChange={update} required /></div>
      <div className="mb-3"><label className="form-label" htmlFor="signup-password">Password</label><input id="signup-password" className="form-control" name="password" type="password" autoComplete="new-password" value={form.password} onChange={update} minLength={8} required /></div>
      <div className="mb-4"><label className="form-label" htmlFor="signup-confirm-password">Confirm password</label><input id="signup-confirm-password" className="form-control" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={update} minLength={8} required /></div>
      <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? "Creating account…" : "Create demo account"}</button>
    </form>
  </main>;
}

export default Signup;
