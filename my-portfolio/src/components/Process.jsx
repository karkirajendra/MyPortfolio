import { processSteps } from "../data/process";
import { useTilt } from "../hooks/useTilt";

function ProcessStep({ step, i }) {
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
}

export default function Process() {
  return (
    <section id="process" className="sec">
      <div className="rv"><p className="eye">how I work</p><h2 className="stl">How I Think</h2></div>
      <p className="rv" style={{ maxWidth: 560, fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "3.5rem" }}>
        Every project follows a deliberate mental model — from raw problem to shipped product. Here's the process behind the code.
      </p>

      <div className="proc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", position: "relative" }}>
        <div className="proc-line" />
        {processSteps.map((step, i) => (
          <ProcessStep key={step.num} step={step} i={i} />
        ))}
      </div>

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
