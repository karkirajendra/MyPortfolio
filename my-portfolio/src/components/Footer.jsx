export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--bdr)", padding: "1.8rem clamp(1rem,4vw,3rem)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", color: "var(--dim)" }}>Designed & Built by <span style={{ color: "var(--cyan)" }}>Rajendra Karki</span></span>
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", color: "var(--dim)" }}>Kathmandu, Nepal · {new Date().getFullYear()}</span>
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.52rem", color: "var(--dim)", opacity: 0.5 }}>↑↑↓↓←→←→ba 🎮</span>
      </div>
    </footer>
  );
}
