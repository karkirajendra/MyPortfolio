import { useState } from "react";
import { api } from "../api";

const COLOR_PRESETS = [
  { label: "Cyan/Sky", ca: "#22d3ee", cb: "#0ea5e9" },
  { label: "Emerald/Teal", ca: "#34d399", cb: "#10b981" },
  { label: "Violet/Indigo", ca: "#a78bfa", cb: "#6366f1" },
  { label: "Amber/Orange", ca: "#fbbf24", cb: "#f97316" },
  { label: "Rose/Pink", ca: "#fb7185", cb: "#f43f5e" },
];

function nid() {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function ProjectsPage({ projects, onSave }) {
  const [rows, setRows] = useState(projects || []);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);

  const setRow = (i, patch) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const moveRow = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= rows.length) return;
    const next = [...rows];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setRows(next);
  };

  const uploadImage = async (i, file) => {
    setUploadingIdx(i);
    setMsg("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", "project");
      if (rows[i]?.image) {
        form.append("oldUrl", rows[i].image);
      }
      const res = await api("/admin/upload", { method: "POST", form });
      setRow(i, { image: res.url });
      setMsg("Cover image uploaded!");
    } catch (err) {
      setMsg(`Upload failed: ${err.message}`);
    } finally {
      setUploadingIdx(null);
    }
  };

  const removeImage = async (i) => {
    const oldUrl = rows[i]?.image;
    if (oldUrl) {
      try {
        await api(`/admin/upload?url=${encodeURIComponent(oldUrl)}`, { method: "DELETE" });
      } catch {
        /* ignore */
      }
    }
    setRow(i, { image: "" });
  };

  const addProject = () => {
    const preset = COLOR_PRESETS[rows.length % COLOR_PRESETS.length];
    setRows((rs) => [
      ...rs,
      {
        id: nid(),
        num: String(rs.length + 1).padStart(2, "0"),
        title: "New Project",
        subtitle: "Full-Stack Application",
        desc: "A brief summary of what this project does and the problems it solves.",
        story: {
          problem: "The problem this application was built to address.",
          solution: "How the solution was designed and implemented.",
          highlights: ["Role-based authorization", "RESTful API architecture", "Responsive modern UI"],
        },
        tech: ["React", "Node.js", "Express", "MongoDB"],
        github: "https://github.com/karkirajendra",
        demo: "",
        badge: "Full-Stack",
        ca: preset.ca,
        cb: preset.cb,
        featured: rs.length === 0,
        image: "",
      },
    ]);
  };

  const removeProject = (i) => {
    if (window.confirm(`Delete "${rows[i]?.title || "this project"}"?`)) {
      setRows((rs) => rs.filter((_, idx) => idx !== i));
    }
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const ok = await onSave(rows);
      setMsg(ok ? "Projects saved successfully!" : "Failed to save projects");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="adm-header">
        <div>
          <h1>Projects & Case Studies</h1>
          <p className="adm-lead">
            Manage your project portfolio, case study narratives, tech stack tags, live demos, and cover images.
          </p>
        </div>
        <div className="adm-toolbar">
          <button type="button" className="adm-btn ghost" onClick={addProject}>
            + Add project
          </button>
          <button type="button" className="adm-save" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save all projects"}
          </button>
        </div>
      </div>

      {msg && <p className={msg.includes("success") || msg.includes("uploaded") ? "adm-ok-banner" : "adm-err"}>{msg}</p>}

      {rows.length === 0 ? (
        <div className="adm-empty">
          <p>No projects listed yet.</p>
          <button type="button" className="adm-btn ghost" onClick={addProject}>
            Add your first project
          </button>
        </div>
      ) : null}

      {rows.map((p, i) => (
        <div className="adm-item" key={p.id || i}>
          <div className="adm-item-top">
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
              <span
                style={{
                  background: `linear-gradient(135deg, ${p.ca || "#22d3ee"}, ${p.cb || "#0ea5e9"})`,
                  color: "#000",
                  fontWeight: 800,
                  fontSize: ".72rem",
                  padding: ".2rem .5rem",
                  borderRadius: 6,
                }}
              >
                {p.num || String(i + 1).padStart(2, "0")}
              </span>
              <h3>{p.title || "Untitled project"}</h3>
              {p.featured && (
                <span
                  style={{
                    background: "rgba(34,211,238,.15)",
                    color: "#22d3ee",
                    fontSize: ".7rem",
                    padding: ".15rem .5rem",
                    borderRadius: 99,
                    border: "1px solid rgba(34,211,238,.3)",
                  }}
                >
                  Featured
                </span>
              )}
            </div>
            <div className="adm-item-actions">
              <button
                type="button"
                className="adm-btn-icon"
                title="Move up"
                disabled={i === 0}
                onClick={() => moveRow(i, i - 1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="adm-btn-icon"
                title="Move down"
                disabled={i === rows.length - 1}
                onClick={() => moveRow(i, i + 1)}
              >
                ↓
              </button>
              <button type="button" className="adm-btn danger" onClick={() => removeProject(i)}>
                Delete
              </button>
            </div>
          </div>

          <div className="adm-row" style={{ marginTop: ".8rem" }}>
            <label>
              Number / Index
              <input value={p.num || ""} placeholder="01" onChange={(e) => setRow(i, { num: e.target.value })} />
            </label>
            <label>
              Title
              <input value={p.title || ""} placeholder="Project Title" onChange={(e) => setRow(i, { title: e.target.value })} />
            </label>
            <label>
              Subtitle
              <input value={p.subtitle || ""} placeholder="e.g. MERN Stack Rental Platform" onChange={(e) => setRow(i, { subtitle: e.target.value })} />
            </label>
            <label>
              Badge Tag
              <input value={p.badge || ""} placeholder="e.g. Full-Stack, Client Work" onChange={(e) => setRow(i, { badge: e.target.value })} />
            </label>
          </div>

          <div className="adm-row">
            <div>
              <label>Gradient Colors (Start & End)</label>
              <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginTop: ".35rem" }}>
                <input
                  type="color"
                  value={p.ca || "#22d3ee"}
                  onChange={(e) => setRow(i, { ca: e.target.value })}
                  style={{ width: 42, height: 38, padding: 2, cursor: "pointer" }}
                />
                <input
                  type="color"
                  value={p.cb || "#0ea5e9"}
                  onChange={(e) => setRow(i, { cb: e.target.value })}
                  style={{ width: 42, height: 38, padding: 2, cursor: "pointer" }}
                />
                <div style={{ display: "flex", gap: ".3rem" }}>
                  {COLOR_PRESETS.map((preset, pi) => (
                    <button
                      key={pi}
                      type="button"
                      title={preset.label}
                      onClick={() => setRow(i, { ca: preset.ca, cb: preset.cb })}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${preset.ca}, ${preset.cb})`,
                        border: p.ca === preset.ca ? "2px solid #fff" : "1px solid rgba(255,255,255,.2)",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <label>
              Featured Card
              <select
                value={p.featured ? "yes" : "no"}
                onChange={(e) => {
                  const isFeat = e.target.value === "yes";
                  if (isFeat) {
                    setRows((rs) => rs.map((r, idx) => ({ ...r, featured: idx === i })));
                  } else {
                    setRow(i, { featured: false });
                  }
                }}
              >
                <option value="no">Standard Card</option>
                <option value="yes">Featured (Large Hero Case Study)</option>
              </select>
            </label>
          </div>

          <div className="adm-row">
            <label>
              GitHub Repository URL
              <input
                value={p.github || ""}
                placeholder="https://github.com/..."
                onChange={(e) => setRow(i, { github: e.target.value })}
              />
            </label>
            <label>
              Live Demo URL
              <input
                value={p.demo || ""}
                placeholder="https://..."
                onChange={(e) => setRow(i, { demo: e.target.value })}
              />
            </label>
          </div>

          <label style={{ marginTop: ".5rem" }}>
            Summary Description
            <textarea
              rows={3}
              value={p.desc || ""}
              placeholder="Comprehensive summary shown on the card and modal."
              onChange={(e) => setRow(i, { desc: e.target.value })}
            />
          </label>

          <div className="adm-row">
            <label>
              Problem Statement
              <textarea
                rows={2}
                value={p.story?.problem || ""}
                placeholder="The core problem the project solves."
                onChange={(e) => setRow(i, { story: { ...p.story, problem: e.target.value } })}
              />
            </label>
            <label>
              Solution Approach
              <textarea
                rows={2}
                value={p.story?.solution || ""}
                placeholder="How you architected the solution."
                onChange={(e) => setRow(i, { story: { ...p.story, solution: e.target.value } })}
              />
            </label>
          </div>

          <div className="adm-row">
            <label>
              Key Highlights (one per line)
              <textarea
                rows={3}
                value={(p.story?.highlights || []).join("\n")}
                placeholder={"Role-based auth with JWT\nReal-time notifications\nDeployed on cloud with CI/CD"}
                onChange={(e) =>
                  setRow(i, {
                    story: {
                      ...p.story,
                      highlights: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                    },
                  })
                }
              />
            </label>
            <label>
              Technologies Used (one per line)
              <textarea
                rows={3}
                value={(p.tech || []).join("\n")}
                placeholder={"React.js\nNode.js\nExpress\nMongoDB"}
                onChange={(e) =>
                  setRow(i, {
                    tech: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                  })
                }
              />
            </label>
          </div>

          <div style={{ marginTop: ".8rem", padding: ".9rem", borderRadius: 10, background: "#03050a", border: "1px solid rgba(255,255,255,.07)" }}>
            <label style={{ margin: 0, fontSize: ".82rem", color: "#e8eef7" }}>
              Cover Image / Screenshot
            </label>
            <p style={{ fontSize: ".75rem", color: "#64748b", margin: ".2rem 0 .6rem" }}>
              Upload a screenshot or project mockup. Stored in MongoDB GridFS.
            </p>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingIdx === i}
                onChange={(e) => e.target.files[0] && uploadImage(i, e.target.files[0])}
              />
              {uploadingIdx === i && <span style={{ fontSize: ".8rem", color: "#22d3ee" }}>Uploading to MongoDB…</span>}
              {p.image && (
                <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
                  <img
                    src={p.image}
                    alt=""
                    style={{ height: 60, width: 100, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,.2)" }}
                  />
                  <button type="button" className="adm-btn danger" style={{ padding: ".3rem .6rem", fontSize: ".75rem" }} onClick={() => removeImage(i)}>
                    Remove image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
