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
      <div style={styles.card}>
        <p style={styles.heading}>Create Account</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          placeholder="Name"
          style={styles.input}
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          style={styles.input}
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleSignup}
          style={styles.btn}
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f5f2" },
  card: { background: "#fff", padding: 30, width: 350, borderRadius: 6, border: "1px solid #e8e4df" },
  heading: { fontSize: 22, marginBottom: 20 },
  input: { width: "100%", padding: 10, marginBottom: 12, border: "1px solid #ddd", borderRadius: 3 },
  btn: { width: "100%", padding: 10, background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer" },
  footer: { marginTop: 14, fontSize: 13 },
  link: { color: "#1a1a1a", cursor: "pointer", fontWeight: 500 },
  error: { color: "red", marginBottom: 10 },
};

export default Signup;