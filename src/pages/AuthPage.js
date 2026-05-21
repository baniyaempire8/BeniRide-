import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const C = {
  primary: "#FF3B4E",
  dark: "#0D0D1A",
  card: "#16213E",
  text: "#F0F0F0",
  muted: "#8892A4",
  green: "#00D68F",
};

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name || !phone) { setError("Please fill all fields"); setLoading(false); return; }
        await signup(email, password, name, phone);
      }
      navigate("/");
    } catch (e) {
      setError(e.message.replace("Firebase: ", "").replace(" (auth/invalid-credential).", "Wrong email or password."));
    }
    setLoading(false);
  };

  const s = {
    page: {
      minHeight: "100vh", background: C.dark, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Outfit', sans-serif",
    },
    logo: { fontSize: 36, fontWeight: 900, color: C.text, marginBottom: 6 },
    logoSpan: { color: C.primary },
    sub: { fontSize: 14, color: C.muted, marginBottom: 32 },
    card: {
      background: C.card, borderRadius: 20, padding: 28,
      width: "100%", maxWidth: 380, border: "1px solid #ffffff0a",
    },
    title: { fontWeight: 800, fontSize: 20, marginBottom: 20 },
    input: {
      width: "100%", background: "#0D0D1A", border: "1px solid #ffffff0f",
      borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14,
      fontFamily: "'Outfit', sans-serif", marginBottom: 10, boxSizing: "border-box",
    },
    btn: {
      width: "100%", background: `linear-gradient(135deg, ${C.primary}, #ff6b35)`,
      color: "#fff", border: "none", borderRadius: 12, padding: "14px 0",
      fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 8,
      fontFamily: "'Outfit', sans-serif",
    },
    error: { color: C.primary, fontSize: 13, marginTop: 8, textAlign: "center" },
    toggle: { textAlign: "center", marginTop: 16, fontSize: 13, color: C.muted },
    toggleLink: { color: C.primary, fontWeight: 700, cursor: "pointer", marginLeft: 4 },
  };

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap'); * { box-sizing: border-box; } input::placeholder { color: #8892A4; } input { outline: none; }`}</style>
      <div style={s.logo}>Beni<span style={s.logoSpan}>Ride</span></div>
      <div style={s.sub}>Rides & E-Bikes in Beni, Myagdi 🏔️</div>
      <div style={s.card}>
        <div style={s.title}>{mode === "login" ? "Welcome Back" : "Join BeniRide"}</div>
        {mode === "signup" && (
          <>
            <input style={s.input} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input style={s.input} placeholder="Phone Number (98XXXXXXXX)" value={phone} onChange={e => setPhone(e.target.value)} />
          </>
        )}
        <input style={s.input} placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={s.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div style={s.error}>{error}</div>}
        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login →" : "Create Account →"}
        </button>
        <div style={s.toggle}>
          {mode === "login" ? "New to BeniRide?" : "Already have account?"}
          <span style={s.toggleLink} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? " Sign Up" : " Login"}
          </span>
        </div>
      </div>
    </div>
  );
}
