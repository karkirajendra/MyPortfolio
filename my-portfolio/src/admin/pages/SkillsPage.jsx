import { useState } from "react";
import { skillItems } from "../../utils/portfolioHelpers";

const COLOR_PRESETS = [
  { label: "Cyan", hex: "#22d3ee" },
  { label: "Emerald", hex: "#34d399" },
  { label: "Violet", hex: "#a78bfa" },
  { label: "Amber", hex: "#fbbf24" },
  { label: "Rose", hex: "#fb7185" },
  { label: "Blue", hex: "#38bdf8" },
];

export default function SkillsPage({ skills, onSave }) {
  const [groups, setGroups] = useState((skills || []).map((g) => ({ ...g, items: skillItems(g) })));
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const setGroup = (i, patch) => {
    setGroups((gs) => gs.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  };

  const moveGroup = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= groups.length) return;
    const next = [...groups];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setGroups(next);
  };

  const moveSkill = (groupIndex, fromIndex, toIndex) => {
    const group = groups[groupIndex];
    if (!group || toIndex < 0 || toIndex >= group.items.length) return;
    const nextItems = [...group.items];
    const [moved] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, moved);
    setGroup(groupIndex, { items: nextItems });
  };

  const addGroup = () => {
    const defaultColor = COLOR_PRESETS[groups.length % COLOR_PRESETS.length].hex;
    setGroups((gs) => [
      ...gs,
      {
        label: "New category",
        col: defaultColor,
        bg: `${defaultColor}10`,
        bd: `${defaultColor}38`,
        items: [{ name: "Skill name", level: 80 }],
      },
    ]);
  };

  const removeGroup = (i) => {
    if (window.confirm(`Delete "${groups[i]?.label || "this group"}"?`)) {
      setGroups((gs) => gs.filter((_, idx) => idx !== i));
    }
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const ok = await onSave(groups);
      setMsg(ok ? "Skills saved successfully!" : "Failed to save skills");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="adm-header">
        <div>
          <h1>Skills & Tech Stack</h1>
          <p className="adm-lead">
            Manage skill categories, proficiency levels (0–100%), and accent colors shown on the live portfolio.
          </p>
        </div>
        <div className="adm-toolbar">
          <button type="button" className="adm-btn ghost" onClick={addGroup}>
            + Add group
          </button>
          <button type="button" className="adm-save" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save all skills"}
          </button>
        </div>
      </div>

      {msg && <p className={msg.includes("success") ? "adm-ok-banner" : "adm-err"}>{msg}</p>}

      {groups.length === 0 ? (
        <div className="adm-empty">
          <p>No skill groups defined yet.</p>
          <button type="button" className="adm-btn ghost" onClick={addGroup}>
            Create your first skill group
          </button>
        </div>
      ) : null}

      {groups.map((g, i) => (
        <div className="adm-item" key={i}>
          <div className="adm-item-top">
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: g.col || "#22d3ee",
                  boxShadow: `0 0 10px ${g.col || "#22d3ee"}`,
                }}
              />
              <h3>{g.label || "Untitled category"}</h3>
              <span style={{ fontSize: ".75rem", color: "#64748b" }}>({g.items?.length || 0} skills)</span>
            </div>
            <div className="adm-item-actions">
              <button
                type="button"
                className="adm-btn-icon"
                title="Move up"
                disabled={i === 0}
                onClick={() => moveGroup(i, i - 1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="adm-btn-icon"
                title="Move down"
                disabled={i === groups.length - 1}
                onClick={() => moveGroup(i, i + 1)}
              >
                ↓
              </button>
              <button type="button" className="adm-btn danger" onClick={() => removeGroup(i)}>
                Delete group
              </button>
            </div>
          </div>

          <div className="adm-row" style={{ marginTop: ".8rem" }}>
            <label>
              Category title
              <input
                value={g.label || ""}
                placeholder="e.g. Frontend, Backend, Database"
                onChange={(e) => setGroup(i, { label: e.target.value })}
              />
            </label>
            <div>
              <label>Accent color</label>
              <div style={{ display: "flex", gap: ".4rem", alignItems: "center", marginTop: ".35rem" }}>
                <input
                  type="color"
                  value={g.col || "#22d3ee"}
                  onChange={(e) =>
                    setGroup(i, {
                      col: e.target.value,
                      bg: `${e.target.value}10`,
                      bd: `${e.target.value}38`,
                    })
                  }
                  style={{ width: 44, height: 38, padding: 2, cursor: "pointer" }}
                />
                <input
                  value={g.col || "#22d3ee"}
                  style={{ width: 100 }}
                  onChange={(e) =>
                    setGroup(i, {
                      col: e.target.value,
                      bg: `${e.target.value}10`,
                      bd: `${e.target.value}38`,
                    })
                  }
                />
                <div style={{ display: "flex", gap: ".25rem", flexWrap: "wrap" }}>
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      title={p.label}
                      onClick={() =>
                        setGroup(i, {
                          col: p.hex,
                          bg: `${p.hex}10`,
                          bd: `${p.hex}38`,
                        })
                      }
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: g.col === p.hex ? "2px solid #fff" : "1px solid rgba(255,255,255,.2)",
                        background: p.hex,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ fontSize: ".82rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Skills in this category
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginTop: ".5rem" }}>
              {g.items.map((it, j) => (
                <div
                  key={j}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1.6fr auto auto",
                    gap: ".6rem",
                    alignItems: "center",
                    background: "rgba(255,255,255,.02)",
                    padding: ".5rem .7rem",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  <div>
                    <input
                      value={it.name}
                      placeholder="Skill name"
                      onChange={(e) => {
                        const items = g.items.map((x, xi) => (xi === j ? { ...x, name: e.target.value } : x));
                        setGroup(i, { items });
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={it.level}
                      onChange={(e) => {
                        const items = g.items.map((x, xi) =>
                          xi === j ? { ...x, level: Number(e.target.value) } : x
                        );
                        setGroup(i, { items });
                      }}
                      style={{ flex: 1 }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: ".2rem" }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={it.level}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                          const items = g.items.map((x, xi) => (xi === j ? { ...x, level: val } : x));
                          setGroup(i, { items });
                        }}
                        style={{ width: 56, textAlign: "center", padding: ".4rem" }}
                      />
                      <span style={{ fontSize: ".75rem", color: "#64748b" }}>%</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: ".2rem" }}>
                    <button
                      type="button"
                      className="adm-btn-icon"
                      title="Move up"
                      disabled={j === 0}
                      onClick={() => moveSkill(i, j, j - 1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="adm-btn-icon"
                      title="Move down"
                      disabled={j === g.items.length - 1}
                      onClick={() => moveSkill(i, j, j + 1)}
                    >
                      ↓
                    </button>
                  </div>

                  <button
                    type="button"
                    className="adm-btn danger"
                    style={{ padding: ".35rem .6rem", fontSize: ".75rem" }}
                    onClick={() => setGroup(i, { items: g.items.filter((_, xi) => xi !== j) })}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="adm-btn ghost"
              style={{ marginTop: ".6rem" }}
              onClick={() => setGroup(i, { items: [...g.items, { name: "", level: 75 }] })}
            >
              + Add skill to {g.label || "category"}
            </button>
          </div>

          <div
            style={{
              marginTop: "1.2rem",
              padding: ".9rem 1.1rem",
              borderRadius: 10,
              background: "#03050a",
              border: `1px solid ${g.col || "#22d3ee"}33`,
            }}
          >
            <p style={{ fontSize: ".65rem", textTransform: "uppercase", letterSpacing: ".1em", color: "#64748b", margin: "0 0 .5rem" }}>
              Live Preview: {g.label || "Untitled"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {g.items.map((it, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".2rem" }}>
                    <span
                      style={{
                        fontSize: ".75rem",
                        color: g.col || "#22d3ee",
                        background: `${g.col || "#22d3ee"}15`,
                        border: `1px solid ${g.col || "#22d3ee"}40`,
                        padding: ".15rem .5rem",
                        borderRadius: 6,
                      }}
                    >
                      {it.name || "Skill name"}
                    </span>
                    <span style={{ fontSize: ".7rem", color: "#94a3b8" }}>{it.level}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${Math.max(0, Math.min(100, it.level || 0))}%`,
                        height: "100%",
                        background: g.col || "#22d3ee",
                        boxShadow: `0 0 8px ${g.col || "#22d3ee"}`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
