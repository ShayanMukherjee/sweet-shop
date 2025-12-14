import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Enter key support
    try {
      await login(email, password); // ✅ SINGLE source of truth
      navigate("/", { replace: true });
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={page}>
      <form style={card} onSubmit={submit}>
        <h1 style={title}>🍬 Sweet Shop</h1>
        <p style={subtitle}>Login to continue</p>

        {error && <p style={errorStyle}>{error}</p>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button type="submit" style={buttonPink}>
          Login
        </button>

        <p style={bottomText}>
          Don’t have an account?{" "}
          <Link to="/register" style={linkPink}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

/* ---------- styles ---------- */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #020617, #000)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Inter, system-ui, sans-serif",
};

const card: React.CSSProperties = {
  width: 380,
  padding: 36,
  borderRadius: 20,
  background: "rgba(15,23,42,0.85)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
  color: "#f8fafc",
};

const title: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 700,
  textAlign: "center",
  marginBottom: 6,
};

const subtitle: React.CSSProperties = {
  textAlign: "center",
  color: "#94a3b8",
  marginBottom: 28,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginBottom: 14,
  borderRadius: 12,
  border: "1px solid #1e293b",
  background: "#020617",
  color: "white",
  fontSize: 14,
  outline: "none",
};

const buttonPink: React.CSSProperties = {
  width: "100%",
  marginTop: 8,
  padding: "14px",
  borderRadius: 14,
  border: "none",
  background: "#ec4899",
  color: "white",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
};

const bottomText: React.CSSProperties = {
  marginTop: 20,
  fontSize: 14,
  color: "#94a3b8",
  textAlign: "center",
};

const linkPink: React.CSSProperties = {
  color: "#ec4899",
  fontWeight: 600,
  textDecoration: "none",
};

const errorStyle: React.CSSProperties = {
  color: "#f87171",
  textAlign: "center",
  marginBottom: 12,
};
