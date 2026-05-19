import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    company: "",
    title: "",
    location: ""
  });

  useEffect(() => {
    if (user) {
      navigate(user.role === "recruiter" ? "/recruiter" : "/candidate", { replace: true });
    }
  }, [navigate, user]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseRole(role) {
    setForm((current) => ({ ...current, role }));
  }

  function fillDemo(role) {
    setForm((current) => ({
      ...current,
      role,
      email: role === "recruiter" ? "recruiter@hirecraft.test" : "candidate@hirecraft.test",
      password: "password123"
    }));
  }

  const roleLabel = form.role === "recruiter" ? "recruiter" : "candidate";

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await register(form);
        navigate(form.role === "recruiter" ? "/recruiter" : "/candidate");
      } else {
        const data = await login({ email: form.email, password: form.password, role: form.role });
        navigate(data.user.role === "recruiter" ? "/recruiter" : "/candidate");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">{isRegister ? "Create account" : "Welcome back"}</p>
        <h1>{isRegister ? "Join HireCraft" : "Log in to your workspace"}</h1>
        {error && <p className="form-error">{error}</p>}

        <div className="role-login-tabs">
          <button type="button" className={form.role === "candidate" ? "active" : ""} onClick={() => chooseRole("candidate")}>
            Candidate login
          </button>
          <button type="button" className={form.role === "recruiter" ? "active" : ""} onClick={() => chooseRole("recruiter")}>
            Recruiter login
          </button>
        </div>

        {isRegister && (
          <>
            <label>
              Name
              <input required value={form.name} onChange={(event) => update("name", event.target.value)} />
            </label>
          </>
        )}

        <label>
          Email
          <input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
        </label>
        <label>
          Password
          <input required minLength={6} type="password" value={form.password} onChange={(event) => update("password", event.target.value)} />
        </label>

        {isRegister && (
          <div className="two-col">
            <label>
              {form.role === "recruiter" ? "Company" : "Current title"}
              <input value={form.role === "recruiter" ? form.company : form.title} onChange={(event) => update(form.role === "recruiter" ? "company" : "title", event.target.value)} />
            </label>
            <label>
              Location
              <input value={form.location} onChange={(event) => update("location", event.target.value)} />
            </label>
          </div>
        )}

        <button className="full-button" type="submit">
          {isRegister ? `Create ${roleLabel} account` : `Continue as ${roleLabel}`}
        </button>
        {!isRegister && (
          <div className="demo-logins">
            <button type="button" onClick={() => fillDemo("candidate")}>
              Try candidate account
            </button>
            <button type="button" onClick={() => fillDemo("recruiter")}>
              Try recruiter account
            </button>
          </div>
        )}
        <p className="switch-auth">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Create one"}</Link>
        </p>
      </form>
    </section>
  );
}
