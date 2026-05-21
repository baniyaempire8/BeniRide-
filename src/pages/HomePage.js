import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { bookRide } from "../firebase/services";
import { RIDE_TYPES, BENI_LOCATIONS, calculateFare, SUPPORT } from "../data/constants";

const C = {
  primary: "#FF3B4E", dark: "#0D0D1A", card: "#16213E",
  text: "#F0F0F0", muted: "#8892A4", green: "#00D68F", accent: "#FFD93D",
};

const MapSVG = () => (
  <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 14 }}>
    <rect width="400" height="200" fill="#1a2744" rx="14" />
    <path d="M0 105 Q100 85 200 105 Q300 125 400 105" stroke="#2a3a6a" strokeWidth="18" strokeLinecap="round" />
    <path d="M0 105 Q100 85 200 105 Q300 125 400 105" stroke="#253060" strokeWidth="14" strokeLinecap="round" strokeDasharray="20 10" />
    <path d="M200 0 Q210 55 200 105 Q190 155 200 200" stroke="#2a3a6a" strokeWidth="12" strokeLinecap="round" />
    <path d="M0 140 Q80 130 160 140 Q240 150 320 135 Q360 130 400 140" stroke="#1e4d8c" strokeWidth="7" fill="none" />
    <path d="M0 140 Q80 130 160 140 Q240 150 320 135 Q360 130 400 140" stroke="#2563b0" strokeWidth="3" fill="none" opacity="0.5" />
    {[30,70,130,250,310,350].map((x,i) => <rect key={i} x={x} y={55+(i%3)*8} width={18+(i%2)*8} height={26+(i%3)*5} fill="#243268" rx="2" />)}
    <circle cx="140" cy="100" r="9" fill="#00D68F" opacity="0.25" />
    <circle cx="140" cy="100" r="5" fill="#00D68F" />
    <circle cx="280" cy="110" r="9" fill="#FF3B4E" opacity="0.25" />
    <circle cx="280" cy="110" r="5" fill="#FF3B4E" />
    <path d="M140 100 Q180 80 220 95 Q255 108 280 110" stroke="#FF3B4E" strokeWidth="2" strokeDasharray="6 4" fill="none" />
    <rect x="198" y="84" width="14" height="9" rx="3" fill="#FFD93D" />
    <circle cx="202" cy="93" r="2" fill="#1A1A2E" />
    <circle cx="209" cy="93" r="2" fill="#1A1A2E" />
    <text x="126" y="90" fill="#00D68F" fontSize="9" fontWeight="bold">You</text>
    <text x="265" y="102" fill="#FF3B4E" fontSize="9" fontWeight="bold">Dest.</text>
    <text x="140" y="148" fill="#4a7acc" fontSize="8" opacity="0.8">Myagdi Khola</text>
    <text x="10" y="18" fill="#8892A4" fontSize="10">Beni, Myagdi — Live Map</text>
  </svg>
);

export default function HomePage() {
  const { user, profile, logout } = useAuth();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rideType, setRideType] = useState("bike");
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(null);
  const [showSupport, setShowSupport] = useState(false);

  const selectedRide = RIDE_TYPES.find(r => r.id === rideType);
  const fare = calculateFare(rideType, 2.5); // Default 2.5km estimate

  const handleBook = async () => {
    if (!from || !to) { alert("Please select pickup and destination"); return; }
    setBooking(true);
    try {
      const rideRef = await bookRide({
        riderId: user.uid,
        riderName: profile?.name || user.displayName,
        riderPhone: profile?.phone || "",
        from, to, rideType,
        estimatedFare: fare,
      });
      setTimeout(() => {
        setBooking(false);
        setBooked({ id: rideRef.id, from, to, rideType, fare });
      }, 2500);
    } catch (e) {
      alert("Booking failed: " + e.message);
      setBooking(false);
    }
  };

  const s = {
    page: { minHeight: "100vh", background: C.dark, color: C.text, fontFamily: "'Outfit', sans-serif", maxWidth: 430, margin: "0 auto" },
    header: { padding: "18px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontSize: 22, fontWeight: 900 },
    logoSpan: { color: C.primary },
    avatar: { width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.dark, cursor: "pointer" },
    section: { padding: "14px 20px" },
    label: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    select: { width: "100%", background: "#0D0D1A", border: "1px solid #ffffff0f", borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 14, fontFamily: "'Outfit', sans-serif", marginBottom: 8 },
    rideCard: (a) => ({ background: a ? `${C.primary}18` : C.card, border: `1.5px solid ${a ? C.primary : "#ffffff0a"}`, borderRadius: 14, padding: "11px 14px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s" }),
    btn: { width: "100%", background: `linear-gradient(135deg,${C.primary},#ff6b35)`, color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: `0 4px 20px ${C.primary}44` },
    tag: { background: C.green, color: C.dark, fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 6 },
    modal: { position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
    modalCard: { background: C.card, borderRadius: 24, padding: 28, width: "100%", maxWidth: 360, textAlign: "center", border: "1px solid #ffffff10" },
  };

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap'); *{box-sizing:border-box;margin:0} input,select{outline:none} input::placeholder{color:#8892A4} @keyframes spin{to{transform:rotate(360deg)}} @keyframes pop{0%{transform:scale(0.85);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}`}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.logo}>Beni<span style={s.logoSpan}>Ride</span></div>
          <div style={{ fontSize: 11, color: C.muted }}>🟢 Beni, Myagdi</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 18, cursor: "pointer" }} onClick={() => setShowSupport(true)}>🆘</span>
          <div style={s.avatar} onClick={logout} title="Tap to logout">
            {(profile?.name || user?.displayName || "R")[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ padding: "12px 20px 0" }}><MapSVG /></div>

      {/* Booking Form */}
      <div style={s.section}>
        <div style={s.label}>Pickup Location</div>
        <select style={s.select} value={from} onChange={e => setFrom(e.target.value)}>
          <option value="">-- Select pickup --</option>
          {BENI_LOCATIONS.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
        </select>
        <div style={s.label}>Destination</div>
        <select style={s.select} value={to} onChange={e => setTo(e.target.value)}>
          <option value="">-- Where are you going? --</option>
          {BENI_LOCATIONS.filter(l => l.name !== from).map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
        </select>
      </div>

      {/* Ride Types */}
      <div style={s.section}>
        <div style={s.label}>Choose Ride</div>
        {RIDE_TYPES.map(r => (
          <div key={r.id} style={s.rideCard(rideType === r.id)} onClick={() => setRideType(r.id)}>
            <span style={{ fontSize: 26 }}>{r.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                {r.tag && <span style={s.tag}>{r.tag}</span>}
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>{r.desc} · {r.eta}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: rideType === r.id ? C.primary : C.text }}>
                {r.id === "ebike" ? "Rs. 30/hr" : `Rs. ${calculateFare(r.id, 2.5)}`}
              </div>
              <div style={{ fontSize: 11, color: C.green }}>{r.eta}</div>
            </div>
          </div>
        ))}
        <button style={s.btn} onClick={handleBook}>
          Book {selectedRide?.name} →
        </button>
      </div>

      {/* Booking in progress */}
      {booking && (
        <div style={s.modal}>
          <div style={s.modalCard}>
            <div style={{ fontSize: 44, animation: "spin 1s linear infinite", display: "inline-block", marginBottom: 12 }}>
              {selectedRide?.icon}
            </div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>Finding Driver...</div>
            <div style={{ fontSize: 13, color: C.muted }}>Matching you with nearest {selectedRide?.name} in Beni</div>
          </div>
        </div>
      )}

      {/* Booked success */}
      {booked && (
        <div style={s.modal} onClick={() => setBooked(null)}>
          <div style={{ ...s.modalCard, animation: "pop 0.4s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
            <div style={{ fontWeight: 900, fontSize: 22, color: C.green, marginBottom: 6 }}>Driver Found!</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Your ride is confirmed</div>
            <div style={{ background: C.dark, borderRadius: 12, padding: "12px 16px", marginBottom: 16, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.muted, fontSize: 12 }}>From</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{booked.from}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.muted, fontSize: 12 }}>To</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{booked.to}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Estimated Fare</span>
                <span style={{ fontWeight: 800, fontSize: 13, color: C.accent }}>Rs. {booked.fare}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={`https://wa.me/${SUPPORT.whatsapp}`} style={{ ...s.btn, flex: 1, padding: "11px 0", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                📞 Call Support
              </a>
              <button style={{ ...s.btn, flex: 1, padding: "11px 0", fontSize: 13, background: C.card, boxShadow: "none", border: "1px solid #ffffff10" }} onClick={() => setBooked(null)}>
                ✓ Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupport && (
        <div style={s.modal} onClick={() => setShowSupport(false)}>
          <div style={{ ...s.modalCard, animation: "pop 0.4s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🆘</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>Need Help?</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>BeniRide Support · {SUPPORT.hours}</div>
            <a href={`https://wa.me/${SUPPORT.whatsapp}`} style={{ ...s.btn, display: "block", textDecoration: "none", marginBottom: 10, padding: "13px 0" }}>
              💬 WhatsApp Support
            </a>
            <a href={`tel:${SUPPORT.phone}`} style={{ ...s.btn, display: "block", textDecoration: "none", background: C.card, boxShadow: "none", border: "1px solid #ffffff10", padding: "13px 0" }}>
              📞 Call Us
            </a>
          </div>
        </div>
      )}

      <div style={{ height: 30 }} />
    </div>
  );
}
