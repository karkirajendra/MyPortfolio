import { useState } from "react";

export default function SitePage({ site, onSave }) {
  const [s, setS] = useState({ ...site });
  const [msg, setMsg] = useState("");
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));
  const setList = (k, text) => set(k, text.split("\n").map((x) => x.trim()).filter(Boolean));

  const save = async () => {
    const ok = await onSave(s);
    setMsg(ok ? "Saved" : "Save failed");
  };

  return (
    <section className="adm-block">
      <h1>Site & about</h1>
      <p className="adm-lead">Hero, contact, and identity fields used across the public site.</p>
      <div className="adm-row">
        <label>First name<input value={s.firstName || ""} onChange={(e) => set("firstName", e.target.value)} /></label>
        <label>Last name<input value={s.lastName || ""} onChange={(e) => set("lastName", e.target.value)} /></label>
        <label>Initials<input value={s.initials || ""} onChange={(e) => set("initials", e.target.value)} /></label>
        <label>Brand<input value={s.brand || ""} onChange={(e) => set("brand", e.target.value)} /></label>
        <label>Role<input value={s.role || ""} onChange={(e) => set("role", e.target.value)} /></label>
        <label>Location<input value={s.location || ""} onChange={(e) => set("location", e.target.value)} /></label>
        <label>Education line<input value={s.educationLine || ""} onChange={(e) => set("educationLine", e.target.value)} /></label>
        <label>Email<input type="email" value={s.email || ""} onChange={(e) => set("email", e.target.value)} /></label>
        <label>GitHub URL<input value={s.github || ""} onChange={(e) => set("github", e.target.value)} /></label>
        <label>GitHub label<input value={s.githubLabel || ""} onChange={(e) => set("githubLabel", e.target.value)} /></label>
        <label>LinkedIn URL<input value={s.linkedin || ""} onChange={(e) => set("linkedin", e.target.value)} /></label>
        <label>LinkedIn label<input value={s.linkedinLabel || ""} onChange={(e) => set("linkedinLabel", e.target.value)} /></label>
      </div>
      <label>
        Available
        <select value={s.available ? "yes" : "no"} onChange={(e) => set("available", e.target.value === "yes")}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </label>
      <label>Availability text<input value={s.availableText || ""} onChange={(e) => set("availableText", e.target.value)} /></label>
      <label>Open to work text<input value={s.openToWorkText || ""} onChange={(e) => set("openToWorkText", e.target.value)} /></label>
      <label>Hero tagline (before location)<textarea rows={3} value={s.tagline || ""} onChange={(e) => set("tagline", e.target.value)} /></label>
      <label>Typed roles (one per line)<textarea rows={5} value={(s.typedRoles || []).join("\n")} onChange={(e) => setList("typedRoles", e.target.value)} /></label>
      <label>Hero tags (one per line)<textarea rows={3} value={(s.tags || []).join("\n")} onChange={(e) => setList("tags", e.target.value)} /></label>
      <label>About paragraphs (one per line)<textarea rows={6} value={(s.bio || []).join("\n")} onChange={(e) => setList("bio", e.target.value)} /></label>
      <label>Cert chips (one per line)<textarea rows={3} value={(s.certs || []).join("\n")} onChange={(e) => setList("certs", e.target.value)} /></label>
      <label>Contact blurb<textarea rows={3} value={s.contactBlurb || ""} onChange={(e) => set("contactBlurb", e.target.value)} /></label>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <h3>About stats</h3>
        <button
          type="button"
          className="adm-btn ghost"
          style={{ fontSize: ".75rem", padding: ".3rem .6rem" }}
          onClick={() => set("stats", [...(s.stats || []), { n: 1, suffix: "+", label: "Metric", desc: "Description" }])}
        >
          + Add stat
        </button>
      </div>
      {(s.stats || []).map((st, i) => (
        <div className="adm-row" key={i} style={{ alignItems: "end" }}>
          <label>Number<input type="number" value={st.n} onChange={(e) => {
            const stats = [...s.stats];
            stats[i] = { ...st, n: Number(e.target.value) };
            set("stats", stats);
          }} /></label>
          <label>Suffix<input value={st.suffix} onChange={(e) => {
            const stats = [...s.stats];
            stats[i] = { ...st, suffix: e.target.value };
            set("stats", stats);
          }} /></label>
          <label>Label<input value={st.label} onChange={(e) => {
            const stats = [...s.stats];
            stats[i] = { ...st, label: e.target.value };
            set("stats", stats);
          }} /></label>
          <label>Description<input value={st.desc} onChange={(e) => {
            const stats = [...s.stats];
            stats[i] = { ...st, desc: e.target.value };
            set("stats", stats);
          }} /></label>
          <button
            type="button"
            className="adm-btn danger"
            style={{ marginBottom: "0.2rem", padding: ".55rem .75rem" }}
            onClick={() => set("stats", s.stats.filter((_, idx) => idx !== i))}
          >
            Remove
          </button>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <h3>Hero card stats</h3>
        <button
          type="button"
          className="adm-btn ghost"
          style={{ fontSize: ".75rem", padding: ".3rem .6rem" }}
          onClick={() => set("cardStats", [...(s.cardStats || []), { value: "1+", label: "Metric" }])}
        >
          + Add card stat
        </button>
      </div>
      {(s.cardStats || []).map((st, i) => (
        <div className="adm-row" key={`card-${i}`} style={{ alignItems: "end" }}>
          <label>Value<input value={st.value} onChange={(e) => {
            const cardStats = [...s.cardStats];
            cardStats[i] = { ...st, value: e.target.value };
            set("cardStats", cardStats);
          }} /></label>
          <label>Label<input value={st.label} onChange={(e) => {
            const cardStats = [...s.cardStats];
            cardStats[i] = { ...st, label: e.target.value };
            set("cardStats", cardStats);
          }} /></label>
          <button
            type="button"
            className="adm-btn danger"
            style={{ marginBottom: "0.2rem", padding: ".55rem .75rem" }}
            onClick={() => set("cardStats", s.cardStats.filter((_, idx) => idx !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      <div className="adm-toolbar">
        <button type="button" className="adm-save" onClick={save}>Save site</button>
        {msg && <span className="adm-ok">{msg}</span>}
      </div>
    </section>
  );
}
