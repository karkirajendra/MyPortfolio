import { useState } from "react";

const COLOR_PRESETS = [
  { label: "Cyan", hex: "#22d3ee" },
  { label: "Emerald", hex: "#34d399" },
  { label: "Violet", hex: "#a78bfa" },
  { label: "Amber", hex: "#fbbf24" },
  { label: "Rose", hex: "#fb7185" },
];

function newId() {
  return `edu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function EducationPage({ education, onSave }) {
  const [items, setItems] = useState(education || []);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const setItem = (index, patch) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    const col = COLOR_PRESETS[items.length % COLOR_PRESETS.length].hex;
    setItems((prev) => [
      ...prev,
      {
        id: newId(),
        when: "2021 — 2025",
        degree: "Bachelor in Computer Application (BCA)",
        school: "Tribhuvan University",
        detail: "Relevant coursework and academic achievements.",
        col,
      },
    ]);
  };

  const removeItem = (index) => {
    if (window.confirm(`Delete "${items[index]?.degree || "this item"}"?`)) {
      setItems((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setItems(next);
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const ok = await onSave(items);
      setMsg(ok ? "Education saved successfully!" : "Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="adm-header">
        <div>
          <h1>Education</h1>
          <p className="adm-lead">
            Manage your degrees, certifications, schools, and study periods shown in the Education section.
          </p>
        </div>
        <div className="adm-toolbar">
          <button type="button" className="adm-btn ghost" onClick={addItem}>
            + Add education
          </button>
          <button type="button" className="adm-save" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save education"}
          </button>
        </div>
      </div>

      {msg && <p className={msg.includes("success") ? "adm-ok-banner" : "adm-err"}>{msg}</p>}

      {items.length === 0 ? (
        <div className="adm-empty">
          <p>No education entries added yet.</p>
          <button type="button" className="adm-btn ghost" onClick={addItem}>
            Add your first education entry
          </button>
        </div>
      ) : null}

      {items.map((it, i) => (
        <div className="adm-item" key={it.id || i}>
          <div className="adm-item-top">
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: it.col || "#22d3ee",
                  boxShadow: `0 0 8px ${it.col || "#22d3ee"}`,
                }}
              />
              <h3>{it.degree || "Untitled degree"}</h3>
              <span style={{ fontSize: ".8rem", color: "#64748b" }}>— {it.school || "School"}</span>
            </div>
            <div className="adm-item-actions">
              <button
                type="button"
                className="adm-btn-icon"
                title="Move up"
                disabled={i === 0}
                onClick={() => moveItem(i, i - 1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="adm-btn-icon"
                title="Move down"
                disabled={i === items.length - 1}
                onClick={() => moveItem(i, i + 1)}
              >
                ↓
              </button>
              <button type="button" className="adm-btn danger" onClick={() => removeItem(i)}>
                Delete
              </button>
            </div>
          </div>

          <div className="adm-row" style={{ marginTop: ".8rem" }}>
            <label>
              Period / Years
              <input
                value={it.when || ""}
                placeholder="e.g. 2021 — 2025"
                onChange={(e) => setItem(i, { when: e.target.value })}
              />
            </label>
            <label>
              Degree / Title
              <input
                value={it.degree || ""}
                placeholder="e.g. Bachelor in Computer Application"
                onChange={(e) => setItem(i, { degree: e.target.value })}
              />
            </label>
          </div>

          <div className="adm-row">
            <label>
              School / University
              <input
                value={it.school || ""}
                placeholder="e.g. Tribhuvan University · Kathmandu, Nepal"
                onChange={(e) => setItem(i, { school: e.target.value })}
              />
            </label>
            <div>
              <label>Accent color</label>
              <div style={{ display: "flex", gap: ".4rem", alignItems: "center", marginTop: ".35rem" }}>
                <input
                  type="color"
                  value={it.col || "#22d3ee"}
                  onChange={(e) => setItem(i, { col: e.target.value })}
                  style={{ width: 44, height: 38, padding: 2, cursor: "pointer" }}
                />
                <input
                  value={it.col || "#22d3ee"}
                  style={{ width: 100 }}
                  onChange={(e) => setItem(i, { col: e.target.value })}
                />
                <div style={{ display: "flex", gap: ".25rem" }}>
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      title={p.label}
                      onClick={() => setItem(i, { col: p.hex })}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: it.col === p.hex ? "2px solid #fff" : "1px solid rgba(255,255,255,.2)",
                        background: p.hex,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <label style={{ marginTop: ".5rem" }}>
            Details / Coursework / Highlights
            <textarea
              rows={3}
              value={it.detail || ""}
              placeholder="e.g. Completed with focus on Full-Stack Development, Database Design, and Cloud Architecture."
              onChange={(e) => setItem(i, { detail: e.target.value })}
            />
          </label>

          <div
            style={{
              marginTop: "1rem",
              padding: "1.1rem",
              borderRadius: 10,
              background: "#03050a",
              position: "relative",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${it.col || "#22d3ee"}, transparent)`,
              }}
            />
            <span style={{ fontSize: ".65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: ".15em" }}>
              {it.when || "Period"}
            </span>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: ".25rem 0 .15rem", color: "#e8eef7" }}>
              {it.degree || "Degree name"}
            </h4>
            <p style={{ fontSize: ".85rem", color: it.col || "#22d3ee", margin: "0 0 .5rem" }}>
              {it.school || "School name"}
            </p>
            {it.detail && (
              <p style={{ fontSize: ".82rem", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{it.detail}</p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
