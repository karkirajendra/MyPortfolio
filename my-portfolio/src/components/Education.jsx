import { useTilt } from "../hooks/useTilt";

function EduCard({ item, i }) {
  const { ref, onMove, onLeave } = useTilt(5);
  return (
    <div ref={ref} className={`cd tilt-card rv ${i % 2 === 0 ? "fl" : "fr"}`} style={{ padding: "1.5rem" }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="tilt-shine" />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${item.col || "#22d3ee"},transparent)` }} />
      <span style={{ fontFamily: "var(--fm)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dim)" }}>{item.when}</span>
      <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.2rem", fontWeight: 700, color: "var(--txt)", marginTop: "0.3rem" }}>{item.degree}</h3>
      <p style={{ color: item.col || "var(--cyan)", fontSize: "0.85rem", marginTop: "0.2rem" }}>{item.school}</p>
      {item.detail && <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.65, marginTop: "0.7rem" }}>{item.detail}</p>}
    </div>
  );
}

export default function Education({ items }) {
  if (!items?.length) return null;
  return (
    <section id="education" className="sec">
      <div className="rv"><p className="eye">where I studied</p><h2 className="stl">Education</h2></div>
      <div className="rv" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map((item, i) => <EduCard key={item.id || item.degree} item={item} i={i} />)}
      </div>
    </section>
  );
}
