import { useRef, useState, useEffect } from "react";
import { useCounter } from "../hooks/useCounter";
import { useTilt } from "../hooks/useTilt";
import bundledPortrait from "../assets/rajendra-web.jpg";
import { mediaUrl } from "../utils/portfolioHelpers";

function StatCard({ n, suffix, label, desc, vis, tilt }) {
  const [tr, tm, tl] = tilt;
  const c = useCounter(Number(n) || 0, vis);
  return (
    <div ref={tr} className="cd tilt-card" style={{ padding: "1.2rem 1.1rem" }} onMouseMove={tm} onMouseLeave={tl}>
      <div className="tilt-shine" />
      <div className="cnum">{c}{suffix}</div>
      <div style={{ fontFamily: "var(--fd)", fontWeight: 600, color: "var(--txt)", fontSize: "0.85rem", marginTop: "0.35rem" }}>{label}</div>
      <div style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", color: "var(--dim)", marginTop: "0.2rem", lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

export default function About({ site, photos }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const portrait = mediaUrl(site.aboutPhotoUrl || site.portraitUrl) || bundledPortrait;
  const fullName = `${site.firstName} ${site.lastName}`.trim();
  const gallery = (photos || []).filter((p) => p.slot === "gallery" || !p.slot);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const { ref: tRef1, onMove: tm1, onLeave: tl1 } = useTilt(8);
  const { ref: tRef2, onMove: tm2, onLeave: tl2 } = useTilt(8);
  const { ref: tRef3, onMove: tm3, onLeave: tl3 } = useTilt(8);
  const { ref: tRef4, onMove: tm4, onLeave: tl4 } = useTilt(8);
  const tilts = [[tRef1, tm1, tl1], [tRef2, tm2, tl2], [tRef3, tm3, tl3], [tRef4, tm4, tl4]];

  return (
    <section id="about" className="sec" ref={ref}>
      <div className="rv"><p className="eye">who I am</p><h2 className="stl">About Me</h2></div>
      <div className="abgr rv" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "3rem", alignItems: "start" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -4, borderRadius: "22px", background: "linear-gradient(135deg,var(--cyan),var(--violet))", opacity: 0.25, filter: "blur(12px)" }} />
          <img
            src={portrait}
            alt={fullName}
            width={400}
            height={500}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 380,
              aspectRatio: "4 / 5",
              objectFit: "cover",
              objectPosition: "center top",
              borderRadius: "18px",
              border: "1px solid var(--bdr2)",
              display: "block",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            }}
          />
          {gallery.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.8rem", maxWidth: 380 }}>
              {gallery.map((p) => (
                <img key={p.id} src={mediaUrl(p.url)} alt={p.alt || ""} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12, border: "1px solid var(--bdr)" }} />
              ))}
            </div>
          )}
        </div>
        <div>
          {(site.bio || []).map((para, i) => (
            <p key={i} style={{ fontSize: i === 0 ? "1.05rem" : "0.95rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "1.1rem" }}>{para}</p>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {(site.certs || []).map((c) => (
              <span key={c} className="pl" style={{ color: "var(--gold)", borderColor: "rgba(251,191,36,0.25)", background: "rgba(251,191,36,0.06)" }}>{c}</span>
            ))}
          </div>
          <div className="abst" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {(site.stats || []).map((st, i) => (
              <StatCard key={st.label} {...st} vis={vis} tilt={tilts[i] || tilts[0]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
