import { useState } from "react";
import { useTilt } from "../hooks/useTilt";
import { addRipple } from "../utils/ripple";
import MagBtn from "./MagBtn";

function CertCard({ cert, i, onOpen }) {
  const [hov, setHov] = useState(false);
  const { ref, onMove, onLeave: tLeave } = useTilt(6);

  const handleLeave = () => {
    setHov(false);
    tLeave();
  };

  return (
    <div
      ref={ref}
      className={`cd tilt-card rv ${i % 2 === 0 ? "fl" : "fr"}`}
      data-cursor="project"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={handleLeave}
      onMouseMove={onMove}
      style={{
        display: "flex",
        flexDirection: "column",
        boxShadow: hov ? "0 18px 45px rgba(34,211,238,0.15)" : "none",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        borderColor: hov ? "var(--bdr2)" : "var(--bdr)",
        position: "relative",
      }}
    >
      <div className="tilt-shine" />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: cert.featured
            ? "linear-gradient(90deg, var(--cyan), var(--violet))"
            : "linear-gradient(90deg, var(--bdr2), transparent)",
        }}
      />

      {/* Card Content */}
      <div style={{ padding: "1.4rem", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Top Meta: Order & Featured */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
          <span style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dim)" }}>
            {cert.issueDate ? cert.issueDate : `Credential #${i + 1}`}
          </span>
          {cert.featured && (
            <span
              className="pl"
              style={{
                color: "var(--cyan)",
                borderColor: "rgba(34,211,238,0.3)",
                background: "rgba(34,211,238,0.06)",
                fontSize: "0.52rem",
              }}
            >
              ★ Featured
            </span>
          )}
        </div>

        {/* Thumbnail Preview */}
        {cert.imageUrl ? (
          <div
            style={{
              height: 160,
              borderRadius: 10,
              overflow: "hidden",
              background: "var(--surf2)",
              border: "1px solid var(--bdr)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => onOpen(cert)}
          >
            <img
              src={cert.imageUrl}
              alt={cert.title}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                padding: "0.4rem",
                display: "block",
                transition: "transform 0.3s ease",
                transform: hov ? "scale(1.03)" : "scale(1)",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              height: 110,
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed var(--bdr)",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--dim)",
              fontSize: "0.75rem",
              fontFamily: "var(--fm)",
            }}
          >
            <span style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}>📜</span>
            <span>{cert.organization}</span>
          </div>
        )}

        {/* Title & Organization */}
        <h3
          style={{
            fontFamily: "var(--fp)",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "var(--txt)",
            lineHeight: 1.25,
            marginBottom: "0.3rem",
          }}
        >
          {cert.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--fm)",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--cyan)",
            marginBottom: "0.6rem",
          }}
        >
          {cert.organization}
        </p>

        {cert.credentialId && (
          <div style={{ marginBottom: "0.6rem" }}>
            <span
              style={{
                fontFamily: "var(--fm)",
                fontSize: "0.56rem",
                color: "var(--dim)",
                letterSpacing: "0.05em",
              }}
            >
              ID: <code style={{ color: "var(--txt)" }}>{cert.credentialId}</code>
            </span>
          </div>
        )}

        {cert.description && (
          <p
            style={{
              fontSize: "0.83rem",
              lineHeight: 1.65,
              color: "var(--muted)",
              marginBottom: "1.2rem",
              flex: 1,
            }}
          >
            {cert.description}
          </p>
        )}

        {/* Card Action Buttons */}
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "auto", flexWrap: "wrap" }}>
          {cert.imageUrl && (
            <MagBtn
              onClick={() => onOpen(cert)}
              onClickCapture={addRipple}
              className="rbtn"
              data-cursor="btn"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${hov ? "rgba(34,211,238,0.4)" : "var(--bdr)"}`,
                borderRadius: 8,
                padding: "0.58rem 0.8rem",
                fontFamily: "var(--fm)",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: hov ? "var(--cyan)" : "var(--txt)",
                transition: "all 0.2s",
                justifyContent: "center",
              }}
            >
              View Certificate ↗
            </MagBtn>
          )}

          {cert.certificateUrl && (
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--fm)",
                fontSize: "0.6rem",
                color: "var(--dim)",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "0.58rem 0.8rem",
                border: "1px solid var(--bdr)",
                borderRadius: 8,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--cyan)";
                e.currentTarget.style.color = "var(--cyan)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--bdr)";
                e.currentTarget.style.color = "var(--dim)";
              }}
            >
              Verify ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Certificates({ items }) {
  const [modalCert, setModalCert] = useState(null);

  if (!items || items.length === 0) return null;

  // Sort: featured first, then by displayOrder
  const sorted = [...items].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0);
  });

  return (
    <section id="certificates" className="sec">
      <div className="rv">
        <p className="eye">credentials &amp; training</p>
        <h2 className="stl">Certificates &amp; Achievements</h2>
      </div>

      <div
        className="rv"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "1.2rem",
        }}
      >
        {sorted.map((cert, i) => (
          <CertCard key={cert.id || i} cert={cert} i={i} onOpen={setModalCert} />
        ))}
      </div>

      {/* High-Resolution Certificate Lightbox Modal */}
      {modalCert && (
        <div
          className="ovl"
          onClick={() => setModalCert(null)}
          role="dialog"
          aria-modal="true"
          aria-label={modalCert.title}
        >
          <div
            className="mdl"
            style={{ maxWidth: 820, padding: "1.8rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.2rem",
                gap: "1rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: "0.6rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--cyan)",
                    display: "block",
                    marginBottom: "0.3rem",
                  }}
                >
                  {modalCert.organization} {modalCert.issueDate && `• ${modalCert.issueDate}`}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--fp)",
                    fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                    fontWeight: 800,
                    color: "var(--txt)",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {modalCert.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalCert(null)}
                aria-label="Close modal"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--bdr2)",
                  color: "var(--txt)",
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Certificate Image */}
            {modalCert.imageUrl && (
              <div
                style={{
                  background: "#020408",
                  borderRadius: 12,
                  border: "1px solid var(--bdr)",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  maxHeight: "60vh",
                  overflow: "auto",
                  marginBottom: "1.2rem",
                }}
              >
                <img
                  src={modalCert.imageUrl}
                  alt={modalCert.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "55vh",
                    objectFit: "contain",
                    display: "block",
                    borderRadius: 6,
                  }}
                />
              </div>
            )}

            {/* Description & Metadata */}
            {modalCert.description && (
              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.7,
                  color: "var(--muted)",
                  marginBottom: "1.2rem",
                }}
              >
                {modalCert.description}
              </p>
            )}

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.8rem",
                borderTop: "1px solid var(--bdr)",
                paddingTop: "1rem",
              }}
            >
              {modalCert.credentialId ? (
                <span style={{ fontFamily: "var(--fm)", fontSize: "0.68rem", color: "var(--dim)" }}>
                  Credential ID: <code style={{ color: "var(--txt)" }}>{modalCert.credentialId}</code>
                </span>
              ) : (
                <span />
              )}

              <div style={{ display: "flex", gap: "0.6rem" }}>
                {modalCert.certificateUrl && (
                  <a
                    href={modalCert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hbtn"
                    style={{ fontSize: "0.65rem", padding: "0.5rem 1rem", textDecoration: "none" }}
                  >
                    Verify Credential ↗
                  </a>
                )}
                {modalCert.imageUrl && (
                  <a
                    href={modalCert.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hbtn-outline"
                    style={{ fontSize: "0.65rem", padding: "0.5rem 1rem", textDecoration: "none" }}
                  >
                    Open Image ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
