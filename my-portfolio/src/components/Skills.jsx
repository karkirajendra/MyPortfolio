import { skillGroups } from "../data/skills";
import { useTilt } from "../hooks/useTilt";

function SkillCard({ label, col, bg, bd, items, gi }) {
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
}

export default function Skills() {
  const all = skillGroups.flatMap(g => g.items.map(it => ({ it, col: g.col })));
  const h = Math.ceil(all.length / 2);
  const r1 = all.slice(0, h);
  const r2 = all.slice(h);

  return (
    <section id="skills" className="sec">
      <div className="rv"><p className="eye">what I know</p><h2 className="stl">Tech Stack</h2></div>
      <div className="rv" style={{ marginBottom: "2.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", overflow: "hidden" }}>
        <div className="mqw"><div className="mqt">{[...r1, ...r1].map((s, i) => <span key={i} className="pl" style={{ color: s.col, background: `${s.col}0d`, borderColor: `${s.col}35`, whiteSpace: "nowrap" }}>{s.it}</span>)}</div></div>
        <div className="mqw"><div className="mqt rv">{[...r2, ...r2].map((s, i) => <span key={i} className="pl" style={{ color: s.col, background: `${s.col}0d`, borderColor: `${s.col}35`, whiteSpace: "nowrap" }}>{s.it}</span>)}</div></div>
      </div>
      <div className="skgr" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1rem" }}>
        {skillGroups.map((group, gi) => (
          <SkillCard key={group.label} {...group} gi={gi} />
        ))}
      </div>
    </section>
  );
}
