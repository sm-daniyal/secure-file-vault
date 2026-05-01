// ============================================================
// pages/AuthPage.jsx — Login & Register page
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import "./AuthPage.css";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(""); // clear error on change
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { username: form.username, email: form.email, password: form.password };

      const { data } = await api.post(endpoint, payload);

      // Store the token + user in context and localStorage
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setForm({ username: "", email: "", password: "" });
  };

  return (
    <div className="page-center auth-bg">
      <div className="auth-wrapper fade-in">
        {/* Branding */}
        <div className="auth-brand">
          <span className="auth-logo">⬡</span>
          <h1 className="auth-title">SECURE VAULT</h1>
          <p className="auth-sub">encrypted · private · yours</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        {/* Form card */}
        <div className="card auth-card">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Username field — only shown on register */}
            {mode === "register" && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  autoComplete="username"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"}
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? "No account? " : "Already have an account? "}
            <button className="link-btn" onClick={() => switchMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="auth-footer">
          Files are stored privately — only you can access them.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
