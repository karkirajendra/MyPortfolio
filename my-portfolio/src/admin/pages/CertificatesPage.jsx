import { useState } from "react";
import { api } from "../api";
import { mediaUrl } from "../../utils/portfolioHelpers";

function nid() {
  return `cert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function CertificatesPage({ certificates, onSave }) {
  const [items, setItems] = useState(certificates || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [featured, setFeatured] = useState(false);
  const [formErr, setFormErr] = useState("");

  const openAdd = () => {
    setEditIndex(null);
    setTitle("");
    setOrganization("");
    setIssueDate("");
    setCredentialId("");
    setDescription("");
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setCertificateUrl("");
    setDisplayOrder(items.length + 1);
    setFeatured(items.length === 0);
    setFormErr("");
    setModalOpen(true);
  };

  const openEdit = (index) => {
    const c = items[index];
    setEditIndex(index);
    setTitle(c.title || "");
    setOrganization(c.organization || "");
    setIssueDate(c.issueDate || "");
    setCredentialId(c.credentialId || "");
    setDescription(c.description || "");
    setImageUrl(c.imageUrl || "");
    setImageFile(null);
    setImagePreview(c.imageUrl || "");
    setCertificateUrl(c.certificateUrl || "");
    setDisplayOrder(c.displayOrder !== undefined ? c.displayOrder : index + 1);
    setFeatured(Boolean(c.featured));
    setFormErr("");
    setModalOpen(true);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormErr("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormErr("Image file size must be less than 10 MB.");
      return;
    }
    setFormErr("");
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormErr("Certificate Title is required.");
      return;
    }
    if (!organization.trim()) {
      setFormErr("Issuing Organization is required.");
      return;
    }

    setBusy(true);
    setFormErr("");
    try {
      let finalImageUrl = imageUrl;

      // Handle image upload if a new file was chosen
      if (imageFile) {
        setUploadProgress(true);
        const form = new FormData();
        form.append("file", imageFile);
        form.append("kind", "certificate");
        if (imageUrl) form.append("oldUrl", imageUrl);
        const res = await api("/admin/upload", { method: "POST", form });
        finalImageUrl = res.url;
        setUploadProgress(false);
      }

      const certData = {
        id: editIndex !== null ? items[editIndex].id : nid(),
        title: title.trim(),
        organization: organization.trim(),
        issueDate: issueDate.trim(),
        credentialId: credentialId.trim(),
        description: description.trim(),
        imageUrl: finalImageUrl,
        certificateUrl: certificateUrl.trim(),
        displayOrder: Number(displayOrder) || items.length + 1,
        featured: Boolean(featured),
        updatedAt: new Date().toISOString(),
      };

      let nextItems;
      if (editIndex !== null) {
        nextItems = items.map((item, idx) => (idx === editIndex ? certData : item));
      } else {
        nextItems = [...items, { ...certData, createdAt: new Date().toISOString() }];
      }

      // Sort by displayOrder
      nextItems.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

      setItems(nextItems);
      await onSave({ certificates: nextItems });
      setMsg(editIndex !== null ? "Certificate updated successfully!" : "Certificate added successfully!");
      setModalOpen(false);
    } catch (err) {
      setFormErr(err.message || "Failed to save certificate.");
    } finally {
      setBusy(false);
      setUploadProgress(false);
    }
  };

  const handleDelete = async (index) => {
    const cert = items[index];
    if (!window.confirm(`Delete "${cert.title || "this certificate"}"? This action cannot be undone.`)) {
      return;
    }

    setBusy(true);
    setMsg("");
    try {
      if (cert.id) {
        const res = await api(`/admin/certificates/${cert.id}`, { method: "DELETE" });
        if (res?.certificates) {
          setItems(res.certificates);
        } else {
          const next = items.filter((_, idx) => idx !== index);
          setItems(next);
          await onSave({ certificates: next });
        }
      }
      setMsg("Certificate deleted successfully.");
    } catch (err) {
      setMsg(`Failed to delete: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      {/* Header */}
      <div className="adm-header">
        <div>
          <h1>Certificates & Achievements</h1>
          <p className="adm-lead">
            Manage your certificates, achievements, training, and professional credentials displayed on your live portfolio.
          </p>
        </div>
        <div className="adm-toolbar">
          <button type="button" className="adm-btn-primary" onClick={openAdd}>
            + Add Certificate
          </button>
        </div>
      </div>

      {msg && (
        <p className={msg.includes("success") ? "adm-ok-banner" : "adm-err sticky"}>
          {msg}
        </p>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="adm-empty" style={{ padding: "4rem 1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>📜</div>
          <h3 style={{ margin: "0 0 0.5rem", color: "var(--adm-txt)" }}>No certificates yet</h3>
          <p style={{ maxWidth: 450, margin: "0 auto 1.5rem", color: "var(--adm-muted)", fontSize: "0.88rem" }}>
            Add your certificates, training, achievements, and professional credentials to display them on your portfolio.
          </p>
          <button type="button" className="adm-btn-primary" onClick={openAdd}>
            + Add Certificate
          </button>
        </div>
      ) : (
        /* Certificate Cards Grid */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.2rem",
            marginTop: "1rem",
          }}
        >
          {items.map((cert, index) => (
            <div
              key={cert.id || index}
              className="adm-item"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1.1rem",
                borderRadius: 14,
                margin: 0,
                background: "var(--adm-surface)",
                border: "1px solid var(--adm-border)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              {/* Card Header & Badges */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--adm-muted)",
                    background: "var(--adm-surface2)",
                    padding: "0.2rem 0.55rem",
                    borderRadius: 6,
                    border: "1px solid var(--adm-border)",
                  }}
                >
                  Order #{cert.displayOrder || index + 1}
                </span>

                {cert.featured && (
                  <span
                    style={{
                      background: "rgba(34,211,238,0.12)",
                      color: "var(--adm-accent)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "0.18rem 0.55rem",
                      borderRadius: 99,
                      border: "1px solid rgba(34,211,238,0.3)",
                    }}
                  >
                    ★ Featured
                  </span>
                )}
              </div>

              {/* Certificate Image / Thumbnail */}
              <div
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "var(--adm-surface2)",
                  border: "1px solid var(--adm-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.9rem",
                  position: "relative",
                  cursor: cert.imageUrl ? "pointer" : "default",
                }}
                onClick={() => cert.imageUrl && setViewItem(cert)}
              >
                {cert.imageUrl ? (
                  <img
                    src={mediaUrl(cert.imageUrl)}
                    alt={cert.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: "0.4rem",
                      display: "block",
                      transition: "transform 0.25s ease",
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "var(--adm-muted)", fontSize: "0.82rem" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>📄</div>
                    No image uploaded
                  </div>
                )}
              </div>

              {/* Certificate Details */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    margin: "0 0 0.35rem",
                    color: "var(--adm-txt)",
                    lineHeight: 1.3,
                  }}
                >
                  {cert.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--adm-accent)",
                    fontWeight: 600,
                    margin: "0 0 0.25rem",
                  }}
                >
                  Issued by: {cert.organization}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", fontSize: "0.76rem", color: "var(--adm-muted)", margin: "0.35rem 0 0.6rem" }}>
                  {cert.issueDate && <span>📅 {cert.issueDate}</span>}
                  {cert.credentialId && <span>ID: <code style={{ color: "var(--adm-txt)", fontSize: "0.72rem" }}>{cert.credentialId}</code></span>}
                </div>

                {cert.description && (
                  <p
                    style={{
                      fontSize: "0.8rem",
                      lineHeight: 1.5,
                      color: "var(--adm-subtle)",
                      margin: "0 0 1rem",
                      flex: 1,
                    }}
                  >
                    {cert.description}
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "0.45rem",
                  alignItems: "center",
                  borderTop: "1px solid var(--adm-border)",
                  paddingTop: "0.85rem",
                  marginTop: "auto",
                }}
              >
                {cert.imageUrl && (
                  <button
                    type="button"
                    className="adm-btn ghost"
                    style={{ flex: 1, fontSize: "0.78rem", padding: "0.42rem 0.65rem" }}
                    onClick={() => setViewItem(cert)}
                  >
                    👁 View
                  </button>
                )}
                <button
                  type="button"
                  className="adm-btn ghost"
                  style={{ flex: 1, fontSize: "0.78rem", padding: "0.42rem 0.65rem" }}
                  onClick={() => openEdit(index)}
                >
                  ✏ Edit
                </button>
                <button
                  type="button"
                  className="adm-btn danger"
                  style={{ fontSize: "0.78rem", padding: "0.42rem 0.65rem" }}
                  onClick={() => handleDelete(index)}
                  disabled={busy}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Certificate Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            overflowY: "auto",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !busy) setModalOpen(false);
          }}
        >
          <div
            className="adm-block"
            style={{
              width: "100%",
              maxWidth: 620,
              maxHeight: "92vh",
              overflowY: "auto",
              padding: "1.8rem",
              borderRadius: 16,
              background: "var(--adm-surface)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
              margin: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800 }}>
                {editIndex !== null ? "Edit Certificate" : "Add Certificate"}
              </h2>
              <button
                type="button"
                className="adm-btn-icon"
                onClick={() => setModalOpen(false)}
                disabled={busy}
              >
                ✕
              </button>
            </div>

            {formErr && <p className="adm-err sticky">{formErr}</p>}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
              <label>
                Certificate Title *
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MERN Stack Web Development Certificate"
                  required
                />
              </label>

              <div className="adm-row">
                <label>
                  Issuing Organization *
                  <input
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. N9-Solution, Coursera, Tribhuvan University"
                    required
                  />
                </label>
                <label>
                  Issue Date (Optional)
                  <input
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="e.g. 2024-12-15 or Dec 2024"
                  />
                </label>
              </div>

              <div className="adm-row">
                <label>
                  Certificate / Credential ID (Optional)
                  <input
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. N9S-MERN-2024-089"
                  />
                </label>
                <label>
                  Display Order
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    min="1"
                  />
                </label>
              </div>

              <label>
                Verification / Credential URL (Optional)
                <input
                  type="url"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                  placeholder="https://..."
                />
              </label>

              <label>
                Description / Skills Covered (Optional)
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of skills, achievements, or training covered in this certificate."
                />
              </label>

              {/* Image Upload Dropzone & Preview */}
              <div>
                <label style={{ marginBottom: "0.35rem" }}>Certificate Image / Scan</label>
                <div
                  style={{
                    border: "2px dashed var(--adm-border2)",
                    borderRadius: 12,
                    padding: "1.2rem",
                    textAlign: "center",
                    background: "var(--adm-surface2)",
                  }}
                >
                  {imagePreview ? (
                    <div>
                      <div
                        style={{
                          height: 200,
                          borderRadius: 8,
                          overflow: "hidden",
                          background: "#05070d",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "0.8rem",
                        }}
                      >
                        <img
                          src={mediaUrl(imagePreview)}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
                        <label
                          className="adm-btn ghost"
                          style={{ margin: 0, cursor: "pointer", fontSize: "0.78rem" }}
                        >
                          Replace Image
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            style={{ display: "none" }}
                            onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                          />
                        </label>
                        <button
                          type="button"
                          className="adm-btn danger"
                          style={{ fontSize: "0.78rem" }}
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                            setImageUrl("");
                          }}
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>📁</div>
                      <strong style={{ display: "block", fontSize: "0.88rem", color: "var(--adm-txt)" }}>
                        Upload Certificate Scan or Image
                      </strong>
                      <p style={{ fontSize: "0.75rem", color: "var(--adm-muted)", margin: "0.3rem 0 0.8rem" }}>
                        JPG, PNG, or WEBP • Maximum 10 MB
                      </p>
                      <label
                        className="adm-btn ghost"
                        style={{ display: "inline-flex", margin: 0, cursor: "pointer", fontSize: "0.82rem" }}
                      >
                        Choose Image File
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          style={{ display: "none" }}
                          onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured toggle */}
              <label className="adm-checkbox-row" style={{ marginTop: "0.4rem" }}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Feature this certificate prominently on the public portfolio
              </label>

              {/* Modal Buttons */}
              <div style={{ display: "flex", gap: "0.7rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button
                  type="button"
                  className="adm-btn ghost"
                  onClick={() => setModalOpen(false)}
                  disabled={busy}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-btn-primary"
                  disabled={busy}
                >
                  {busy ? (uploadProgress ? "Uploading Image…" : "Saving…") : editIndex !== null ? "Save Changes" : "Save Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Lightbox Modal */}
      {viewItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(10px)",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setViewItem(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: 800,
              width: "100%",
              background: "var(--adm-surface)",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--adm-border)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.4rem",
                borderBottom: "1px solid var(--adm-border)",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--adm-txt)" }}>
                  {viewItem.title}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "var(--adm-accent)" }}>
                  {viewItem.organization} {viewItem.issueDate && `• ${viewItem.issueDate}`}
                </span>
              </div>
              <button
                type="button"
                className="adm-btn-icon"
                onClick={() => setViewItem(null)}
              >
                ✕
              </button>
            </div>

            {/* Lightbox Image */}
            <div
              style={{
                padding: "1.2rem",
                background: "#020408",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxHeight: "65vh",
                overflow: "auto",
              }}
            >
              <img
                src={mediaUrl(viewItem.imageUrl)}
                alt={viewItem.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  objectFit: "contain",
                  display: "block",
                  borderRadius: 6,
                }}
              />
            </div>

            {/* Lightbox Footer */}
            <div style={{ padding: "1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
              {viewItem.credentialId && (
                <span style={{ fontSize: "0.8rem", color: "var(--adm-muted)" }}>
                  Credential ID: <code style={{ color: "var(--adm-txt)" }}>{viewItem.credentialId}</code>
                </span>
              )}
              {viewItem.certificateUrl && (
                <a
                  href={viewItem.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="adm-btn-primary"
                  style={{ textDecoration: "none", fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                >
                  Verify Credential ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
