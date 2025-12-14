import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      await api.post("/auth/register", {
        email,
        password,
      });

      // ✅ NO popup, NO modal
      navigate("/login");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>🍬 Sweet Shop</h1>
        <p style={subtitle}>Create your account</p>

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

        <button style={buttonGreen} onClick={submit}>
          Register
        </button>

        <p style={bottomText}>
          Already have an account?{" "}
          <Link to="/login" style={linkGreen}>
            Login
          </Link>
        </p>
      </div>
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

const buttonGreen: React.CSSProperties = {
  width: "100%",
  marginTop: 8,
  padding: "14px",
  borderRadius: 14,
  border: "none",
  background: "#22c55e",
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

const linkGreen: React.CSSProperties = {
  color: "#22c55e",
  fontWeight: 600,
  textDecoration: "none",
};

const errorStyle: React.CSSProperties = {
  color: "#f87171",
  textAlign: "center",
  marginBottom: 12,
};
