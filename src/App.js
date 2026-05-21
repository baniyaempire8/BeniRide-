import { useState } from "react";

const C = {
  primary: "#FF3B4E", dark: "#0D0D1A", card: "#16213E",
  text: "#F0F0F0", muted: "#8892A4", green: "#00D68F", accent: "#FFD93D",
};

const LOCATIONS = [
  "Beni Bazaar","Beni Bridge","Baglung Gate","Beni Hospital",
  "Bus Park","Myagdi Campus","Hospital Road","Police Office","Darbang","Tatopani",
];

const RIDES = [
  { id:"bike", name:"BeniMoto", icon:"🏍️", desc:"Fast motorcycle ride", eta:"2 min", price:"Rs. 50–80" },
  { id:"car",  name:"BeniCar",  icon:"🚗", desc:"Comfortable car ride",  eta:"5 min", price:"Rs. 120–200" },
  { id:"ebike",name:"BeniEbike",icon:"⚡", desc:"Eco e-bike rental",     eta:"Now",   price:"Rs. 30/hr", tag:"ECO" },
];

const MapSVG = () => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",borderRadius:14}}>
    <rect width="400" height="180" fill="#1a2744" rx="14"/>
    <path d="M0 95 Q100 75 200 95 Q300 115 400 95" stroke="#2a3a6a" strokeWidth="18" strokeLinecap="round" fill="none"/>
    <path d="M0 95 Q100 75 200 95 Q300 115 400 95" stroke="#253060" strokeWidth="14" strokeLinecap="round" strokeDasharray="20 10" fill="none"/>
    <path d="M200 0 Q210 50 200 95 Q190 140 200 180" stroke="#2a3a6a" strokeWidth="12" strokeLinecap="round" fill="none"/>
    <path d="M0 130 Q80 120 160 130 Q240 140 320 125 Q360 120 400 130" stroke="#1e4d8c" strokeWidth="6" fill="none"/>
    {[30,70,130,250,310,350].map((x,i)=><rect key={i} x={x} y={48+(i%3)*8} width={18+(i%2)*8} height={24+(i%3)*5} fill="#243268" rx="2"/>)}
    <circle cx="140" cy="90" r="9" fill="#00D68F" opacity="0.25"/>
    <circle cx="140" cy="90" r="5" fill="#00D68F"/>
    <circle cx="280" cy="100" r="9" fill="#FF3B4E" opacity="0.25"/>
    <circle cx="280" cy="100" r="5" fill="#FF3B4E"/>
    <path d="M140 90 Q180 72 220 85 Q255 98 280 100" stroke="#FF3B4E" strokeWidth="2" strokeDasharray="6 4" fill="none"/>
    <rect x="198" y="76" width="14" height="9" rx="3" fill="#FFD93D"/>
    <circle cx="202" cy="85" r="2" fill="#1A1A2E"/>
    <circle cx="209" cy="85" r="2" fill="#1A1A2E"/>
    <text x="126" y="80" fill="#00D68F" fontSize="9" fontWeight="bold">You</text>
    <text x="265" y="92" fill="#FF3B4E" fontSize="9" fontWeight="bold">Dest.</text>
    <text x="130" y="138" fill="#4a7acc" fontSize="8" opacity="0.8">Myagdi Khola</text>
    <text x="10" y="16" fill="#8892A4" fontSize="10">Beni, Myagdi</text>
  </svg>
);

export default function App() {
  const [tab, setTab] = useState("home");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [ride, setRide] = useState("bike");
  const [step, setStep] = useState("idle"); // idle | finding | found
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const sel = RIDES.find(r=>r.id===ride);

  const handleBook = () => {
    if (!from || !to) { alert("Please select pickup and destination"); return; }
    if (!loggedIn) { setShowLogin(true); return; }
    setStep("finding");
    setTimeout(()=>setStep("found"), 2500);
  };

  const s = {
    app:{ fontFamily:"'Outfit',sans-serif", background:C.dark, color:C.text, minHeight:"100vh", maxWidth:430, margin:"0 auto" },
    hdr:{ padding:"18px 20px 0", display:"flex", alignItems:"center", justifyContent:"space-between" },
    logo:{ fontSize:22, fontWeight:900 },
    sec:{ padding:"14px 20px" },
    lbl:{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:8 },
    sel:{ width:"100%", background:"#0D0D1A", border:"1px solid #ffffff0f", borderRadius:12, padding:"11px 14px", color:C.text, fontSize:14, fontFamily:"'Outfit',sans-serif", marginBottom:8 },
    rc:(a)=>({ background:a?`${C.primary}18`:C.card, border:`1.5px solid ${a?C.primary:"#ffffff0a"}`, borderRadius:14, padding:"11px 14px", marginBottom:8, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }),
    btn:{ width:"100%", background:`linear-gradient(135deg,${C.primary},#ff6b35)`, color:"#fff", border:"none", borderRadius:14, padding:"14px 0", fontSize:16, fontWeight:800, cursor:"pointer", fontFamily:"'Outfit',sans-serif", boxShadow:`0 4px 20px ${C.primary}44` },
    tag:{ background:C.green, color:C.dark, fontSize:9, fontWeight:800, padding:"2px 6px", borderRadius:6 },
    modal:{ position:"fixed", inset:0, background:"#000000cc", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20 },
    mc:{ background:C.card, borderRadius:24, padding:28, width:"100%", maxWidth:360, textAlign:"center", border:"1px solid #ffffff10" },
    inp:{ width:"100%", background:"#0D0D1A", border:"1px solid #ffffff0f", borderRadius:12, padding:"12px 14px", color:C.text, fontSize:14, fontFamily:"'Outfit',sans-serif", marginBottom:10, boxSizing:"border-box" },
    tab:(a)=>({ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", color:a?C.primary:C.muted, fontSize:10, fontFamily:"'Outfit',sans-serif", fontWeight:a?700:400 }),
  };

  const tabs = [{id:"home",icon:"🏠",label:"Home"},{id:"ebike",icon:"⚡",label:"E-Bike"},{id:"profile",icon:"👤",label:"Profile"}];

  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0} input,select{outline:none} input::placeholder,select{color:#8892A4}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pop{0%{transform:scale(0.85);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:0}
      `}</style>

      <div style={{overflowY:"auto", maxHeight:"calc(100vh - 64px)"}}>

        {/* ── HOME TAB ── */}
        {tab==="home" && (
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={s.hdr}>
              <div>
                <div style={s.logo}>Beni<span style={{color:C.primary}}>Ride</span></div>
                <div style={{fontSize:11,color:C.muted}}>🟢 Beni, Myagdi</div>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:20,cursor:"pointer"}} onClick={()=>setShowSupport(true)}>🆘</span>
                <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.primary},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:C.dark,cursor:"pointer"}} onClick={()=>setLoggedIn(false)}>
                  {loggedIn ? name[0]?.toUpperCase() || "R" : "?"}
                </div>
              </div>
            </div>

            <div style={{padding:"12px 20px 0"}}><MapSVG/></div>

            <div style={s.sec}>
              <div style={s.lbl}>Pickup Location</div>
              <select style={s.sel} value={from} onChange={e=>setFrom(e.target.value)}>
                <option value="">-- Select pickup --</option>
                {LOCATIONS.map(l=><option key={l}>{l}</option>)}
              </select>
              <div style={s.lbl}>Destination</div>
              <select style={s.sel} value={to} onChange={e=>setTo(e.target.value)}>
                <option value="">-- Where are you going? --</option>
                {LOCATIONS.filter(l=>l!==from).map(l=><option key={l}>{l}</option>)}
              </select>
            </div>

            <div style={s.sec}>
              <div style={s.lbl}>Choose Ride</div>
              {RIDES.map(r=>(
                <div key={r.id} style={s.rc(ride===r.id)} onClick={()=>setRide(r.id)}>
                  <span style={{fontSize:26}}>{r.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontWeight:700,fontSize:14}}>{r.name}</span>
                      {r.tag && <span style={s.tag}>{r.tag}</span>}
                    </div>
                    <div style={{fontSize:12,color:C.muted}}>{r.desc} · {r.eta}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:800,fontSize:13,color:ride===r.id?C.primary:C.text}}>{r.price}</div>
                    <div style={{fontSize:11,color:C.green}}>{r.eta}</div>
                  </div>
                </div>
              ))}
              <button style={s.btn} onClick={handleBook}>Book {sel?.name} →</button>
            </div>

            <div style={s.sec}>
              <div style={s.lbl}>Recent Rides</div>
              {[{from:"Beni Bazaar",to:"Baglung Gate",icon:"🏍️",price:"Rs. 65",date:"Today"},
                {from:"Hospital Road",to:"Beni Bridge",icon:"🚗",price:"Rs. 150",date:"Yesterday"}].map((r,i)=>(
                <div key={i} style={{...{background:C.card,borderRadius:14,padding:"12px 14px",marginBottom:8,border:"1px solid #ffffff0a"},display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:22}}>{r.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600}}>{r.from} → {r.to}</div>
                    <div style={{fontSize:11,color:C.muted}}>{r.date}</div>
                  </div>
                  <div style={{fontWeight:700,fontSize:13,color:C.accent}}>{r.price}</div>
                </div>
              ))}
            </div>
            <div style={{height:20}}/>
          </div>
        )}

        {/* ── EBIKE TAB ── */}
        {tab==="ebike" && (
          <div style={{padding:20,animation:"fadeUp 0.3s ease"}}>
            <div style={{fontSize:20,fontWeight:800,marginBottom:4}}>E-Bike Rentals</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Eco-friendly rides around Beni</div>
            <div style={{background:`linear-gradient(135deg,${C.green}22,${C.card})`,border:`1.5px solid ${C.green}44`,borderRadius:18,padding:20,marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:52,marginBottom:10}}>⚡🚲</div>
              <div style={{fontWeight:800,fontSize:18,marginBottom:6}}>BeniEbike Fleet</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>Scan QR on any BeniEbike to unlock. Only Rs. 30/hr.</div>
            </div>
            {[{i:"📱",t:"Scan & Ride",d:"Scan QR code on any BeniEbike to unlock"},{i:"💳",t:"Pay per hour",d:"Only Rs. 30/hr, no hidden charges"},{i:"📍",t:"Park anywhere",d:"Designated zones across Beni Bazaar"},{i:"🌱",t:"Zero emissions",d:"Solar-charged batteries"}].map((f,i)=>(
              <div key={i} style={{background:C.card,borderRadius:14,padding:"12px 14px",marginBottom:8,border:"1px solid #ffffff0a",display:"flex",gap:14,alignItems:"flex-start"}}>
                <span style={{fontSize:22}}>{f.i}</span>
                <div><div style={{fontWeight:700,fontSize:14}}>{f.t}</div><div style={{fontSize:12,color:C.muted}}>{f.d}</div></div>
              </div>
            ))}
            <button style={{...s.btn,background:`linear-gradient(135deg,${C.green},#00b37a)`,boxShadow:`0 4px 20px ${C.green}44`,marginTop:8}}>Notify Me When Live 🔔</button>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab==="profile" && (
          <div style={{padding:20,animation:"fadeUp 0.3s ease"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${C.primary},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,color:C.dark,margin:"0 auto 12px"}}>{loggedIn?name[0]?.toUpperCase()||"R":"?"}</div>
              <div style={{fontWeight:800,fontSize:18}}>{loggedIn?name:"Guest User"}</div>
              <div style={{fontSize:13,color:C.muted}}>Beni, Myagdi</div>
            </div>
            {!loggedIn && <button style={s.btn} onClick={()=>setShowLogin(true)}>Login / Sign Up</button>}
            {loggedIn && (
              <>
                {[{l:"Total Rides",v:"12",i:"🚗"},{l:"E-bikes Used",v:"3",i:"⚡"},{l:"CO₂ Saved",v:"1.2 kg",i:"🌿"}].map((s2,i)=>(
                  <div key={i} style={{background:C.card,borderRadius:14,padding:"12px 14px",marginBottom:8,border:"1px solid #ffffff0a",display:"flex",alignItems:"center",gap:14}}>
                    <span style={{fontSize:22}}>{s2.i}</span>
                    <div style={{flex:1,fontWeight:600}}>{s2.l}</div>
                    <div style={{fontWeight:800,color:C.accent}}>{s2.v}</div>
                  </div>
                ))}
                <div style={{background:C.card,borderRadius:14,padding:"14px 16px",marginTop:4,border:"1px solid #ffffff0a"}}>
                  <div style={{fontWeight:700,marginBottom:10}}>Referral Code</div>
                  <div style={{background:C.dark,borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:800,letterSpacing:2,color:C.accent}}>BENI2025</span>
                    <span style={{fontSize:11,color:C.primary,fontWeight:700,cursor:"pointer"}}>Copy</span>
                  </div>
                  <div style={{fontSize:12,color:C.muted,marginTop:8}}>Share BeniRide — earn Rs. 50 per referral 🎉</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* TAB BAR */}
      <div style={{position:"sticky",bottom:0,background:C.card,borderTop:"1px solid #ffffff0f",display:"flex",justifyContent:"space-around",padding:"10px 0 14px"}}>
        {tabs.map(t=>(
          <button key={t.id} style={s.tab(tab===t.id)} onClick={()=>setTab(t.id)}>
            <span style={{fontSize:20}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={s.modal}>
          <div style={{...s.mc,animation:"pop 0.3s ease"}}>
            <div style={{fontSize:32,marginBottom:10}}>👋</div>
            <div style={{fontWeight:800,fontSize:20,marginBottom:6}}>Join BeniRide</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Enter your details to book</div>
            <input style={s.inp} placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)}/>
            <input style={s.inp} placeholder="Phone (98XXXXXXXX)" value={phone} onChange={e=>setPhone(e.target.value)}/>
            <button style={s.btn} onClick={()=>{if(name&&phone){setLoggedIn(true);setShowLogin(false);handleBook();}}}>Continue →</button>
            <div style={{fontSize:12,color:C.muted,marginTop:12,cursor:"pointer"}} onClick={()=>setShowLogin(false)}>Cancel</div>
          </div>
        </div>
      )}

      {/* FINDING MODAL */}
      {step==="finding" && (
        <div style={s.modal}>
          <div style={s.mc}>
            <div style={{fontSize:44,animation:"spin 1s linear infinite",display:"inline-block",marginBottom:12}}>{sel?.icon}</div>
            <div style={{fontWeight:800,fontSize:20,marginBottom:6}}>Finding Driver...</div>
            <div style={{fontSize:13,color:C.muted}}>Matching you with nearest {sel?.name} in Beni</div>
          </div>
        </div>
      )}

      {/* FOUND MODAL */}
      {step==="found" && (
        <div style={s.modal} onClick={()=>setStep("idle")}>
          <div style={{...s.mc,animation:"pop 0.4s ease"}}>
            <div style={{fontSize:48,marginBottom:10}}>🎉</div>
            <div style={{fontWeight:900,fontSize:22,color:C.green,marginBottom:6}}>Driver Found!</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Ram B. is on his way · ⭐ 4.9</div>
            <div style={{background:C.dark,borderRadius:12,padding:"12px 16px",marginBottom:16,textAlign:"left"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{color:C.muted,fontSize:12}}>From</span>
                <span style={{fontWeight:700,fontSize:13}}>{from}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{color:C.muted,fontSize:12}}>To</span>
                <span style={{fontWeight:700,fontSize:13}}>{to}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <a href="https://wa.me/9779800000000" style={{...s.btn,flex:1,padding:"11px 0",fontSize:13,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>📞 Support</a>
              <button style={{...s.btn,flex:1,padding:"11px 0",fontSize:13,background:C.card,boxShadow:"none",border:"1px solid #ffffff10"}} onClick={()=>setStep("idle")}>✓ Done</button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT MODAL */}
      {showSupport && (
        <div style={s.modal} onClick={()=>setShowSupport(false)}>
          <div style={{...s.mc,animation:"pop 0.3s ease"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:36,marginBottom:10}}>🆘</div>
            <div style={{fontWeight:800,fontSize:20,marginBottom:6}}>Need Help?</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:20}}>BeniRide Support · 6AM–10PM</div>
            <a href="https://wa.me/9779800000000" style={{...s.btn,display:"block",textDecoration:"none",marginBottom:10,padding:"13px 0"}}>💬 WhatsApp Support</a>
            <button style={{...s.btn,background:C.card,boxShadow:"none",border:"1px solid #ffffff10",padding:"13px 0"}} onClick={()=>setShowSupport(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
