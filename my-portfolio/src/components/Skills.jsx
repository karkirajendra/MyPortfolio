import { skillItems } from "../utils/portfolioHelpers";
import { useTilt } from "../hooks/useTilt";

function SkillCard({ label, col, bg, bd, items, gi }) {
  const { ref, onMove, onLeave } = useTilt(6);
  const list = skillItems({ items });
  return (
    <div key={label} ref={ref} className={`cd tilt-card rv d${(gi % 4) + 1}`} style={{ padding: "1.4rem" }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="tilt-shine" />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: col, boxShadow: `0 0 8px ${col}`, animation: "pulsate 2.5s ease-in-out infinite" }} />
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.2em", color: col }}>{label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {list.map((sk) => (
          <div key={sk.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.28rem" }}>
              <span className="pl" style={{ color: col, background: bg, borderColor: bd }}>{sk.name}</span>
              <span style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", color: "var(--dim)" }}>{sk.level}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ width: `${Math.max(0, Math.min(100, sk.level || 0))}%`, height: "100%", background: col, boxShadow: `0 0 10px ${col}` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills({ groups }) {
  const skillGroups = groups?.length ? groups : [];
  const all = skillGroups.flatMap((g) => skillItems(g).map((it) => ({ it: it.name, col: g.col })));
  const h = Math.ceil(all.length / 2) || 1;
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
