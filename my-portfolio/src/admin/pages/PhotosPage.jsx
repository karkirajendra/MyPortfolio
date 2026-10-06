import { useState } from "react";
import { api } from "../api";
import { mediaUrl } from "../../utils/portfolioHelpers";

export default function PhotosPage({ content, onReload, onSave }) {
  const [msg, setMsg] = useState("");
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [resumeName, setResumeName] = useState(content.site?.resumeDownloadName || "Rajendra-Karki-Resume.pdf");

  const upload = async (file, kind) => {
    setBusy(true);
    setMsg("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", kind);
      if (alt) form.append("alt", alt);
      await api("/admin/upload", { method: "POST", form });
      await onReload();
      setMsg(`${kind.charAt(0).toUpperCase() + kind.slice(1)} uploaded successfully!`);
      if (kind === "gallery") setAlt("");
    } catch (ex) {
      setMsg(`Upload failed: ${ex.message}`);
    } finally {
      setBusy(false);
    }
  };

  const removePhoto = async (id) => {
    if (!window.confirm("Delete this photo from gallery and database?")) return;
    setBusy(true);
    try {
      await api(`/admin/photos/${id}`, { method: "DELETE" });
      await onReload();
      setMsg("Photo deleted");
    } catch (ex) {
      setMsg(`Failed to delete: ${ex.message}`);
    } finally {
      setBusy(false);
    }
  };

  const clearSpecialPhoto = async (field) => {
    if (!window.confirm(`Reset ${field === "portraitUrl" ? "portrait" : "about photo"} to default?`)) return;
    setBusy(true);
    try {
      const oldUrl = content.site[field];
      if (oldUrl) {
        await api(`/admin/upload?url=${encodeURIComponent(oldUrl)}`, { method: "DELETE" }).catch(() => {});
      }
      await onSave({ site: { ...content.site, [field]: "" } });
      await onReload();
      setMsg("Photo reset to default");
    } finally {
      setBusy(false);
    }
  };

  const saveResumeName = async () => {
    setBusy(true);
    try {
      await onSave({ site: { ...content.site, resumeDownloadName: resumeName } });
      await onReload();
      setMsg("Resume download name saved!");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <div className="adm-header">
        <div>
          <h1>Photos & Media</h1>
          <p className="adm-lead">
            Manage your hero portrait, about photo, resume PDF, and about section photo gallery. All media is stored securely in MongoDB GridFS.
          </p>
        </div>
      </div>

      {msg && <p className={msg.includes("success") || msg.includes("saved") || msg.includes("reset") ? "adm-ok-banner" : "adm-err"}>{msg}</p>}

      <div className="adm-block">
        <h3>Hero Card Portrait</h3>
        <p className="adm-sub">
          Shown on the floating 3D hero profile card. If empty, the default bundled portrait is used.
        </p>
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start", marginTop: ".8rem" }}>
          {content.site?.portraitUrl ? (
            <div style={{ position: "relative" }}>
              <img
                src={mediaUrl(content.site.portraitUrl)}
                alt="Portrait"
                style={{ width: 140, height: 175, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(34,211,238,.3)" }}
              />
              <button
                type="button"
                className="adm-btn danger"
                style={{ position: "absolute", bottom: 6, left: 6, right: 6, padding: ".3rem", fontSize: ".72rem" }}
                onClick={() => clearSpecialPhoto("portraitUrl")}
              >
                Reset default
              </button>
            </div>
          ) : (
            <div
              style={{
                width: 140,
                height: 175,
                borderRadius: 12,
                border: "1px dashed rgba(255,255,255,.2)",
                display: "grid",
                placeItems: "center",
                color: "#64748b",
                fontSize: ".75rem",
                textAlign: "center",
                padding: ".5rem",
              }}
            >
              Bundled default in use
            </div>
          )}
          <div style={{ flex: 1 }}>
            <label>
              Upload new portrait (JPG, PNG, WebP)
              <input
                type="file"
                accept="image/*"
                disabled={busy}
                onChange={(e) => e.target.files[0] && upload(e.target.files[0], "portrait")}
              />
            </label>
            <p style={{ fontSize: ".75rem", color: "#64748b", marginTop: ".4rem" }}>
              Recommended ratio: 4:5 vertical portrait.
            </p>
          </div>
        </div>
      </div>

      <div className="adm-block">
        <h3>About Section Photo</h3>
        <p className="adm-sub">
          Photo displayed on the About Me section. If left empty, it falls back to the hero portrait.
        </p>
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start", marginTop: ".8rem" }}>
          {content.site?.aboutPhotoUrl ? (
            <div style={{ position: "relative" }}>
              <img
                src={mediaUrl(content.site.aboutPhotoUrl)}
                alt="About"
                style={{ width: 140, height: 175, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(34,211,238,.3)" }}
              />
              <button
                type="button"
                className="adm-btn danger"
                style={{ position: "absolute", bottom: 6, left: 6, right: 6, padding: ".3rem", fontSize: ".72rem" }}
                onClick={() => clearSpecialPhoto("aboutPhotoUrl")}
              >
                Reset default
              </button>
            </div>
          ) : (
            <div
              style={{
                width: 140,
                height: 175,
                borderRadius: 12,
                border: "1px dashed rgba(255,255,255,.2)",
                display: "grid",
                placeItems: "center",
                color: "#64748b",
                fontSize: ".75rem",
                textAlign: "center",
                padding: ".5rem",
              }}
            >
              Falls back to portrait
            </div>
          )}
          <div style={{ flex: 1 }}>
            <label>
              Upload about photo
              <input
                type="file"
                accept="image/*"
                disabled={busy}
                onChange={(e) => e.target.files[0] && upload(e.target.files[0], "about")}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="adm-block">
        <div className="adm-item-top" style={{ marginBottom: ".9rem" }}>
          <div>
            <h3 style={{ margin: 0 }}>CV / Resume PDF</h3>
            <p className="adm-sub" style={{ margin: ".25rem 0 0" }}>
              Visitors can <strong>view</strong> (opens in browser) or <strong>download</strong> your CV. Upload a new PDF here to replace the current one.
            </p>
          </div>
          {content.site?.resumeUrl && (
            <div className="adm-item-actions">
              <a
                href={mediaUrl(content.site.resumeUrl)}
                target="_blank"
                rel="noreferrer"
                className="adm-btn ghost"
                style={{ fontSize: ".8rem" }}
              >
                👁 View PDF
              </a>
              <a
                href={mediaUrl(content.site.resumeUrl)}
                download={resumeName}
                className="adm-btn-primary"
                style={{ fontSize: ".8rem", textDecoration: "none", padding: ".45rem .85rem" }}
              >
                ⬇ Download CV
              </a>
            </div>
          )}
        </div>

        {/* PDF preview embed */}
        {content.site?.resumeUrl ? (
          <div style={{ border: "1px solid var(--adm-border)", borderRadius: 10, overflow: "hidden", marginBottom: "1rem", background: "var(--adm-surface2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".55rem .85rem", borderBottom: "1px solid var(--adm-border)" }}>
              <span style={{ fontSize: ".75rem", color: "var(--adm-subtle)", fontFamily: "monospace" }}>
                {content.site.resumeUrl}
              </span>
              <a
                href={mediaUrl(content.site.resumeUrl)}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: ".72rem", color: "var(--adm-accent)", textDecoration: "none", fontWeight: 600 }}
              >
                Open full screen ↗
              </a>
            </div>
            <iframe
              src={mediaUrl(content.site.resumeUrl)}
              title="CV Preview"
              style={{ width: "100%", height: 480, border: 0, display: "block", background: "#fff" }}
            />
          </div>
        ) : (
          <div className="adm-empty" style={{ marginBottom: "1rem" }}>
            📄 No CV uploaded yet. Upload a PDF below.
          </div>
        )}

        {/* Upload + filename controls */}
        <div className="adm-row">
          <label>
            Upload new CV (PDF)
            <input
              type="file"
              accept="application/pdf"
              disabled={busy}
              onChange={(e) => e.target.files[0] && upload(e.target.files[0], "resume")}
            />
            <span style={{ fontSize: ".72rem", color: "var(--adm-muted)", marginTop: ".2rem" }}>
              Replaces the current CV. PDF format only.
            </span>
          </label>
          <label>
            Download file name
            <div style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", flexDirection: "column" }}>
              <input
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="Rajendra-Karki-Resume.pdf"
              />
              <button type="button" className="adm-btn-primary" style={{ fontSize: ".8rem", padding: ".5rem .9rem" }} onClick={saveResumeName}>
                Save file name
              </button>
            </div>
            <span style={{ fontSize: ".72rem", color: "var(--adm-muted)", marginTop: ".2rem" }}>
              This is the filename when visitors download the CV.
            </span>
          </label>
        </div>
      </div>

      <div className="adm-block">
        <h3>About Gallery Photos</h3>
        <p className="adm-sub">
          Add supporting photos that display in a mini grid beneath your about photo.
        </p>
        <div className="adm-row" style={{ marginTop: ".8rem", alignItems: "end" }}>
          <label>
            Photo description / Alt text
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="e.g. Speaking at college tech event"
            />
          </label>
          <label>
            Upload image
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => e.target.files[0] && upload(e.target.files[0], "gallery")}
            />
          </label>
        </div>

        <div className="adm-photos" style={{ marginTop: "1.2rem" }}>
          {(content.photos || []).map((p) => (
            <div key={p.id} className="adm-photo-card">
              <img src={mediaUrl(p.url)} alt={p.alt} />
              <div style={{ padding: ".6rem" }}>
                <p style={{ fontSize: ".75rem", color: "#94a3b8", margin: "0 0 .4rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.alt || "No description"}
                </p>
                <button
                  type="button"
                  className="adm-btn danger"
                  style={{ width: "100%", padding: ".3rem", fontSize: ".72rem" }}
                  onClick={() => removePhoto(p.id)}
                >
                  Delete from DB
                </button>
              </div>
            </div>
          ))}
        </div>

        {content.photos?.length === 0 && (
          <p style={{ fontSize: ".82rem", color: "#64748b", marginTop: "1rem" }}>No gallery photos added yet.</p>
        )}
      </div>
    </section>
  );
}
