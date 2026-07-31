import { useTilt } from "../hooks/useTilt";
import { addRipple } from "../utils/ripple";
import MagBtn from "./MagBtn";

function ContactCard({ c }) {
  const { ref, onMove, onLeave } = useTilt(7);
  return (
    <a ref={ref} href={c.h} target={c.h.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer"
      className="cd tilt-card" style={{ padding: "1.1rem", textDecoration: "none", display: "block" }} onMouseMove={onMove} onMouseLeave={onLeave}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)"; e.currentTarget.style.background = "rgba(34,211,238,0.04)"; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = "var(--bdr)"; e.currentTarget.style.background = "var(--surf)"; }}>
      <div className="tilt-shine" />
      <p style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--dim)", marginBottom: "0.45rem" }}>{c.l}</p>
      <p style={{ fontSize: "0.78rem", color: "var(--txt)", fontWeight: 500, wordBreak: "break-all" }}>{c.v}</p>
    </a>
  );
}

export default function Contact() {
  const contacts = [
    { l: "Email", v: "rajendrakarki0614@gmail.com", h: "mailto:rajendrakarki0614@gmail.com" },
    { l: "GitHub", v: "karkirajendra", h: "https://github.com/karkirajendra" },
    { l: "LinkedIn", v: "rajendra-karki", h: "https://www.linkedin.com/in/rajendra-karki-316408279" },
  ];

  return (
    <section id="contact" className="sec" style={{ position: "relative", textAlign: "center" }}>
      <div className="cglow" />
      <div className="rv"><p className="eye" style={{ justifyContent: "center" }}>get in touch</p><h2 className="stl">Let's Connect</h2></div>
      <p className="rv" style={{ maxWidth: 520, margin: "-1.5rem auto 2.5rem", fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)" }}>
        Actively looking for internship and entry-level developer opportunities. Have a project or role? Let's talk.
      </p>
      <div className="ctgr rv" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.9rem", maxWidth: 600, margin: "0 auto 2.5rem" }}>
        {contacts.map(c => <ContactCard key={c.l} c={c} />)}
      </div>
      <MagBtn href="mailto:rajendrakarki0614@gmail.com" className="rbtn" onClickCapture={addRipple}
        style={{ background: "linear-gradient(135deg,var(--cyan),#0ea5e9)", color: "#000", fontFamily: "var(--fm)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, padding: "0.9rem 2.2rem", borderRadius: "10px", textDecoration: "none", boxShadow: "0 0 36px rgba(34,211,238,0.35)", gap: "0.5rem" }}>
        ✉ Say Hello
      </MagBtn>
    </section>
  );
}
