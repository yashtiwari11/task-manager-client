import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(null);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      await api.post("/auth/signup", form);

      navigate("/"); // go to login after signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        input { outline: none; font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: #b5aea7; }
        .signup-btn:hover:not(:disabled) { background: #333 !important; }
        .signup-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div style={styles.card}>

        {/* Brand */}
        <div style={styles.brandRow}>
          <span style={styles.brandMark}>✦</span>
          <span style={styles.brandName}>Taskly</span>
        </div>

        <div style={styles.divider} />

        <p style={styles.eyebrow}>Get Started</p>
        <h1 style={styles.heading}>Create Account</h1>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        {/* Name */}
        <div style={styles.fieldWrap}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            placeholder="Your name"
            style={{ ...styles.input, borderColor: focused === "name" ? "#1a1a1a" : "#ddd" }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
          />
        </div>

        {/* Email */}
        <div style={styles.fieldWrap}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            style={{ ...styles.input, borderColor: focused === "email" ? "#1a1a1a" : "#ddd" }}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
          />
        </div>

        {/* Password */}
        <div style={styles.fieldWrap}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            style={{ ...styles.input, borderColor: focused === "password" ? "#1a1a1a" : "#ddd" }}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
          />
        </div>

        <button
          className="signup-btn"
          onClick={handleSignup}
          disabled={loading}
          style={styles.btn}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f7f5f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e8e4df",
    borderRadius: 6,
    padding: "40px 44px 36px",
    width: "100%",
    maxWidth: 400,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 28,
  },
  brandMark: {
    fontSize: 18,
    color: "#1a1a1a",
  },
  brandName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#1a1a1a",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    background: "#e8e4df",
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9e9389",
    marginBottom: 4,
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 32,
    fontWeight: 600,
    color: "#1a1a1a",
    letterSpacing: "-0.02em",
    marginBottom: 28,
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#c0392b",
    fontSize: 12,
    fontWeight: 400,
    padding: "10px 12px",
    borderRadius: 3,
    marginBottom: 18,
  },
  fieldWrap: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 10,
    fontWeight: 500,
    color: "#7a7068",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 3,
    padding: "10px 13px",
    fontSize: 13,
    color: "#1a1a1a",
    background: "#fafafa",
    fontWeight: 300,
    transition: "border-color 0.2s",
  },
  btn: {
    width: "100%",
    padding: "11px",
    background: "#1a1a1a",
    border: "none",
    borderRadius: 3,
    color: "#fff",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.04em",
    transition: "background 0.2s",
    marginTop: 8,
  },
  footer: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 12,
    color: "#9e9389",
    fontWeight: 300,
    paddingTop: 20,
    borderTop: "1px solid #e8e4df",
  },
  link: {
    color: "#1a1a1a",
    fontWeight: 500,
    cursor: "pointer",
  },
};

export default Signup;