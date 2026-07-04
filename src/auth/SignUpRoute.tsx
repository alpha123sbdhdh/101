import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { PageTransition } from "../components/PageTransition";

export function SignUpRoute() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  if (session) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      navigate("/");
    } else {
      setConfirmSent(true);
    }
  }

  if (confirmSent) {
    return (
      <PageTransition>
        <div className="auth-shell">
          <h1 className="page-heading">Check your email</h1>
          <p className="page-sub">
            We sent a confirmation link to {email}. Confirm it, then log in.
          </p>
          <Link className="btn btn-ghost btn-block" to="/login">
            Back to login
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="auth-shell">
        <h1 className="page-heading">Create your account</h1>
        <p className="page-sub">Your projects and photos will follow you across devices.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 18, textAlign: "center" }}>
          Already have an account? <Link className="link-inline" to="/login">Log in</Link>
        </p>
      </div>
    </PageTransition>
  );
}
