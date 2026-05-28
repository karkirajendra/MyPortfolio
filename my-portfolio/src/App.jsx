import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #03050a; --surf: #080f1a; --surf2: #0d1826;
    --bdr: rgba(255,255,255,0.06); --bdr2: rgba(255,255,255,0.12);
    --txt: #eef2ff; --muted: #7a8fb3; --dim: #3d5070;
    --cyan: #22d3ee; --violet: #a78bfa; --rose: #fb7185;
    --gold: #fbbf24; --emerald: #34d399;
    --fd: 'Outfit', sans-serif; --fm: 'Fira Code', monospace; --fp: 'Playfair Display', serif;
    --cur-size: 14px; --cur-opacity: 1;
  }
  html { scroll-behavior: smooth; }
  body, #root {
    background: var(--bg); color: var(--txt);
    font-family: var(--fd); min-height: 100vh; overflow-x: hidden;
    cursor: none;
  }
  * { cursor: none !important; }
  ::selection { background: var(--cyan); color: #000; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: linear-gradient(var(--cyan), var(--violet)); border-radius: 4px; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideR    { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideL    { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
  @keyframes floatB    { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pulsate   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
  @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes borderGlw { 0%,100%{box-shadow:0 0 8px rgba(34,211,238,0.3)} 50%{box-shadow:0 0 24px rgba(34,211,238,0.7)} }
  @keyframes scan      { 0%{transform:translateY(-100vh)} 100%{transform:translateY(100vh)} }
  @keyframes noise     { 0%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)} 20%{transform:translate(-4%,1%)} 30%{transform:translate(3%,-2%)} 40%{transform:translate(-1%,4%)} 50%{transform:translate(-3%,2%)} 60%{transform:translate(4%,1%)} 70%{transform:translate(-2%,3%)} 80%{transform:translate(-4%,-2%)} 90%{transform:translate(2%,-4%)} 100%{transform:translate(0,0)} }
  @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes ripple    { 0%{transform:scale(0);opacity:1} 100%{transform:scale(4);opacity:0} }
  @keyframes glowPulse { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
  @keyframes easterBg  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes easterPop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 60%{transform:scale(1.1) rotate(3deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
  @keyframes easterOut { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(0.92) translateY(20px)} }
  @keyframes cursorLabel { from{opacity:0;transform:translate(-50%,-50%) scale(0.8)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
  @keyframes processLine { from{height:0} to{height:100%} }
  @keyframes tiltShine { 0%{transform:translateX(-100%) rotate(45deg)} 100%{transform:translateX(300%) rotate(45deg)} }
  @keyframes typewriterCaret { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes konamiFlash { 0%,100%{opacity:0} 10%,90%{opacity:1} }

  .ha1{animation:fadeUp  0.8s 0.1s ease both}
  .ha2{animation:fadeUp  0.8s 0.25s ease both}
  .ha3{animation:slideR  0.7s 0.4s ease both}
  .ha4{animation:fadeUp  0.7s 0.55s ease both}
  .ha5{animation:fadeUp  0.7s 0.7s ease both}
  .ha6{animation:fadeUp  0.7s 0.85s ease both}
  .haC{animation:slideL  0.8s 0.4s ease both}

  .rv { opacity:0; transform:translateY(28px); transition:opacity 0.7s ease, transform 0.7s ease; }
  .rv.fl { transform:translateX(-28px); }
  .rv.fr { transform:translateX(28px); }
  .rv.fs { transform:scale(0.96); }
  .rv.on { opacity:1; transform:none; }
  .rv.on.d1{transition-delay:0.1s} .rv.on.d2{transition-delay:0.2s}
  .rv.on.d3{transition-delay:0.3s} .rv.on.d4{transition-delay:0.4s}

  #pgb {
    position:fixed; top:0; left:0; height:2px; z-index:9999;
    background:linear-gradient(90deg, var(--cyan), var(--violet), var(--rose));
    box-shadow:0 0 14px var(--cyan); transition:width 0.12s linear;
  }
  #pgb::after {
    content:''; position:absolute; right:0; top:-3px;
    width:8px; height:8px; border-radius:50%;
    background:var(--cyan); box-shadow:0 0 10px var(--cyan);
  }

  /* ── ENHANCED CURSOR ── */
  #cur-glow {
    position:fixed; z-index:9996; pointer-events:none;
    width:260px; height:260px; border-radius:50%;
    background:radial-gradient(circle,rgba(34,211,238,0.045) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.1s linear, top 0.1s linear, width 0.3s ease, height 0.3s ease, background 0.4s ease;
  }
  #cur-ring {
    position:fixed; z-index:9997; pointer-events:none;
    width:32px; height:32px; border-radius:50%;
    border:1.5px solid rgba(34,211,238,0.6);
    transform:translate(-50%,-50%);
    transition:left 0.06s linear, top 0.06s linear, width 0.25s ease, height 0.25s ease, border-color 0.3s ease, opacity 0.3s ease;
    mix-blend-mode:screen;
  }
  #cur-dot {
    position:fixed; z-index:9999; pointer-events:none;
    width:5px; height:5px; border-radius:50%;
    background:var(--cyan);
    transform:translate(-50%,-50%);
    transition:left 0.02s linear, top 0.02s linear, transform 0.2s ease, background 0.3s ease;
    box-shadow:0 0 7px var(--cyan);
  }
  #cur-label {
    position:fixed; z-index:9998; pointer-events:none;
    font-family:var(--fm); font-size:0.52rem; font-weight:700;
    text-transform:uppercase; letter-spacing:0.15em;
    color:#000; background:var(--cyan);
    padding:0.22rem 0.6rem; border-radius:100px;
    transform:translate(-50%,-50%);
    white-space:nowrap; opacity:0;
    transition:opacity 0.2s ease, left 0.06s linear, top 0.06s linear;
    animation:cursorLabel 0.2s ease forwards;
  }
  #cur-label.vis { opacity:1; }

  .nz { position:fixed; inset:-50%; width:200%; height:200%; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); opacity:0.022; pointer-events:none; z-index:0; animation:noise 0.4s steps(1) infinite; }
  .gl { position:fixed; inset:0; pointer-events:none; z-index:0; background-image:linear-gradient(rgba(34,211,238,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.015) 1px,transparent 1px); background-size:56px 56px; }
  .sc { position:fixed; inset:0; overflow:hidden; pointer-events:none; z-index:0; opacity:0.02; }
  .sc::after { content:''; position:absolute; left:0; right:0; height:3px; background:linear-gradient(transparent,var(--cyan),transparent); animation:scan 6s linear infinite; }

  nav { position:fixed; top:0; left:0; right:0; z-index:100; height:60px; display:flex; align-items:center; justify-content:space-between; padding:0 clamp(1rem,4vw,3rem); transition:all 0.4s ease; }
  nav.sc2 { background:rgba(3,5,10,0.88); backdrop-filter:blur(24px); border-bottom:1px solid var(--bdr); box-shadow:0 4px 40px rgba(0,0,0,0.6); }
  .nlogo { display:flex; align-items:center; gap:10px; font-family:var(--fd); font-weight:800; font-size:1rem; color:var(--txt); text-decoration:none; letter-spacing:-0.01em; }
  .lmark { width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,var(--cyan),#0ea5e9); display:flex; align-items:center; justify-content:center; font-family:var(--fm); font-size:0.65rem; font-weight:700; color:#000; animation:borderGlw 3s ease-in-out infinite; flex-shrink:0; transition:transform 0.2s ease; }
  .lmark:hover { transform:rotate(-5deg) scale(1.1); }
  .nlinks { display:flex; align-items:center; gap:1.8rem; list-style:none; }
  .nlinks a { font-family:var(--fm); font-size:0.62rem; text-transform:uppercase; letter-spacing:0.14em; color:var(--muted); text-decoration:none; position:relative; transition:color 0.2s; }
  .nlinks a::after { content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:var(--cyan); transform:scaleX(0); transform-origin:left; transition:transform 0.25s ease; }
  .nlinks a:hover,.nlinks a.act { color:var(--txt); }
  .nlinks a:hover::after,.nlinks a.act::after { transform:scaleX(1); }
  .hbtn { font-family:var(--fm); font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:#000; background:var(--cyan); padding:0.45rem 1rem; border-radius:6px; border:none; cursor:none; text-decoration:none; transition:all 0.2s; box-shadow:0 0 18px rgba(34,211,238,0.3); }
  .hbtn:hover { box-shadow:0 0 28px rgba(34,211,238,0.55); transform:translateY(-1px); }
  .ham { display:none; background:none; border:1px solid var(--bdr2); border-radius:7px; padding:7px 8px; cursor:none; flex-direction:column; gap:4px; align-items:center; }
  .hl { display:block; width:18px; height:1.5px; background:var(--txt); transition:all 0.3s; border-radius:2px; }
  .hl.op:nth-child(1){transform:translateY(5.5px) rotate(45deg)} .hl.op:nth-child(2){opacity:0} .hl.op:nth-child(3){transform:translateY(-5.5px) rotate(-45deg)}
  .mmenu { position:fixed; inset:0; z-index:99; background:rgba(3,5,10,0.97); backdrop-filter:blur(20px); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2rem; animation:fadeIn 0.2s ease; }
  .mmenu a { font-family:var(--fd); font-size:2rem; font-weight:800; color:var(--muted); text-decoration:none; letter-spacing:-0.03em; transition:all 0.2s; }
  .mmenu a:hover { color:var(--cyan); transform:translateX(8px); }

  .hwrap { min-height:100vh; display:flex; align-items:center; padding:80px clamp(1rem,5vw,5rem) 4rem; position:relative; overflow:hidden; max-width:100%; }
  .orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; will-change:transform; }
  .oa { width:500px; height:500px; top:-15%; right:-8%; background:radial-gradient(circle,rgba(34,211,238,0.09) 0%,transparent 70%); }
  .ob { width:380px; height:380px; bottom:-10%; left:-6%; background:radial-gradient(circle,rgba(167,139,250,0.1) 0%,transparent 70%); }
  .oc { width:180px; height:180px; top:45%; left:38%; background:radial-gradient(circle,rgba(251,113,133,0.07) 0%,transparent 70%); }

  .gt { background:linear-gradient(135deg,var(--cyan) 0%,#38bdf8 40%,var(--violet) 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }

  .sec { padding:clamp(4rem,8vw,8rem) clamp(1rem,4vw,3rem); max-width:1200px; margin:0 auto; scroll-margin-top:70px; position:relative; z-index:2; }
  .eye { font-family:var(--fm); font-size:0.62rem; text-transform:uppercase; letter-spacing:0.28em; color:var(--cyan); display:flex; align-items:center; gap:0.7rem; margin-bottom:0.8rem; }
  .eye::before { content:''; width:20px; height:1px; background:linear-gradient(90deg,var(--cyan),transparent); flex-shrink:0; }
  .stl { font-family:var(--fp); font-size:clamp(2.2rem,5vw,3.6rem); font-weight:700; letter-spacing:-0.02em; line-height:1.08; color:var(--txt); margin-bottom:2.5rem; }

  /* ── TILT CARD ── */
  .tilt-card { transition:transform 0.1s ease-out, box-shadow 0.3s ease; transform-style:preserve-3d; will-change:transform; }
  .tilt-shine { position:absolute; inset:0; border-radius:inherit; pointer-events:none; opacity:0; transition:opacity 0.3s ease; background:linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%); z-index:1; }
  .tilt-card:hover .tilt-shine { opacity:1; }

  .cd { background:var(--surf); border:1px solid var(--bdr); border-radius:16px; transition:all 0.35s ease; position:relative; overflow:hidden; }
  .cd::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.02),transparent); pointer-events:none; z-index:0; }
  .cd:hover { border-color:var(--bdr2); box-shadow:0 16px 50px rgba(0,0,0,0.5); }

  .pl { display:inline-flex; align-items:center; padding:0.22rem 0.65rem; border-radius:100px; font-family:var(--fm); font-size:0.58rem; text-transform:uppercase; letter-spacing:0.08em; border:1px solid; transition:all 0.2s; }
  .pl:hover { transform:translateY(-2px) scale(1.06); }

  .td { width:8px; height:8px; border-radius:50%; background:var(--cyan); flex-shrink:0; box-shadow:0 0 10px var(--cyan); animation:pulsate 2.5s ease-in-out infinite; margin-top:4px; }
  .typed-c { display:inline-block; color:var(--cyan); animation:blink 1s step-end infinite; }

  .mqw { overflow:hidden; }
  .mqt { display:flex; gap:0.5rem; animation:marquee 18s linear infinite; width:max-content; }
  .mqt.rv { animation-direction:reverse; }

  .cnum { font-family:var(--fp); font-weight:700; font-size:clamp(1.8rem,3.5vw,2.5rem); letter-spacing:-0.04em; background:linear-gradient(135deg,var(--cyan),var(--violet)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  .ovl { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.82); backdrop-filter:blur(14px); display:flex; align-items:center; justify-content:center; padding:1rem; animation:fadeIn 0.2s ease; }
  .mdl { background:var(--surf); border:1px solid var(--bdr2); border-radius:20px; width:100%; max-width:660px; max-height:90vh; overflow-y:auto; padding:2rem; animation:scaleIn 0.25s ease; }
  .mdl::-webkit-scrollbar { width:3px; } .mdl::-webkit-scrollbar-thumb { background:var(--violet); }

  .rbtn { position:relative; overflow:hidden; }
  .rip { position:absolute; border-radius:50%; background:rgba(255,255,255,0.22); width:60px; height:60px; margin-top:-30px; margin-left:-30px; animation:ripple 0.6s ease-out forwards; pointer-events:none; }

  .cglow { position:absolute; width:420px; height:420px; border-radius:50%; filter:blur(100px); background:radial-gradient(circle,rgba(34,211,238,0.07),transparent 70%); top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none; }

  /* ── MAGNETIC BTN ── */
  .mag-wrap { display:inline-flex; position:relative; }

  /* ── PROCESS SECTION ── */
  .proc-line { position:absolute; left:50%; width:2px; top:0; bottom:0; background:linear-gradient(to bottom,transparent,var(--cyan),var(--violet),transparent); opacity:0.15; transform:translateX(-50%); }
  .proc-node { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--fm); font-size:0.75rem; font-weight:700; flex-shrink:0; position:relative; z-index:1; }

  /* ── PROJECT HOVER PREVIEW ── */
  .proj-preview { position:absolute; inset:0; border-radius:inherit; overflow:hidden; pointer-events:none; opacity:0; transition:opacity 0.35s ease; z-index:0; }
  .proj-preview.vis { opacity:1; }
  .proj-tech-anim { display:flex; flex-wrap:wrap; gap:0.3rem; }

  /* ── EASTER EGG ── */
  .konami-ovl { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; animation:fadeIn 0.3s ease; }
  .konami-bg { position:absolute; inset:0; background:linear-gradient(270deg,#03050a,#080f1a,#0d1826,#080f1a); background-size:400% 400%; animation:easterBg 3s ease infinite; }
  .konami-box { position:relative; background:rgba(3,5,10,0.9); border:1px solid rgba(34,211,238,0.4); border-radius:20px; padding:3rem 3.5rem; text-align:center; max-width:500px; width:90%; box-shadow:0 0 80px rgba(34,211,238,0.2), inset 0 0 40px rgba(34,211,238,0.03); animation:easterPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
  .konami-exit { animation:easterOut 0.3s ease forwards; }

  /* ── SECTION BLUR REVEAL ── */
  .blur-reveal { opacity:0; filter:blur(8px); transform:translateY(20px); transition:opacity 0.8s ease, filter 0.8s ease, transform 0.8s ease; }
  .blur-reveal.on { opacity:1; filter:blur(0); transform:translateY(0); }

  @media (max-width:1024px) {
    .hgrid { grid-template-columns:1fr !important; }
    .hcard { display:none !important; }
    .expg { grid-template-columns:1fr !important; }
    .expa { display:none !important; }
    .fgrid { grid-template-columns:1fr !important; }
    .fprv  { display:none !important; }
    .proc-line { display:none; }
    .proc-grid { grid-template-columns:1fr !important; }
  }
  @media (max-width:768px) {
    .nlinks { display:none; }
    .hnb { display:none !important; }
    .ham { display:flex !important; }
    .skgr { grid-template-columns:1fr !important; }
    .abgr { grid-template-columns:1fr !important; }
    .abst { grid-template-columns:1fr 1fr !important; }
    .pjgr { grid-template-columns:1fr !important; }
    .ctgr { grid-template-columns:1fr !important; }
    .mdl  { padding:1.4rem; }
    .mdig { grid-template-columns:1fr !important; }
    .mdhg { grid-template-columns:1fr !important; }
    .hwrap { padding-top:88px; padding-bottom:3rem; }
    .hname { font-size:clamp(3rem,13vw,4.5rem) !important; }
    .hctas { flex-direction:column !important; }
    .hcbtn { width:100% !important; justify-content:center !important; }
    .hsoc  { justify-content:center !important; }
    .htxt  { text-align:center !important; }
    .eye   { justify-content:center; }
    .eye::before { display:none; }
    .stl   { text-align:center; }
    .fdesc { padding:1.4rem !important; }
    #cur-ring, #cur-dot, #cur-glow, #cur-label { display:none; }
  }
  @media (max-width:480px) {
    .sec { padding-left:0.9rem; padding-right:0.9rem; }
    .mmenu a { font-size:1.6rem; }
    .htags { justify-content:center !important; }
    .pl { font-size:0.52rem; }
  }
`;

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */
const skillGroups = [
  { label:"Frontend",       col:"#22d3ee", bg:"rgba(34,211,238,0.06)",  bd:"rgba(34,211,238,0.22)",  items:["React.js","Vue.js 3","Tailwind CSS","Bootstrap","HTML5","CSS3"] },
  { label:"Backend",        col:"#34d399", bg:"rgba(52,211,153,0.06)",  bd:"rgba(52,211,153,0.22)",  items:["Node.js","Express.js","Laravel","PHP"] },
  { label:"Database",       col:"#a78bfa", bg:"rgba(167,139,250,0.06)", bd:"rgba(167,139,250,0.22)", items:["MongoDB","MySQL","SQLite"] },
  { label:"Languages",      col:"#fbbf24", bg:"rgba(251,191,36,0.06)",  bd:"rgba(251,191,36,0.22)",  items:["JavaScript","PHP","Java","C","C#"] },
  { label:"Tools & Others", col:"#fb7185", bg:"rgba(251,113,133,0.06)", bd:"rgba(251,113,133,0.22)", items:["Git","GitHub","Vite","JWT Auth","REST APIs","Cloudinary","XAMPP"] },
];

const projects = [
  { num:"01", title:"RoomSathi", subtitle:"Property Rental Platform",
    desc:"Full-stack MERN rental marketplace connecting room seekers with landlords. JWT auth with 3 roles, advanced property search, Cloudinary image uploads, booking workflow with payments, and an admin analytics dashboard across 50+ REST API endpoints.",
    story:{ problem:"Finding rooms in Kathmandu is messy: scattered listings, low trust, and slow communication.", solution:"A product-style marketplace with role-based flows for seekers, landlords, and admins — search, media, booking, and analytics in one place.", highlights:["JWT auth with 3 roles + protected routes","Advanced search + filters for fast discovery","Cloudinary uploads with safe media workflow","Booking workflow and admin analytics dashboard"] },
    tech:["Node.js","Express","MongoDB","React"], github:"https://github.com/karkirajendra/sixthSem-project", ca:"#22d3ee", cb:"#0ea5e9", featured:true },
  { num:"02", title:"Appointment System", subtitle:"Booking Management",
    desc:"Laravel scheduling system for salons, clinics & businesses. Dual auth for owners and customers, calendar-based booking, automated conflict detection, employee roster management, and timezone-aware scheduling.",
    story:{ problem:"Manual scheduling causes double-bookings, missed appointments, and no visibility for owners.", solution:"A calendar-first system with dual auth, conflict detection, and clear business controls.", highlights:["Dual auth for owners + customers","Calendar-based booking with conflict prevention","Employee roster management","Timezone-aware scheduling"] },
    tech:["Laravel 5.4","Bootstrap","MySQL"], github:"https://github.com/karkirajendra/Apointment-System", ca:"#34d399", cb:"#0ea5e9" },
  { num:"03", title:"Futech", subtitle:"Modern Blog Platform",
    desc:"Decoupled blogging platform with a Laravel REST API backend and Vue.js 3 SPA frontend. Independent deployment, Vite HMR for fast development, pnpm package management, and full blog CRUD operations.",
    story:{ problem:"Traditional monolith blog setups are harder to scale and iterate on the frontend.", solution:"A decoupled architecture: Laravel REST API + Vue SPA for fast, independent development.", highlights:["Decoupled API + SPA architecture","Full blog CRUD flow","Fast dev experience with Vite HMR","Deployable as separate frontend/backend services"] },
    tech:["Laravel","Vue.js 3","Vite"], github:"https://github.com/karkirajendra/futech_project", ca:"#a78bfa", cb:"#fb7185" },
  { num:"04", title:"Expense Tracker", subtitle:"Personal Finance Tool",
    desc:"Web-based personal finance tracker with daily/weekly/monthly expense categorization, transaction history, summary reports, and clean CRUD interface built with core PHP and MySQL.",
    story:{ problem:"Most expense notes don't convert to insight — people need summaries, categories, and history.", solution:"A simple CRUD app with categories and summaries that makes spending patterns visible.", highlights:["Daily/weekly/monthly categorization","Transaction history with summaries","Clean CRUD experience","Simple, reliable PHP + MySQL stack"] },
    tech:["PHP","MySQL","HTML","CSS"], github:"https://github.com/karkirajendra", ca:"#fbbf24", cb:"#fb7185" },
];

const processSteps = [
  { num:"01", icon:"◈", title:"Understand the Problem", col:"#22d3ee",
    desc:"I start by defining who the user is and what's actually painful for them. No code yet — just clarity on the core problem worth solving.",
    tag:"Research" },
  { num:"02", icon:"◫", title:"Design the Architecture", col:"#a78bfa",
    desc:"Plan the data model, API surface, and component structure before writing a line. Clean architecture decisions compound — messy ones compound too.",
    tag:"Planning" },
  { num:"03", icon:"⟳", title:"Build & Iterate", col:"#34d399",
    desc:"Ship a working core fast. Get feedback. Layer on polish. Vite + Git mean I can iterate in hours, not days.",
    tag:"Development" },
  { num:"04", icon:"✦", title:"Deliver & Document", col:"#fbbf24",
    desc:"Clean code, clear commits, and a README that makes handoff painless. Shipped work > perfect work-in-progress.",
    tag:"Delivery" },
];

const experience = [
  { when:"2025 — Present", role:"Full-Stack Developer", org:"Independent Projects", stack:"MERN · Laravel · Vue", col:"#22d3ee",
    points:["Built role-based auth systems (JWT), dashboards, and REST APIs across multiple apps.","Focused on performance, clean UI, and production-ready workflows (uploads, search, payments)."] },
  { when:"2024 — 2025", role:"MERN Stack Training", org:"N9-Solution", stack:"React · Node · MongoDB", col:"#34d399",
    points:["Strengthened React patterns, API design, and modern tooling (Vite, Git/GitHub).","Delivered full-stack assignments with authentication, CRUD, and deployment basics."] },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════════════ */
function useTyped(words, speed = 80, pause = 1900) {
  const [d, setD] = useState(""); const [wi, setWi] = useState(0); const [ci, setCi] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[wi]; const atE = !del && ci === w.length; const atS = del && ci === 0;
    const delay = atE ? pause : del ? speed / 2 : speed;
    const t = setTimeout(() => {
      if (atE) { setDel(true); return; } if (atS) { setDel(false); setWi(i => (i + 1) % words.length); return; }
      const n = del ? ci - 1 : ci + 1; setD(w.slice(0, n)); setCi(n);
    }, delay);
    return () => clearTimeout(t);
  }, [ci, del, pause, speed, wi, words]);
  return d;
}

function useScrollProg() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => { const d = document.documentElement; setP(Math.min(1, window.scrollY / Math.max(1, d.scrollHeight - d.clientHeight))); };
    window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}

function useActiveSection(ids) {
  const [act, setAct] = useState(ids[0] ?? "");
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => { const v = es.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (v?.target?.id) setAct(v.target.id); },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.2, 0.35] }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); }); return () => obs.disconnect();
  }, [ids]);
  return act;
}

function useCounter(target, go, dur = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return; let s = null;
    const step = ts => { if (!s) s = ts; const p = Math.min((ts - s) / dur, 1); const e = 1 - Math.pow(1 - p, 3); setN(Math.round(e * target)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [target, go, dur]);
  return n;
}

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rv, .blur-reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useParallax() {
  const scrollY = useRef(0);
  const rafRef = useRef(null);
  const listenersRef = useRef([]);

  const register = useCallback((el, speed) => {
    if (!el) return;
    listenersRef.current.push({ el, speed });
  }, []);

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    const tick = () => {
      listenersRef.current.forEach(({ el, speed }) => {
        el.style.transform = `translateY(${scrollY.current * speed}px)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return register;
}

function useKonami() {
  const [activated, setActivated] = useState(false);
  useEffect(() => {
    const CODE = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let pos = 0;
    const handler = (e) => {
      if (e.key === CODE[pos]) { pos++; if (pos === CODE.length) { setActivated(true); pos = 0; } }
      else { pos = e.key === CODE[0] ? 1 : 0; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return [activated, () => setActivated(false)];
}

function useTilt(strength = 12) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    el.style.transform = `perspective(900px) rotateX(${-dy * strength}deg) rotateY(${dx * strength}deg) scale(1.02)`;
    const shine = el.querySelector(".tilt-shine");
    if (shine) { shine.style.background = `radial-gradient(circle at ${50 + dx * 30}% ${50 + dy * 30}%, rgba(255,255,255,0.07), transparent 60%)`; shine.style.opacity = "1"; }
  }, [strength]);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
    const shine = el.querySelector(".tilt-shine"); if (shine) shine.style.opacity = "0";
  }, []);
  return { ref, onMove, onLeave };
}

function addRipple(e) {
  const btn = e.currentTarget; const r = document.createElement("span"); r.className = "rip";
  const rect = btn.getBoundingClientRect(); r.style.left = `${e.clientX - rect.left}px`; r.style.top = `${e.clientY - rect.top}px`;
  btn.appendChild(r); setTimeout(() => r.remove(), 700);
}

/* ═══════════════════════════════════════════════════════════════════════════
   THREE.JS BACKGROUND
═══════════════════════════════════════════════════════════════════════════ */
function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth, H = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    camera.position.z = 55;

    const COUNT = 160;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const vel = [];

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 130;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 130;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      vel.push({ x: (Math.random() - 0.5) * 0.015, y: (Math.random() - 0.5) * 0.015 });
      const t = Math.random();
      colors[i * 3]     = t < 0.5 ? 0.13 : 0.65;
      colors[i * 3 + 1] = t < 0.5 ? 0.83 : 0.55;
      colors[i * 3 + 2] = t < 0.5 ? 0.93 : 0.98;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.5, transparent: true, opacity: 0.5, vertexColors: true, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    // Connection lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.04 });
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(COUNT * COUNT * 6);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    let animId;
    const THRESHOLD = 22;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      // Update particle positions
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3]     += vel[i].x;
        positions[i * 3 + 1] += vel[i].y;
        if (Math.abs(positions[i * 3]) > 65)     vel[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 65) vel[i].y *= -1;
      }
      geo.attributes.position.needsUpdate = true;

      // Update lines
      let li = 0;
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = positions[i*3]-positions[j*3], dy = positions[i*3+1]-positions[j*3+1];
          if (dx*dx+dy*dy < THRESHOLD*THRESHOLD) {
            linePos[li++]=positions[i*3]; linePos[li++]=positions[i*3+1]; linePos[li++]=positions[i*3+2];
            linePos[li++]=positions[j*3]; linePos[li++]=positions[j*3+1]; linePos[li++]=positions[j*3+2];
          }
        }
      }
      for (let i = li; i < linePos.length; i++) linePos[i] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, li / 3);

      pts.rotation.y += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose(); geo.dispose(); mat.dispose(); lineGeo.dispose(); lineMat.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAGNETIC BUTTON
═══════════════════════════════════════════════════════════════════════════ */
function MagBtn({ children, style, className, onClick, href, target, rel, onClickCapture }) {
  const btnRef = useRef(null);
  const onMove = (e) => {
    const el = btnRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.28, dy = (e.clientY - cy) * 0.28;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
  };
  const onLeave = () => { if (btnRef.current) btnRef.current.style.transform = "translate(0,0) scale(1)"; };
  const baseStyle = { transition: "transform 0.2s ease, box-shadow 0.25s ease", display: "inline-flex", alignItems: "center", ...style };

  if (href) return (
    <a ref={btnRef} href={href} target={target} rel={rel} style={baseStyle} className={className}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} onClickCapture={onClickCapture}>{children}</a>
  );
  return (
    <button ref={btnRef} style={baseStyle} className={className}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} onClickCapture={onClickCapture}>{children}</button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════════════════════ */
function CustomCursor() {
  const pos = useRef({ x: -999, y: -999 });
  const ring = useRef(null); const dot = useRef(null); const glow = useRef(null); const label = useRef(null);
  const state = useRef("default");
  const rafId = useRef(null);

  useEffect(() => {
    const sectionColors = {
      hero: "#22d3ee", about: "#22d3ee", skills: "#a78bfa",
      process: "#34d399", experience: "#34d399", projects: "#22d3ee",
      contact: "#22d3ee",
    };

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isProject = el?.closest("[data-cursor='project']");
      const isBtn = el?.closest("[data-cursor='btn']") || el?.closest("button") || el?.closest("a");
      const isLink = el?.closest("[data-cursor='link']");
      const newState = isProject ? "project" : isBtn ? "btn" : isLink ? "link" : "default";

      if (newState !== state.current) {
        state.current = newState;
        const r = ring.current; const d = dot.current; const g = glow.current; const lb = label.current;
        if (!r || !d || !g || !lb) return;
        if (newState === "project") {
          r.style.width = "70px"; r.style.height = "70px"; r.style.borderColor = "rgba(34,211,238,0.8)";
          d.style.transform = "translate(-50%,-50%) scale(0)";
          lb.textContent = "VIEW"; lb.classList.add("vis");
        } else if (newState === "btn") {
          r.style.width = "48px"; r.style.height = "48px"; r.style.borderColor = "rgba(34,211,238,0.9)";
          d.style.transform = "translate(-50%,-50%) scale(0)";
          lb.classList.remove("vis");
        } else {
          r.style.width = "32px"; r.style.height = "32px"; r.style.borderColor = "rgba(34,211,238,0.6)";
          d.style.transform = "translate(-50%,-50%) scale(1)";
          lb.classList.remove("vis");
        }
      }
    };

    const tick = () => {
      const r = ring.current; const d = dot.current; const g = glow.current; const lb = label.current;
      if (r && d && g) {
        const { x, y } = pos.current;
        r.style.left = x + "px"; r.style.top = y + "px";
        d.style.left = x + "px"; d.style.top = y + "px";
        g.style.left = x + "px"; g.style.top = y + "px";
        if (lb) { lb.style.left = (x + 24) + "px"; lb.style.top = (y - 16) + "px"; }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafId.current); };
  }, []);

  return (
    <>
      <div id="cur-glow" ref={glow} />
      <div id="cur-ring" ref={ring} />
      <div id="cur-dot" ref={dot} />
      <div id="cur-label" ref={label} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EASTER EGG
═══════════════════════════════════════════════════════════════════════════ */
function EasterEgg({ onClose }) {
  const [exiting, setExiting] = useState(false);
  const close = () => { setExiting(true); setTimeout(onClose, 350); };
  useEffect(() => { const t = setTimeout(close, 8000); return () => clearTimeout(t); }, []);

  const chars = "RAJENDRA KARKI".split("");
  return (
    <div className="konami-ovl" onClick={close}>
      <div className="konami-bg" />
      <div className={`konami-box${exiting ? " konami-exit" : ""}`}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎮</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {chars.map((c, i) => (
            <span key={i} style={{
              fontFamily: "var(--fp)", fontSize: "1.4rem", fontWeight: 800,
              background: `linear-gradient(135deg, var(--cyan), var(--violet))`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: `fadeUp 0.4s ${i * 0.05}s ease both`,
              display: "inline-block"
            }}>{c === " " ? "\u00A0" : c}</span>
          ))}
        </div>
        <p style={{ fontFamily: "var(--fm)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--emerald)", marginBottom: "0.5rem" }}>
          ↑↑↓↓←→←→ B A — You found the easter egg!
        </p>
        <p style={{ fontFamily: "var(--fd)", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, marginTop: "1rem" }}>
          If you're detail-oriented enough to type the Konami code, we'd probably work well together. 🤝
        </p>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {["MERN", "Laravel", "Vue", "Builder", "Problem Solver"].map(t => (
            <span key={t} className="pl" style={{ color: "var(--cyan)", borderColor: "rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.06)" }}>{t}</span>
          ))}
        </div>
        <p style={{ fontFamily: "var(--fm)", fontSize: "0.52rem", color: "var(--dim)", marginTop: "1.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Click anywhere to close
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const prog = useScrollProg();
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const [modal, setModal] = useState(null);
  const navIds = ["about", "skills", "process", "experience", "projects", "contact"];
  const active = useActiveSection(["hero", ...navIds]);
  const [konamiActive, konamiClose] = useKonami();
  useReveal();

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => { document.body.style.overflow = (modal || konamiActive) ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [modal, konamiActive]);
  useEffect(() => { if (!modal) return; const fn = e => { if (e.key === "Escape") setModal(null); }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); }, [modal]);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <ThreeBackground />
      <CustomCursor />
      <div id="pgb" style={{ width: `${prog * 100}%` }} />
      <div className="nz" /><div className="gl" /><div className="sc" />

      <nav className={scrolled ? "sc2" : ""}>
        <a href="#hero" className="nlogo">
          <div className="lmark">RK</div>
          <span>rajendra<span style={{ color: "var(--cyan)" }}>.</span>dev</span>
        </a>
        <ul className="nlinks">
          {navIds.map(id => <li key={id}><a href={`#${id}`} className={active === id ? "act" : ""}>{id}</a></li>)}
          <li>
            <MagBtn href="mailto:Karkirajenda22@gmail.com" className="hbtn hnb" style={{}}>Hire Me</MagBtn>
          </li>
        </ul>
        <button className="ham" onClick={() => setMob(o => !o)}>
          {[0, 1, 2].map(i => <span key={i} className={`hl${mob ? " op" : ""}`} />)}
        </button>
      </nav>

      {mob && (
        <div className="mmenu" onClick={() => setMob(false)}>
          {navIds.map(id => <a key={id} href={`#${id}`}>{id}</a>)}
          <a href="mailto:Karkirajenda22@gmail.com" className="hbtn" style={{ fontSize: "0.8rem" }}>Hire Me</a>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 2 }}>
        <Hero />
        <About />
        <Skills />
        <Process />
        <Xp />
        <Projs onOpen={setModal} />
        <Contact />
        <Foot />
      </div>

      {modal && <Modal p={modal} onClose={() => setModal(null)} />}
      {konamiActive && <EasterEgg onClose={konamiClose} />}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const typed = useTyped(["Full-Stack Developer", "MERN Stack Engineer", "Laravel Developer", "Vue.js Enthusiast", "Problem Solver"]);
  const register = useParallax();
  const orbA = useRef(null); const orbB = useRef(null); const orbC = useRef(null);

  useEffect(() => {
    register(orbA.current, -0.08);
    register(orbB.current, -0.05);
    register(orbC.current, 0.04);
  }, [register]);

  return (
    <section id="hero" className="hwrap">
      <div ref={orbA} className="orb oa" />
      <div ref={orbB} className="orb ob" />
      <div ref={orbC} className="orb oc" />
      <div style={{ position: "absolute", width: 300, height: 300, top: "10%", right: "5%", borderRadius: "50%", border: "1px solid rgba(34,211,238,0.06)", animation: "spinSlow 20s linear infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 180, height: 180, bottom: "15%", right: "18%", borderRadius: "50%", border: "1px solid rgba(167,139,250,0.07)", animation: "spinSlow 14s linear infinite reverse", pointerEvents: "none" }} />

      <div className="hgrid" style={{ maxWidth: 1120, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "3rem", alignItems: "center" }}>
        {/* LEFT */}
        <div className="htxt">
          <div className="ha1" style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "100px", padding: "0.32rem 0.9rem 0.32rem 0.55rem", marginBottom: "1.8rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--emerald)", boxShadow: "0 0 8px var(--emerald)", display: "block", animation: "pulsate 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--emerald)" }}>Available for opportunities</span>
          </div>

          <div className="ha2">
            <h1 className="hname" style={{ fontFamily: "var(--fp)", fontSize: "clamp(3.5rem,8vw,6.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.95, color: "var(--txt)", display: "block" }}>Rajendra</h1>
            <h1 className="hname gt" style={{ fontFamily: "var(--fp)", fontSize: "clamp(3.5rem,8vw,6.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.95, display: "block", marginBottom: "1.2rem" }}>Karki</h1>
          </div>

          <div className="ha3" style={{ display: "flex", alignItems: "center", height: "2rem", marginBottom: "1.3rem" }}>
            <span style={{ fontFamily: "var(--fm)", fontSize: "clamp(0.78rem,2vw,0.95rem)", color: "var(--muted)" }}>
              {typed}<span className="typed-c">_</span>
            </span>
          </div>

          <p className="ha4" style={{ maxWidth: 470, fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "1.5rem" }}>
            Building production-ready web apps with clean UI and reliable backend workflows. Based in <span style={{ color: "var(--cyan)", fontWeight: 600 }}>Kathmandu, Nepal</span>.
          </p>

          <div className="htags ha4" style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "2rem" }}>
            {["MERN Stack", "Laravel", "Vue.js 3", "REST APIs"].map(t => (
              <span key={t} className="pl" style={{ color: "var(--dim)", borderColor: "var(--bdr)", background: "rgba(255,255,255,0.02)" }}>{t}</span>
            ))}
          </div>

          <div className="hctas ha5" style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginBottom: "2rem" }}>
            <MagBtn href="#projects" data-cursor="btn" onClickCapture={addRipple} className="rbtn hcbtn"
              style={{ background: "linear-gradient(135deg,var(--cyan),#0ea5e9)", color: "#000", fontFamily: "var(--fm)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, padding: "0.8rem 1.8rem", borderRadius: "9px", textDecoration: "none", boxShadow: "0 0 28px rgba(34,211,238,0.3)", gap: "0.4rem" }}>
              View Projects ↓
            </MagBtn>
            <MagBtn href="mailto:Karkirajenda22@gmail.com" className="hcbtn rbtn" onClickCapture={addRipple}
              style={{ color: "var(--txt)", fontFamily: "var(--fm)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", padding: "0.8rem 1.8rem", borderRadius: "9px", textDecoration: "none", border: "1px solid var(--bdr2)", gap: "0.4rem" }}>
              Say Hello →
            </MagBtn>
          </div>

          <div className="hsoc ha6" style={{ display: "flex", gap: "1.4rem", alignItems: "center" }}>
            {[{ l: "GitHub", h: "https://github.com/karkirajendra" }, { l: "LinkedIn", h: "https://www.linkedin.com/in/rajendra-karki-316408279" }, { l: "Email", h: "mailto:Karkirajenda22@gmail.com" }].map(s => (
              <a key={s.l} href={s.h} target={s.h.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer"
                style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dim)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "var(--cyan)"} onMouseLeave={e => e.target.style.color = "var(--dim)"}>
                {s.l}
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="hcard haC">
          <div className="cd" style={{ padding: "1.6rem", backdropFilter: "blur(10px)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top right,rgba(34,211,238,0.07),transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.4rem" }}>
                <div style={{ position: "relative", marginBottom: "0.8rem" }}>
                  <div style={{ position: "absolute", inset: -4, borderRadius: "22px", background: "linear-gradient(135deg,var(--cyan),var(--violet))", opacity: 0.28, filter: "blur(8px)", animation: "pulsate 3s ease-in-out infinite" }} />
                  <div style={{ width: 72, height: 72, borderRadius: "18px", background: "linear-gradient(135deg,var(--cyan),#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fp)", fontSize: "1.5rem", fontWeight: 700, color: "#000", position: "relative", boxShadow: "0 0 24px rgba(34,211,238,0.4)" }}>RK</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--txt)", fontSize: "0.95rem" }}>Rajendra Karki</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: "0.56rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.2rem" }}>Full-Stack Developer</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
                {[["4+", "Projects"], ["50+", "APIs"], ["2+", "Years"]].map(([v, l]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "0.7rem 0.3rem", textAlign: "center", border: "1px solid var(--bdr)", transition: "all 0.25s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bdr)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div className="cnum" style={{ fontSize: "1.2rem" }}>{v}</div>
                    <div style={{ fontFamily: "var(--fm)", fontSize: "0.5rem", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.15rem" }}>{l}</div>
                  </div>
                ))}
              </div>
              {[["📍 Location", "Kathmandu, Nepal"], ["🎓 Education", "BCA 7th Sem · TU"]].map(([k, v]) => (
                <div key={k} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 9, padding: "0.65rem 0.9rem", marginBottom: "0.5rem", border: "1px solid var(--bdr)" }}>
                  <div style={{ fontFamily: "var(--fm)", fontSize: "0.54rem", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{k}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--txt)", fontWeight: 500 }}>{v}</div>
                </div>
              ))}
              <div style={{ background: "rgba(52,211,153,0.06)", borderRadius: 9, padding: "0.55rem 0.9rem", border: "1px solid rgba(52,211,153,0.18)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", boxShadow: "0 0 8px var(--emerald)", display: "block", animation: "pulsate 2s infinite", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--fm)", fontSize: "0.58rem", color: "var(--emerald)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Open to work</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", animation: "float 3s ease-in-out infinite" }}>
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--dim)" }}>scroll</span>
        <svg width="1" height="36" viewBox="0 0 1 36"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><line x1="0.5" y1="0" x2="0.5" y2="36" stroke="url(#sg)" strokeWidth="1" /></svg>
      </div>

      {/* Konami hint (tiny) */}
      <div style={{ position: "absolute", bottom: "1.5rem", right: "2rem", fontFamily: "var(--fm)", fontSize: "0.44rem", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>
        try: ↑↑↓↓←→←→ba
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════════════════════════════ */
function About() {
  const ref = useRef(null); const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, []);
  const c1 = useCounter(4, vis), c2 = useCounter(50, vis), c3 = useCounter(7, vis), c4 = useCounter(2, vis);
  const { ref: tRef1, onMove: tm1, onLeave: tl1 } = useTilt(8);
  const { ref: tRef2, onMove: tm2, onLeave: tl2 } = useTilt(8);
  const { ref: tRef3, onMove: tm3, onLeave: tl3 } = useTilt(8);
  const { ref: tRef4, onMove: tm4, onLeave: tl4 } = useTilt(8);
  const tilts = [[tRef1, tm1, tl1], [tRef2, tm2, tl2], [tRef3, tm3, tl3], [tRef4, tm4, tl4]];

  return (
    <section id="about" className="sec" ref={ref}>
      <div className="rv"><p className="eye">who I am</p><h2 className="stl">About Me</h2></div>
      <div className="abgr rv" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
        <div>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "1.1rem" }}>I'm a <strong style={{ color: "var(--txt)", fontWeight: 700 }}>motivated BCA student</strong> in my 7th semester at Tribhuvan University — with a passion for building web apps that people actually use.</p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "1.1rem" }}>Deep experience with <strong style={{ color: "var(--cyan)" }}>MERN stack</strong>, <strong style={{ color: "var(--emerald)" }}>Laravel</strong>, and <strong style={{ color: "var(--violet)" }}>Vue.js</strong> — shipped multiple production-ready projects from rental platforms to booking systems.</p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "1.5rem" }}>I thrive at the intersection of clean code and intuitive design, constantly leveling up my craft.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["★ MERN Stack Training — N9-Solution", "★ Git & GitHub Basics"].map(c => (
              <span key={c} className="pl" style={{ color: "var(--gold)", borderColor: "rgba(251,191,36,0.25)", background: "rgba(251,191,36,0.06)" }}>{c}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="abst" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[[c1 + "+", "Projects Shipped", "Full-stack production apps."], [c2 + "+", "API Endpoints", "Designed & documented."], [c3 + "th", "Semester", "Tribhuvan University, BCA."], [c4 + "+", "Years Coding", "Building and shipping daily."]].map(([v, l, d], i) => {
              const [tr, tm, tl] = tilts[i];
              return (
                <div key={l} ref={tr} className="cd tilt-card" style={{ padding: "1.2rem 1.1rem" }} onMouseMove={tm} onMouseLeave={tl}>
                  <div className="tilt-shine" />
                  <div className="cnum">{v}</div>
                  <div style={{ fontFamily: "var(--fd)", fontWeight: 600, color: "var(--txt)", fontSize: "0.85rem", marginTop: "0.35rem" }}>{l}</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", color: "var(--dim)", marginTop: "0.2rem", lineHeight: 1.5 }}>{d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKILLS
═══════════════════════════════════════════════════════════════════════════ */
function Skills() {
  const all = skillGroups.flatMap(g => g.items.map(it => ({ it, col: g.col })));
  const h = Math.ceil(all.length / 2); const r1 = all.slice(0, h); const r2 = all.slice(h);
  return (
    <section id="skills" className="sec">
      <div className="rv"><p className="eye">what I know</p><h2 className="stl">Tech Stack</h2></div>
      <div className="rv" style={{ marginBottom: "2.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", overflow: "hidden" }}>
        <div className="mqw"><div className="mqt">{[...r1, ...r1].map((s, i) => <span key={i} className="pl" style={{ color: s.col, background: `${s.col}0d`, borderColor: `${s.col}35`, whiteSpace: "nowrap" }}>{s.it}</span>)}</div></div>
        <div className="mqw"><div className="mqt rv">{[...r2, ...r2].map((s, i) => <span key={i} className="pl" style={{ color: s.col, background: `${s.col}0d`, borderColor: `${s.col}35`, whiteSpace: "nowrap" }}>{s.it}</span>)}</div></div>
      </div>
      <div className="skgr" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1rem" }}>
        {skillGroups.map(({ label, col, bg, bd, items }, gi) => {
          const { ref, onMove, onLeave } = useTilt(6);
          return (
            <div key={label} ref={ref} className={`cd tilt-card rv d${(gi % 4) + 1}`} style={{ padding: "1.4rem" }} onMouseMove={onMove} onMouseLeave={onLeave}>
              <div className="tilt-shine" />
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: col, boxShadow: `0 0 8px ${col}`, animation: "pulsate 2.5s ease-in-out infinite" }} />
                <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.2em", color: col }}>{label}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {items.map(sk => <span key={sk} className="pl" style={{ color: col, background: bg, borderColor: bd }}>{sk}</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROCESS — "HOW I THINK" STORYTELLING SECTION
═══════════════════════════════════════════════════════════════════════════ */
function Process() {
  return (
    <section id="process" className="sec">
      <div className="rv"><p className="eye">how I work</p><h2 className="stl">How I Think</h2></div>
      <p className="rv" style={{ maxWidth: 560, fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "3.5rem" }}>
        Every project follows a deliberate mental model — from raw problem to shipped product. Here's the process behind the code.
      </p>

      <div className="proc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", position: "relative" }}>
        <div className="proc-line" />
        {processSteps.map((step, i) => {
          const { ref, onMove, onLeave } = useTilt(5);
          return (
            <div key={step.num} ref={ref} className={`cd tilt-card rv ${i % 2 === 0 ? "fl" : "fr"} d${i + 1}`}
              style={{ padding: "1.8rem", overflow: "hidden" }} onMouseMove={onMove} onMouseLeave={onLeave}>
              <div className="tilt-shine" />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${step.col},transparent)` }} />
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "35%", background: `radial-gradient(circle at right,${step.col}06,transparent)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.1rem" }}>
                <div className="proc-node" style={{ background: `${step.col}14`, border: `1.5px solid ${step.col}40`, color: step.col, boxShadow: `0 0 16px ${step.col}20` }}>
                  <span style={{ fontSize: "1.1rem" }}>{step.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.52rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dim)" }}>{step.num}</span>
                    <span className="pl" style={{ color: step.col, borderColor: `${step.col}35`, background: `${step.col}0d`, fontSize: "0.5rem" }}>{step.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.15rem", fontWeight: 700, color: "var(--txt)", marginBottom: "0.6rem", letterSpacing: "-0.01em" }}>{step.title}</h3>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--muted)" }}>{step.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project story callout */}
      <div className="rv" style={{ marginTop: "2.5rem", background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.14)", borderRadius: 16, padding: "1.8rem 2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,211,238,0.1)", border: "1.5px solid rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--cyan)", fontSize: "1rem" }}>💡</div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <p style={{ fontFamily: "var(--fm)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--cyan)", marginBottom: "0.45rem" }}>Real example — RoomSathi</p>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)" }}>
            <strong style={{ color: "var(--txt)" }}>Problem:</strong> Finding rooms in Kathmandu is fragmented and low-trust.{" "}
            <strong style={{ color: "var(--txt)" }}>Approach:</strong> Designed 3-role auth first, then built search → booking → admin analytics as independent modules.{" "}
            <strong style={{ color: "var(--txt)" }}>Result:</strong> 50+ API endpoints, shipped in 1 semester.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPERIENCE
═══════════════════════════════════════════════════════════════════════════ */
function Xp() {
  return (
    <section id="experience" className="sec">
      <div className="rv"><p className="eye">my journey</p><h2 className="stl">Experience</h2></div>
      <div className="expg rv" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {experience.map((item, i) => {
            const { ref, onMove, onLeave } = useTilt(5);
            return (
              <div key={item.role} ref={ref} className={`cd tilt-card rv ${i % 2 === 0 ? "fl" : "fr"}`} style={{ padding: "1.6rem", overflow: "hidden" }} onMouseMove={onMove} onMouseLeave={onLeave}>
                <div className="tilt-shine" />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${item.col},transparent)`, borderRadius: "2px 2px 0 0" }} />
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "30%", background: `radial-gradient(circle at top right,${item.col}08,transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem", marginBottom: "1rem" }}>
                  <div>
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dim)" }}>{item.when}</span>
                    <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.25rem", fontWeight: 700, color: "var(--txt)", marginTop: "0.25rem" }}>{item.role}</h3>
                    <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.1rem" }}>{item.org}</p>
                  </div>
                  <span className="pl" style={{ color: item.col, borderColor: `${item.col}35`, background: `${item.col}0d`, alignSelf: "flex-start", fontSize: "0.55rem" }}>{item.stack}</span>
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {item.points.map(pt => (
                    <li key={pt} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6 }}>
                      <span className="td" style={{ background: item.col, boxShadow: `0 0 8px ${item.col}` }} />{pt}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="expa cd rv fr" style={{ padding: "1.6rem", alignSelf: "start" }}>
          <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--cyan)" }}>Focus Areas</span>
          <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.3rem", fontWeight: 700, color: "var(--txt)", margin: "0.5rem 0 1.1rem" }}>What I care about</h3>
          {[{ i: "◈", l: "Product UI", d: "Accessible, responsive, polished interfaces." }, { i: "◫", l: "APIs", d: "Pragmatic REST with auth & validation." }, { i: "⟳", l: "Delivery", d: "Fast iteration: Vite + Git + clean commits." }].map(f => (
            <div key={f.l} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "0.9rem", marginBottom: "0.6rem", border: "1px solid var(--bdr)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)"; e.currentTarget.style.background = "rgba(34,211,238,0.04)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bdr)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.transform = "translateX(0)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--cyan)", fontSize: "0.85rem", transition: "transform 0.3s" }}
                  onMouseEnter={e => e.target.style.transform = "rotate(15deg) scale(1.2)"}
                  onMouseLeave={e => e.target.style.transform = "rotate(0) scale(1)"}>{f.i}</span>
                <span style={{ fontWeight: 600, color: "var(--txt)", fontSize: "0.88rem" }}>{f.l}</span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.8rem", lineHeight: 1.6 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════════════════════════════════ */
function Projs({ onOpen }) {
  const feat = projects[0]; const rest = projects.slice(1);
  return (
    <section id="projects" className="sec">
      <div className="rv"><p className="eye">what I built</p><h2 className="stl">Projects</h2></div>
      <div className="rv" style={{ marginBottom: "1.5rem" }}><FeatCard p={feat} onOpen={() => onOpen(feat)} /></div>
      <div className="pjgr rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.1rem" }}>
        {rest.map((p, i) => <SmCard key={p.num} p={p} onOpen={() => onOpen(p)} i={i} />)}
      </div>
    </section>
  );
}

function FeatCard({ p, onOpen }) {
  const [hov, setHov] = useState(false);
  const [techAnim, setTechAnim] = useState(false);

  return (
    <div className="cd" data-cursor="project"
      onMouseEnter={() => { setHov(true); setTimeout(() => setTechAnim(true), 100); }}
      onMouseLeave={() => { setHov(false); setTechAnim(false); }}
      style={{ boxShadow: hov ? `0 24px 60px rgba(34,211,238,0.12), 0 0 0 1px rgba(34,211,238,0.12)` : "none", transition: "all 0.35s" }}>
      <div style={{ height: 3, background: `linear-gradient(90deg,${p.ca},${p.cb})`, borderRadius: "2px 2px 0 0" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at top right,${p.ca}08,transparent 55%)`, pointerEvents: "none" }} />
      <div className="fgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <div className="fdesc" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.9rem" }}>
            <span style={{ fontFamily: "var(--fm)", fontSize: "0.56rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--dim)" }}>Featured · {p.num}</span>
            <span className="pl" style={{ color: p.ca, borderColor: `${p.ca}35`, background: `${p.ca}0d`, fontSize: "0.52rem" }}>MERN Stack</span>
          </div>
          <h3 style={{ fontFamily: "var(--fp)", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "var(--txt)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{p.title}</h3>
          <p style={{ fontFamily: "var(--fm)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: p.ca, margin: "0.4rem 0 1rem" }}>{p.subtitle}</p>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.72, color: "var(--muted)", marginBottom: "1.2rem" }}>{p.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.38rem", marginBottom: "1.4rem" }}>
            {p.tech.map((t, ti) => (
              <span key={t} className="pl"
                style={{ color: "var(--dim)", borderColor: "var(--bdr)", background: "rgba(255,255,255,0.025)", fontSize: "0.57rem", transition: `all 0.2s ${ti * 60}ms`, transform: techAnim ? "translateY(0)" : "translateY(4px)", opacity: techAnim ? 1 : 0.5 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <MagBtn onClick={onOpen} className="rbtn" onClickCapture={addRipple} data-cursor="btn"
              style={{ background: `linear-gradient(135deg,${p.ca},${p.cb})`, color: "#000", fontFamily: "var(--fm)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, padding: "0.6rem 1.3rem", borderRadius: "8px", border: "none", boxShadow: `0 0 20px ${p.ca}40` }}>
              Case Study →
            </MagBtn>
            <a href={p.github} target="_blank" rel="noreferrer"
              style={{ fontFamily: "var(--fm)", fontSize: "0.62rem", color: "var(--dim)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em", transition: "color 0.2s", display: "inline-flex", alignItems: "center" }}
              onMouseEnter={e => e.target.style.color = "var(--txt)"} onMouseLeave={e => e.target.style.color = "var(--dim)"}>
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="fprv" style={{ borderLeft: "1px solid var(--bdr)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Animated tech preview */}
          <div style={{ borderRadius: 12, overflow: "hidden", background: "var(--surf2)", border: "1px solid var(--bdr)", height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${p.ca}12,${p.cb}10)` }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "18px 18px" }} />
            {/* Fake code lines that animate in on hover */}
            <div style={{ position: "absolute", inset: 0, padding: "1.2rem", fontFamily: "var(--fm)", fontSize: "0.58rem", lineHeight: 1.7, opacity: hov ? 1 : 0, transition: "opacity 0.4s ease 0.1s" }}>
              {[
                { col: "#fb7185", text: "const auth = await jwt.verify(" },
                { col: "#22d3ee", text: "  token, process.env.SECRET" },
                { col: "#a78bfa", text: "); // 3 roles ✓" },
                { col: "#34d399", text: "await cloudinary.upload(img);" },
                { col: "#fbbf24", text: "// 50+ endpoints deployed" },
              ].map((ln, li) => (
                <div key={li} style={{ color: ln.col, opacity: hov ? 1 : 0, transform: hov ? "translateX(0)" : "translateX(-8px)", transition: `all 0.3s ${li * 70}ms ease` }}>{ln.text}</div>
              ))}
            </div>
            <div style={{ position: "relative", textAlign: "center", opacity: hov ? 0 : 1, transition: "opacity 0.3s ease" }}>
              <div style={{ fontFamily: "var(--fp)", fontSize: "2.4rem", fontWeight: 800, color: `${p.ca}28`, letterSpacing: "-0.04em" }}>{p.title}</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "0.2rem" }}>Preview</div>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 11, padding: "1.1rem", border: "1px solid var(--bdr)" }}>
            <p style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--dim)", marginBottom: "0.7rem" }}>Highlights</p>
            {(p.story?.highlights ?? []).slice(0, 3).map((h, hi) => (
              <div key={h} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", marginBottom: "0.45rem", transform: hov ? "translateX(0)" : "translateX(-4px)", opacity: hov ? 1 : 0.6, transition: `all 0.3s ${hi * 80}ms ease` }}>
                <span className="td" style={{ marginTop: 3, flexShrink: 0 }} /><span style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SmCard({ p, onOpen, i }) {
  const [hov, setHov] = useState(false);
  const { ref, onMove, onLeave: tLeave } = useTilt(8);

  const handleLeave = () => { setHov(false); tLeave(); };

  return (
    <div ref={ref} className={`cd tilt-card rv d${i + 1}`} data-cursor="project"
      onMouseEnter={() => setHov(true)} onMouseLeave={handleLeave} onMouseMove={onMove}
      style={{ display: "flex", flexDirection: "column", boxShadow: hov ? `0 14px 40px ${p.ca}22` : "none", transition: "box-shadow 0.3s" }}>
      <div className="tilt-shine" />
      <div style={{ height: 2, background: `linear-gradient(90deg,${p.ca},${p.cb})`, borderRadius: "2px 2px 0 0" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at top left,${p.ca}06,transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ padding: "1.4rem", display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.9rem" }}>
          <div>
            <span style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dim)" }}>{p.num}</span>
            <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.3rem", fontWeight: 700, color: "var(--txt)", marginTop: "0.15rem" }}>{p.title}</h3>
            <p style={{ fontFamily: "var(--fm)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", color: p.ca, marginTop: "0.12rem" }}>{p.subtitle}</p>
          </div>
          <a href={p.github} target="_blank" rel="noreferrer"
            style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid var(--bdr)", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dim)", textDecoration: "none", fontSize: "0.72rem", flexShrink: 0, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--bdr2)"; e.currentTarget.style.color = "var(--txt)"; e.currentTarget.style.transform = "rotate(-10deg) scale(1.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bdr)"; e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.transform = "rotate(0) scale(1)"; }}>↗</a>
        </div>
        <p style={{ fontSize: "0.83rem", lineHeight: 1.65, color: "var(--muted)", flex: 1 }}>{p.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", margin: "0.9rem 0" }}>
          {p.tech.map(t => <span key={t} className="pl" style={{ color: "var(--dim)", borderColor: "var(--bdr)", background: "rgba(255,255,255,0.02)", fontSize: "0.55rem" }}>{t}</span>)}
        </div>
        <MagBtn onClick={onOpen}
          style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: `1px solid ${hov ? `${p.ca}50` : "var(--bdr)"}`, borderRadius: 8, padding: "0.58rem", fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.12em", color: hov ? p.ca : "var(--muted)", transition: "all 0.2s", justifyContent: "center" }}>
          View Case Study →
        </MagBtn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════════════════════ */
function Modal({ p, onClose }) {
  return (
    <div className="ovl" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mdl">
        <div style={{ height: 3, background: `linear-gradient(90deg,${p.ca},${p.cb})`, margin: "-2rem -2rem 1.4rem", borderRadius: "2px 2px 0 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem" }}>
          <div>
            <p style={{ fontFamily: "var(--fm)", fontSize: "0.56rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--dim)" }}>Case Study</p>
            <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.7rem", fontWeight: 800, color: "var(--txt)", marginTop: "0.25rem", letterSpacing: "-0.02em" }}>{p.title}</h3>
            <p style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: p.ca, marginTop: "0.15rem" }}>{p.subtitle}</p>
          </div>
          <MagBtn onClick={onClose} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--bdr)", borderRadius: 7, padding: "0.38rem 0.75rem", color: "var(--muted)", fontFamily: "var(--fm)", fontSize: "0.6rem" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--bdr2)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--bdr)"}>✕ close</MagBtn>
        </div>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.72, color: "var(--muted)", marginBottom: "1.3rem" }}>{p.desc}</p>
        <div className="mdig" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.2rem" }}>
          {[["Problem", p.story?.problem], ["Solution", p.story?.solution]].map(([l, c]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 11, padding: "1rem", border: "1px solid var(--bdr)" }}>
              <p style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--dim)", marginBottom: "0.5rem" }}>{l}</p>
              <p style={{ fontSize: "0.83rem", lineHeight: 1.65, color: "var(--muted)" }}>{c}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 11, padding: "1.1rem", border: "1px solid var(--bdr)", marginBottom: "1.2rem" }}>
          <p style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--dim)", marginBottom: "0.7rem" }}>Highlights</p>
          <div className="mdhg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {(p.story?.highlights ?? []).map(h => (
              <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem" }}>
                <span className="td" style={{ marginTop: 3, flexShrink: 0 }} /><span style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.38rem", marginBottom: "1.3rem" }}>
          {p.tech.map(t => <span key={t} className="pl" style={{ color: p.ca, borderColor: `${p.ca}35`, background: `${p.ca}0d`, fontSize: "0.58rem" }}>{t}</span>)}
        </div>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", alignItems: "center" }}>
          <MagBtn href={p.github} target="_blank" rel="noreferrer" className="rbtn" onClickCapture={addRipple}
            style={{ background: `linear-gradient(135deg,${p.ca},${p.cb})`, color: "#000", fontFamily: "var(--fm)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, padding: "0.65rem 1.3rem", borderRadius: "8px", textDecoration: "none", boxShadow: `0 0 18px ${p.ca}40` }}>
            View on GitHub ↗
          </MagBtn>
          <span style={{ fontFamily: "var(--fm)", fontSize: "0.56rem", color: "var(--dim)" }}>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════════════════════ */
function Contact() {
  return (
    <section id="contact" className="sec" style={{ position: "relative", textAlign: "center" }}>
      <div className="cglow" />
      <div className="rv"><p className="eye" style={{ justifyContent: "center" }}>get in touch</p><h2 className="stl">Let's Connect</h2></div>
      <p className="rv" style={{ maxWidth: 520, margin: "-1.5rem auto 2.5rem", fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)" }}>
        Actively looking for internship and entry-level developer opportunities. Have a project or role? Let's talk.
      </p>
      <div className="ctgr rv" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.9rem", maxWidth: 600, margin: "0 auto 2.5rem" }}>
        {[{ l: "Email", v: "Karkirajenda22@gmail.com", h: "mailto:Karkirajenda22@gmail.com" }, { l: "GitHub", v: "karkirajendra", h: "https://github.com/karkirajendra" }, { l: "LinkedIn", v: "rajendra-karki", h: "https://www.linkedin.com/in/rajendra-karki-316408279" }].map(c => {
          const { ref, onMove, onLeave } = useTilt(7);
          return (
            <a key={c.l} ref={ref} href={c.h} target={c.h.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer"
              className="cd tilt-card" style={{ padding: "1.1rem", textDecoration: "none", display: "block" }} onMouseMove={onMove} onMouseLeave={onLeave}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)"; e.currentTarget.style.background = "rgba(34,211,238,0.04)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--bdr)"; e.currentTarget.style.background = "var(--surf)"; }}>
              <div className="tilt-shine" />
              <p style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--dim)", marginBottom: "0.45rem" }}>{c.l}</p>
              <p style={{ fontSize: "0.78rem", color: "var(--txt)", fontWeight: 500, wordBreak: "break-all" }}>{c.v}</p>
            </a>
          );
        })}
      </div>
      <MagBtn href="mailto:Karkirajenda22@gmail.com" className="rbtn" onClickCapture={addRipple}
        style={{ background: "linear-gradient(135deg,var(--cyan),#0ea5e9)", color: "#000", fontFamily: "var(--fm)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, padding: "0.9rem 2.2rem", borderRadius: "10px", textDecoration: "none", boxShadow: "0 0 36px rgba(34,211,238,0.35)", gap: "0.5rem" }}>
        ✉ Say Hello
      </MagBtn>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════════════════ */
function Foot() {
  return (
    <footer style={{ borderTop: "1px solid var(--bdr)", padding: "1.8rem clamp(1rem,4vw,3rem)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", color: "var(--dim)" }}>Designed & Built by <span style={{ color: "var(--cyan)" }}>Rajendra Karki</span></span>
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", color: "var(--dim)" }}>Kathmandu, Nepal · {new Date().getFullYear()}</span>
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.52rem", color: "var(--dim)", opacity: 0.5 }}>↑↑↓↓←→←→ba 🎮</span>
      </div>
    </footer>
  );
}