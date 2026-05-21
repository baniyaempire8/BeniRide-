import { useState, useEffect } from "react";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const CITIES = [
  { name: "Beni", region: "Myagdi", live: true },
  { name: "Pokhara", region: "Kaski", live: false },
  { name: "Baglung", region: "Baglung", live: false },
  { name: "Butwal", region: "Rupandehi", live: false },
  { name: "Kathmandu", region: "Kathmandu", live: false },
  { name: "Lalitpur", region: "Lalitpur", live: false },
  { name: "Chitwan", region: "Chitwan", live: false },
  { name: "Dharan", region: "Sunsari", live: false },
  { name: "Dhangadhi", region: "Kailali", live: false },
];

const BENI_LOCATIONS = [
  "Beni Bazaar", "Beni Bridge", "Baglung Gate", "Beni Hospital",
  "Bus Park", "Myagdi Campus", "Hospital Road", "Police Office",
  "Darbang", "Tatopani", "Beni Bazar Chowk", "District Office",
];

const RIDE_TYPES = [
  { id: "bike", name: "BeniMoto", icon: "🏍️", desc: "Motorcycle · 1 seat · fastest", eta: "2 min", base: 20, perKm: 15, min: 50 },
  { id: "car",  name: "BeniCar",  icon: "🚗", desc: "Car · 4 seats · comfortable",   eta: "5 min", base: 50, perKm: 35, min: 120 },
  { id: "ebike",name: "BeniEbike",icon: "⚡", desc: "E-bike rental · scan & go",      eta: "Now",  flat: 30, tag: "ECO" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

const calcFare = (type, km) => {
  const r = RIDE_TYPES.find(r => r.id === type);
  if (!r) return 0;
  if (r.flat) return r.flat;
  return Math.max(r.base + Math.round(km * r.perKm), r.min);
};

const randKm = () => parseFloat((1.5 + Math.random() * 4).toFixed(1));

// ─── STYLES ─────────────────────────────────────────────────────────────────

const C = {
  red: "#E8360A", dark: "#1a1a1a", bg: "#F7F6F3",
  white: "#fff", muted: "#888", border: "#e8e6e0",
  green: "#22c55e", amber: "#f59e0b",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { background: ${C.bg}; }
  input, select, textarea, button { font-family: 'Plus Jakarta Sans', sans-serif; }
  input:focus, select:focus, textarea:focus { outline: none; }
  input::placeholder { color: #bbb; font-weight: 400; }
  ::-webkit-scrollbar { width: 0; height: 0; }
  select { appearance: none; -webkit-appearance: none; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pop { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.03); } 100% { transform: scale(1); opacity: 1; } }
`;

// ─── MAP SVG ────────────────────────────────────────────────────────────────

const MapSVG = () => (
  <svg viewBox="0 0 390 180" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <rect width="390" height="180" fill="#d4e8c8" />
    <path d="M0 108 Q60 95 130 105 Q200 115 270 100 Q330 90 390 100" stroke="#b8d4a0" strokeWidth="28" fill="none" />
    <path d="M0 108 Q60 95 130 105 Q200 115 270 100 Q330 90 390 100" stroke="#c8e0b0" strokeWidth="20" fill="none" strokeDasharray="22 10" />
    <path d="M195 0 Q200 55 195 108 Q190 148 195 180" stroke="#b8d4a0" strokeWidth="16" fill="none" />
    <path d="M0 134 Q70 124 150 134 Q230 144 300 129 Q345 122 390 134" stroke="#6ca8d4" strokeWidth="7" fill="none" opacity="0.7" />
    <path d="M0 134 Q70 124 150 134 Q230 144 300 129 Q345 122 390 134" stroke="#8ec0e8" strokeWidth="3" fill="none" opacity="0.4" />
    {[[28,60,18,26],[56,64,14,22],[116,58,22,28],[238,60,18,24],[308,62,16,22]].map(([x,y,w,h],i) =>
      <rect key={i} x={x} y={y} width={w} height={h} fill={i%2===0?"#c0c8a8":"#b8c0a0"} rx="2" />
    )}
    <circle cx="125" cy="102" r="9" fill="#22c55e" opacity="0.2" />
    <circle cx="125" cy="102" r="5" fill="#22c55e" />
    <circle cx="265" cy="96" r="9" fill="#E8360A" opacity="0.2" />
    <circle cx="265" cy="96" r="5" fill="#E8360A" />
    <path d="M125 102 Q175 80 215 90 Q245 96 265 96" stroke="#E8360A" strokeWidth="2" strokeDasharray="6 4" fill="none" />
    <rect x="190" y="74" width="14" height="9" rx="3" fill="#fff" stroke="#E8360A" strokeWidth="1" />
    <circle cx="194" cy="83" r="2" fill="#333" />
    <circle cx="201" cy="83" r="2" fill="#333" />
    <text x="112" y="92" fill="#15803d" fontSize="9" fontWeight="700" fontFamily="sans-serif">YOU</text>
    <text x="252" y="86" fill="#E8360A" fontSize="9" fontWeight="700" fontFamily="sans-serif">DEST</text>
    <text x="124" y="150" fill="#2563b0" fontSize="8" fontFamily="sans-serif" opacity="0.8">Myagdi Khola</text>
  </svg>
);

// ─── MODAL ───────────────────────────────────────────────────────────────────

const Modal = ({ children, onClose }) => (
  <div onClick={e => e.target === e.currentTarget && onClose()} style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100,
  }}>
    <div style={{
      background: C.white, borderRadius: "24px 24px 0 0",
      padding: "20px 20px 36px", width: "100%", maxWidth: 430,
      animation: "slideUp 0.3s ease", maxHeight: "88vh", overflowY: "auto",
    }}>
      <div style={{ width: 36, height: 4, background: "#e0ddd8", borderRadius: 2, margin: "0 auto 18px" }} />
      {children}
    </div>
  </div>
);

// ─── RIDER APP ───────────────────────────────────────────────────────────────

const RiderApp = ({ user, onLogin }) => {
  const [tab, setTab] = useState("home");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rideType, setRideType] = useState("bike");
  const [modal, setModal] = useState(null); // null | "login" | "finding" | "found"
  const [city, setCity] = useState({ name: "Beni", region: "Myagdi" });
  const [showCities, setShowCities] = useState(false);
  const [fareKm, setFareKm] = useState(null);

  const sel = RIDE_TYPES.find(r => r.id === rideType);

  const handleBook = () => {
    if (!to) return;
    if (!user) { setModal("login"); return; }
    const km = randKm();
    setFareKm(km);
    setModal("finding");
    setTimeout(() => setModal("found"), 2500);
  };

  const s = {
    page: { fontFamily: "'Plus Jakarta Sans',sans-serif", background: C.bg, color: C.dark, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative" },
    topbar: { background: C.white, padding: "14px 20px 12px", borderBottom: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" },
    cityPill: { display: "inline-flex", alignItems: "center", gap: 4, background: C.bg, border: `0.5px solid #d8d6d0`, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 500, color: "#555", cursor: "pointer", marginTop: 5 },
    avatar: { width: 34, height: 34, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.white, cursor: "pointer" },
    searchBox: { background: C.white, margin: "-18px 16px 0", borderRadius: 16, padding: "12px 14px", boxShadow: "0 2px 12px rgba(0,0,0,0.09)", position: "relative", zIndex: 2 },
    locRow: { display: "flex", alignItems: "center", gap: 10, padding: "7px 0" },
    locInput: { flex: 1, border: "none", fontSize: 14, fontWeight: 500, color: C.dark, background: "none" },
    section: { padding: "14px 20px" },
    secTitle: { fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
    rideCard: (a) => ({ background: a ? "#fff8f7" : C.white, border: `1.5px solid ${a ? C.red : C.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }),
    rideIcon: { width: 42, height: 42, borderRadius: 11, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0 },
    bookBtn: { margin: "4px 20px 16px", background: C.red, color: C.white, border: "none", borderRadius: 14, padding: 15, width: "calc(100% - 40px)", fontSize: 15, fontWeight: 700, cursor: "pointer" },
    tabBar: { position: "sticky", bottom: 0, background: C.white, borderTop: `0.5px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "8px 0 16px" },
    tabBtn: (a) => ({ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 500, color: a ? C.red : "#aaa", padding: "0 12px" }),
    card: { background: C.white, borderRadius: 14, padding: "12px 14px", border: `0.5px solid ${C.border}`, marginBottom: 8 },
    histItem: { background: C.white, borderRadius: 12, padding: "12px 14px", border: `0.5px solid ${C.border}`, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 },
    histIcon: { width: 36, height: 36, borderRadius: 10, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 },
    modalInput: { width: "100%", background: C.bg, border: `0.5px solid ${C.border}`, borderRadius: 11, padding: "12px 13px", fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 10 },
    modalBtn: { width: "100%", background: C.red, color: C.white, border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" },
    tag: { background: "#dcfce7", color: "#15803d", fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 5, marginLeft: 5 },
  };

  const fare = fareKm ? calcFare(rideType, fareKm) : null;
  const comm = fare ? Math.round(fare * 0.18) : 0;

  return (
    <div style={s.page}>
      {/* HOME */}
      {tab === "home" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={s.topbar}>
            <div>
              <div style={s.logo}>Beni<span style={{ color: C.red }}>Ride</span></div>
              <div style={s.cityPill} onClick={() => setShowCities(true)}>
                📍 {city.name}, {city.region} ▾
              </div>
            </div>
            <div style={s.avatar} onClick={() => !user && setModal("login")}>
              {user ? user.name[0].toUpperCase() : "?"}
            </div>
          </div>
          <div style={{ height: 180, overflow: "hidden" }}><MapSVG /></div>
          <div style={s.searchBox}>
            <div style={s.locRow}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.green, flexShrink: 0 }} />
              <select style={{ ...s.locInput, background: "none" }} value={from} onChange={e => setFrom(e.target.value)}>
                <option value="">Pickup location</option>
                {BENI_LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ ...s.locRow, borderTop: `0.5px solid #f0ede8` }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.red, flexShrink: 0 }} />
              <select style={{ ...s.locInput, background: "none" }} value={to} onChange={e => setTo(e.target.value)}>
                <option value="">Where to?</option>
                {BENI_LOCATIONS.filter(l => l !== from).map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={s.section}>
            <div style={s.secTitle}>Choose ride</div>
            {RIDE_TYPES.map(r => (
              <div key={r.id} style={s.rideCard(rideType === r.id)} onClick={() => setRideType(r.id)}>
                <div style={s.rideIcon}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}{r.tag && <span style={s.tag}>{r.tag}</span>}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{r.desc}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: rideType === r.id ? C.red : C.dark }}>
                    {r.flat ? `Rs. ${r.flat}/hr` : `Rs. ${r.min}+`}
                  </div>
                  <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginTop: 2 }}>{r.eta}</div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ ...s.bookBtn, background: to ? C.red : "#ccc", cursor: to ? "pointer" : "default" }} onClick={handleBook}>
            Book {sel?.name} →
          </button>
          <div style={{ height: 72 }} />
        </div>
      )}

      {/* ACTIVITY */}
      {tab === "activity" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={s.topbar}><div style={s.logo}>Beni<span style={{ color: C.red }}>Ride</span></div></div>
          <div style={s.section}>
            <div style={s.secTitle}>Recent rides</div>
            {[
              { icon: "🏍️", route: "Beni Bazaar → Baglung Gate", info: "Today · BeniMoto · ⭐ 5.0", price: "Rs. 65", color: C.red },
              { icon: "🚗", route: "Hospital Road → Bus Park", info: "Yesterday · BeniCar · ⭐ 4.8", price: "Rs. 150", color: C.red },
              { icon: "⚡", route: "Myagdi Campus → Beni Bridge", info: "Monday · BeniEbike · ⭐ 5.0", price: "Rs. 30", color: C.green },
            ].map((r, i) => (
              <div key={i} style={s.histItem}>
                <div style={s.histIcon}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.route}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{r.info}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.price}</div>
              </div>
            ))}
            <div style={{ ...s.card, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 800 }}>12</div><div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Total Rides</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>1.2kg</div><div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>CO₂ Saved</div></div>
            </div>
          </div>
          <div style={{ height: 72 }} />
        </div>
      )}

      {/* ACCOUNT */}
      {tab === "account" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={s.topbar}><div style={s.logo}>Beni<span style={{ color: C.red }}>Ride</span></div></div>
          <div style={s.section}>
            <div style={{ ...s.card, textAlign: "center", padding: 20, marginBottom: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: C.white, margin: "0 auto 10px" }}>
                {user ? user.name[0].toUpperCase() : "?"}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{user ? user.name : "Guest User"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{city.name}, {city.region}</div>
              {!user && <button style={{ ...s.modalBtn, marginTop: 14, padding: "10px 20px", width: "auto", borderRadius: 10, fontSize: 13 }} onClick={() => setModal("login")}>Login / Sign Up</button>}
            </div>
            <div style={{ ...s.card, marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Referral Code</div>
              <div style={{ background: C.bg, borderRadius: 9, padding: "10px 13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: C.red }}>BENI2025</span>
                <span style={{ fontSize: 11, color: C.red, fontWeight: 700, cursor: "pointer" }}>Copy</span>
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>Earn Rs. 50 for every friend referred 🎉</div>
            </div>
            {[
              { icon: "💬", title: "WhatsApp Support", sub: "6AM–10PM daily" },
              { icon: "📞", title: "Call Us", sub: "+977-980-000-0000" },
            ].map((item, i) => (
              <div key={i} style={{ ...s.card, display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div><div style={{ fontSize: 11, color: C.muted }}>{item.sub}</div></div>
                <span style={{ color: "#ccc" }}>›</span>
              </div>
            ))}
          </div>
          <div style={{ height: 72 }} />
        </div>
      )}

      {/* TAB BAR */}
      <div style={s.tabBar}>
        {[{ id: "home", icon: "🏠", label: "Home" }, { id: "activity", icon: "🧾", label: "Rides" }, { id: "account", icon: "👤", label: "Account" }].map(t => (
          <button key={t.id} style={s.tabBtn(tab === t.id)} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* CITY SHEET */}
      {showCities && (
        <Modal onClose={() => setShowCities(false)}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Choose city</div>
          {CITIES.map((c, i) => (
            <div key={i} onClick={() => { setCity({ name: c.name, region: c.region }); setShowCities(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < CITIES.length - 1 ? `0.5px solid #f0ede8` : "none", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{c.region} District</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: c.live ? "#dcfce7" : "#fef9c3", color: c.live ? "#15803d" : "#854d0e" }}>
                {c.live ? "🟢 Live" : "Coming soon"}
              </span>
            </div>
          ))}
        </Modal>
      )}

      {/* LOGIN MODAL */}
      {modal === "login" && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>Welcome to BeniRide</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>Enter your details to continue</div>
          <input style={s.modalInput} id="login-name" placeholder="Your full name" />
          <input style={s.modalInput} id="login-phone" placeholder="Phone number (98XXXXXXXX)" />
          <button style={s.modalBtn} onClick={() => {
            const name = document.getElementById("login-name").value;
            const phone = document.getElementById("login-phone").value;
            if (name && phone) { onLogin({ name, phone }); setModal(null); }
          }}>Continue →</button>
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: C.muted, cursor: "pointer" }} onClick={() => setModal(null)}>Cancel</div>
        </Modal>
      )}

      {/* FINDING */}
      {modal === "finding" && (
        <Modal onClose={() => {}}>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 52, animation: "spin 0.9s linear infinite", display: "inline-block", marginBottom: 16 }}>{sel?.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Finding driver...</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Matching nearest {sel?.name} in {city.name}</div>
          </div>
        </Modal>
      )}

      {/* FOUND */}
      {modal === "found" && fare && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Driver Found!</div>
          </div>
          <div style={{ background: C.bg, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: C.white }}>R</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Ram Bahadur</div>
              <div style={{ fontSize: 12, color: C.muted }}>⭐ 4.9 · 320 rides · Ba 1 Kha 234</div>
            </div>
            <div style={{ fontSize: 26 }}>{sel?.icon}</div>
          </div>
          <div style={{ background: C.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
            {[["From", from || city.name + " Bazaar"], ["To", to], ["Distance", fareKm + " km"], ["Total Fare", "Rs. " + fare]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 3 ? `0.5px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: i === 3 ? 14 : 13, fontWeight: i === 3 ? 700 : 400, color: i === 3 ? C.dark : C.muted }}>{k}</span>
                <span style={{ fontSize: i === 3 ? 16 : 13, fontWeight: i === 3 ? 800 : 600, color: i === 3 ? C.red : C.dark }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginBottom: 14 }}>Driver earns Rs. {fare - comm} · BeniRide Rs. {comm}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button style={{ background: C.bg, border: "none", borderRadius: 11, padding: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }} onClick={() => setModal(null)}>✕ Cancel</button>
            <button style={{ background: C.red, color: C.white, border: "none", borderRadius: 11, padding: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }} onClick={() => setModal(null)}>✓ Confirm</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── DRIVER APP ───────────────────────────────────────────────────────────────

const DriverApp = () => {
  const [online, setOnline] = useState(false);
  const [request, setRequest] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (online) {
      const t = setTimeout(() => setRequest({ from: "Beni Bazaar", to: "Baglung Gate", km: 2.8, fare: 62 }), 2000);
      return () => clearTimeout(t);
    } else {
      setRequest(null);
    }
  }, [online]);

  const s = {
    page: { fontFamily: "'Plus Jakarta Sans',sans-serif", background: C.bg, color: C.dark, minHeight: "100vh", maxWidth: 430, margin: "0 auto" },
    topbar: { background: C.dark, padding: "14px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    section: { padding: "14px 20px" },
    card: { background: C.white, borderRadius: 14, padding: "14px 16px", border: `0.5px solid ${C.border}`, marginBottom: 10 },
    earnCard: { background: C.red, borderRadius: 14, padding: 16, color: C.white, marginBottom: 10 },
  };

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.white, letterSpacing: "-0.5px" }}>
            Beni<span style={{ color: C.red }}>Ride</span>
            <span style={{ fontSize: 10, background: C.white, color: C.dark, padding: "2px 7px", borderRadius: 6, marginLeft: 8, fontWeight: 700 }}>DRIVER</span>
          </div>
          <div style={{ fontSize: 11, color: online ? C.green : "#888", marginTop: 4, fontWeight: 600 }}>
            {online ? "🟢 Online — receiving requests" : "⚫ Offline"}
          </div>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.white }}>D</div>
      </div>

      <div style={s.section}>
        {/* Online toggle */}
        <div style={{ ...s.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{online ? "You are Online" : "Go Online"}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              {online ? "Waiting for ride requests..." : "Start receiving ride requests"}
            </div>
          </div>
          <div onClick={() => setOnline(!online)} style={{ width: 52, height: 28, borderRadius: 14, background: online ? C.green : "#e0ddd8", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: online ? 26 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </div>

        {/* Earnings */}
        <div style={s.earnCard}>
          <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Today's earnings</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>Rs. 0</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            {[["0", "Rides today"], ["0 hrs", "Online time"]].map(([v, l], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{v}</div>
                <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ride request */}
        {request && (
          <div style={{ ...s.card, border: `2px solid ${C.red}`, animation: "pop 0.4s ease" }}>
            <div style={{ fontSize: 11, color: C.red, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>🔔 New Ride Request!</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div><div style={{ fontSize: 11, color: C.muted }}>Pickup</div><div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{request.from}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: C.muted }}>Drop</div><div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{request.to}</div></div>
            </div>
            <div style={{ background: C.bg, borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: C.muted }}>Distance: <b style={{ color: C.dark }}>{request.km} km</b></span>
              <span style={{ fontSize: 15, fontWeight: 800, color: C.red }}>Rs. {request.fare}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button style={{ background: C.bg, border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }} onClick={() => setRequest(null)}>Decline</button>
              <button style={{ background: C.red, color: C.white, border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }} onClick={() => { setRequest(null); setModal("accepted"); }}>Accept ✓</button>
            </div>
          </div>
        )}

        {/* Week history */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 4 }}>This week</div>
        <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
          {[["Monday", "Rs. 420", "7 rides"], ["Tuesday", "Rs. 380", "6 rides"], ["Wednesday", "Rs. 510", "9 rides"]].map(([day, earn, rides], i, arr) => (
            <div key={i} style={{ padding: "12px 14px", borderBottom: i < arr.length - 1 ? `0.5px solid #f0ede8` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.muted }}>{day}</span>
              <div style={{ textAlign: "right" }}><span style={{ fontSize: 13, fontWeight: 700 }}>{earn}</span><span style={{ fontSize: 11, color: C.muted, marginLeft: 6 }}>{rides}</span></div>
            </div>
          ))}
        </div>
      </div>

      {modal === "accepted" && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Ride Accepted!</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Head to Beni Bazaar to pick up your rider</div>
            <div style={{ background: C.bg, borderRadius: 12, padding: 14, textAlign: "left", marginBottom: 16 }}>
              {[["Pickup", "Beni Bazaar"], ["Drop", "Baglung Gate"], ["Your Earning", "Rs. 51"]].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                  <span style={{ fontSize: 13, color: i === 2 ? C.dark : C.muted, fontWeight: i === 2 ? 700 : 400 }}>{k}</span>
                  <span style={{ fontSize: i === 2 ? 15 : 13, fontWeight: i === 2 ? 800 : 600, color: i === 2 ? C.green : C.dark }}>{v}</span>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", background: C.red, color: C.white, border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" }} onClick={() => setModal(null)}>Complete Ride ✓</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── APPLY / JOIN APP ─────────────────────────────────────────────────────────

const ApplyApp = () => {
  const [type, setType] = useState("moto");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "Beni, Myagdi", vehicle: "Motorcycle (100cc–150cc)", license: "", experience: "No, this is my first time" });

  const applyTypes = [
    { id: "moto",  icon: "🏍️", label: "Motorcycle Driver", earn: "Rs. 300–600/day" },
    { id: "car",   icon: "🚗", label: "Car Driver",         earn: "Rs. 500–1000/day" },
    { id: "ebike", icon: "⚡", label: "E-bike Partner",     earn: "Station host" },
    { id: "biz",   icon: "🏪", label: "Business Partner",   earn: "Fleet owner" },
  ];

  const s = {
    page: { fontFamily: "'Plus Jakarta Sans',sans-serif", background: C.bg, color: C.dark, minHeight: "100vh", maxWidth: 430, margin: "0 auto" },
    hero: { background: C.dark, padding: "28px 20px 24px", color: C.white },
    section: { padding: "16px 20px" },
    secTitle: { fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
    typeCard: (a) => ({ background: a ? "#fff8f7" : C.white, border: `1.5px solid ${a ? C.red : C.border}`, borderRadius: 14, padding: "14px 12px", cursor: "pointer", textAlign: "center" }),
    label: { fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5, display: "block" },
    input: { width: "100%", background: C.bg, border: `0.5px solid ${C.border}`, borderRadius: 11, padding: "12px 13px", fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 12 },
    submitBtn: { width: "100%", background: C.dark, color: C.white, border: "none", borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 4 },
  };

  if (submitted) return (
    <div style={s.page}>
      <div style={{ ...s.section, paddingTop: 32, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Application Submitted!</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>We'll call you within 24 hours to complete your onboarding.</div>
        <div style={{ background: C.white, borderRadius: 14, padding: 16, border: `0.5px solid ${C.border}`, textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>What happens next?</div>
          {["We call you to verify details and schedule a meeting in Beni", "Bring your license, citizenship, and vehicle papers", "We activate your Driver App account", "Start earning! First ride within 24 hours of activation"].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 3 ? `0.5px solid #f0ede8` : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.red, color: C.white, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{step}</div>
            </div>
          ))}
        </div>
        <button style={{ ...s.submitBtn, background: C.red, marginTop: 20, borderRadius: 12 }} onClick={() => setSubmitted(false)}>Apply for Another Role</button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>Earn money with BeniRide 🚀</div>
        <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>Drive, ride, or partner — your schedule, your earnings. Join Nepal's fastest growing ride network.</div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {[["Rs. 500+", "Per day potential"], ["80%", "You keep"], ["Free", "To join"]].map(([v, l], i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.red }}>{v}</div>
              <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <div style={s.secTitle}>Choose how to join</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {applyTypes.map(t => (
            <div key={t.id} style={s.typeCard(type === t.id)} onClick={() => setType(t.id)}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t.label}</div>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginTop: 3 }}>{t.earn}</div>
            </div>
          ))}
        </div>

        <div style={s.secTitle}>Your information</div>
        <div style={{ background: "#fef9c3", border: "0.5px solid #fde68a", borderRadius: 10, padding: "10px 13px", fontSize: 12, color: "#854d0e", marginBottom: 14 }}>
          ⚠️ All applications reviewed within 24 hours. We'll call you back on your number.
        </div>

        {[
          { label: "Full Name *", key: "name", placeholder: "Hari Bahadur Thapa", type: "text" },
          { label: "Phone Number *", key: "phone", placeholder: "98XXXXXXXX", type: "tel" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label style={s.label}>{f.label}</label>
            <input style={s.input} type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
          </div>
        ))}

        <div style={{ marginBottom: 12 }}>
          <label style={s.label}>Your City *</label>
          <div style={{ position: "relative" }}>
            <select style={s.input} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}>
              {["Beni, Myagdi", "Baglung", "Pokhara", "Butwal", "Kathmandu", "Other"].map(c => <option key={c}>{c}</option>)}
            </select>
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-60%)", pointerEvents: "none", color: C.muted, fontSize: 12 }}>▾</span>
          </div>
        </div>

        {(type === "moto" || type === "car") && (
          <div style={{ marginBottom: 12 }}>
            <label style={s.label}>Vehicle Type *</label>
            <div style={{ position: "relative" }}>
              <select style={s.input} value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })}>
                {["Motorcycle (100cc–150cc)", "Motorcycle (150cc+)", "Scooter", "Car (Hatchback)", "Car (Sedan/SUV)"].map(v => <option key={v}>{v}</option>)}
              </select>
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-60%)", pointerEvents: "none", color: C.muted, fontSize: 12 }}>▾</span>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={s.label}>License Number *</label>
          <input style={s.input} placeholder="Ba-XX-XXXXXXX" value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={s.label}>Previous experience?</label>
          <div style={{ position: "relative" }}>
            <select style={s.input} value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}>
              {["No, this is my first time", "Yes, Pathao", "Yes, InDrive", "Yes, other"].map(v => <option key={v}>{v}</option>)}
            </select>
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-60%)", pointerEvents: "none", color: C.muted, fontSize: 12 }}>▾</span>
          </div>
        </div>

        <button style={s.submitBtn} onClick={() => { if (form.name && form.phone) setSubmitted(true); else alert("Please enter your name and phone number"); }}>
          Submit Application →
        </button>
        <div style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 12 }}>By applying you agree to BeniRide's Driver Terms</div>
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState("rider");
  const [user, setUser] = useState(null);

  const modeStyle = (m) => ({
    flex: 1, padding: "11px 0", fontSize: 13, fontWeight: 700,
    border: "none", background: "none", cursor: "pointer",
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    color: mode === m ? C.red : "#aaa",
    borderBottom: `2px solid ${mode === m ? C.red : "transparent"}`,
    transition: "all 0.2s",
  });

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto" }}>
      <style>{css}</style>

      {/* TOP MODE SWITCHER */}
      <div style={{ display: "flex", background: C.white, borderBottom: `0.5px solid ${C.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <button style={modeStyle("rider")} onClick={() => setMode("rider")}>🧍 Rider</button>
        <button style={modeStyle("driver")} onClick={() => setMode("driver")}>🏍️ Driver</button>
        <button style={modeStyle("apply")} onClick={() => setMode("apply")}>📝 Join Us</button>
      </div>

      {mode === "rider"  && <RiderApp  user={user} onLogin={setUser} />}
      {mode === "driver" && <DriverApp />}
      {mode === "apply"  && <ApplyApp />}
    </div>
  );
}
