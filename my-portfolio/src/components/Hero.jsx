import { useEffect, useRef } from "react";
import { useTyped } from "../hooks/useTyped";
import { useParallax } from "../hooks/useParallax";
import { addRipple } from "../utils/ripple";
import MagBtn from "./MagBtn";
import bundledPortrait from "../assets/rajendra-web.jpg";
import { gmailCompose, mediaUrl } from "../utils/portfolioHelpers";

const emailLinkProps = { target: "_blank", rel: "noopener noreferrer" };

export default function Hero({ site }) {
  const roles = site.typedRoles?.length ? site.typedRoles : ["Full-Stack Developer"];
  const typed = useTyped(roles);
  const GMAIL_COMPOSE = gmailCompose(site.email);
  const portrait = mediaUrl(site.portraitUrl) || bundledPortrait;
  const fullName = `${site.firstName} ${site.lastName}`.trim();
  const resumeHref = mediaUrl(site.resumeUrl) || `${import.meta.env.BASE_URL}resume.pdf`;
  const register = useParallax();
  const orbA = useRef(null);
  const orbB = useRef(null);
  const orbC = useRef(null);

  useEffect(() => {
    register(orbA.current, -0.08);
    register(orbB.current, -0.05);
    register(orbC.current, 0.04);
  }, [register]);

  return (
    <section id="hero" className="hwrap">
      <div ref={orbA} className="orb oa" />
      <div ref={orbB} className="orb ob" />
      <div ref={orbC} className="orb oc" />
      <div style={{ position: "absolute", width: 300, height: 300, top: "10%", right: "5%", borderRadius: "50%", border: "1px solid rgba(34,211,238,0.06)", animation: "spinSlow 20s linear infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 180, height: 180, bottom: "15%", right: "18%", borderRadius: "50%", border: "1px solid rgba(167,139,250,0.07)", animation: "spinSlow 14s linear infinite reverse", pointerEvents: "none" }} />

      <div className="hgrid" style={{ maxWidth: 1120, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "3rem", alignItems: "center" }}>
        <div className="htxt">
          <div className="ha1" style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "100px", padding: "0.32rem 0.9rem 0.32rem 0.55rem", marginBottom: "1.8rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--emerald)", boxShadow: "0 0 8px var(--emerald)", display: "block", animation: "pulsate 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--emerald)" }}>{site.availableText}</span>
          </div>

          <div className="ha2">
            <h1 className="hname" style={{ fontFamily: "var(--fp)", fontSize: "clamp(3.5rem,8vw,6.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.95, color: "var(--txt)", display: "block" }}>{site.firstName}</h1>
            <h1 className="hname gt" style={{ fontFamily: "var(--fp)", fontSize: "clamp(3.5rem,8vw,6.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.95, display: "block", marginBottom: "1.2rem" }}>{site.lastName}</h1>
          </div>

          <div className="ha3" style={{ display: "flex", alignItems: "center", height: "2rem", marginBottom: "1.3rem" }}>
            <span style={{ fontFamily: "var(--fm)", fontSize: "clamp(0.78rem,2vw,0.95rem)", color: "var(--muted)" }}>
              {typed}<span className="typed-c">_</span>
            </span>
          </div>

          <p className="ha4" style={{ maxWidth: 470, fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "1.5rem" }}>
            {site.tagline} <span style={{ color: "var(--cyan)", fontWeight: 600 }}>{site.location}</span>.
          </p>

          <div className="htags ha4" style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "2rem" }}>
            {(site.tags || []).map(t => (
              <span key={t} className="pl" style={{ color: "var(--dim)", borderColor: "var(--bdr)", background: "rgba(255,255,255,0.02)" }}>{t}</span>
            ))}
          </div>

          <div className="hctas ha5" style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginBottom: "2rem" }}>
            <MagBtn href="#projects" data-cursor="btn" onClickCapture={addRipple} className="rbtn hcbtn"
              style={{ background: "linear-gradient(135deg,var(--cyan),#0ea5e9)", color: "#000", fontFamily: "var(--fm)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, padding: "0.8rem 1.8rem", borderRadius: "9px", textDecoration: "none", boxShadow: "0 0 28px rgba(34,211,238,0.3)", gap: "0.4rem" }}>
              View Projects ↓
            </MagBtn>
            <MagBtn href={resumeHref} target="_blank" rel="noopener noreferrer" data-cursor="btn" onClickCapture={addRipple} className="hcbtn rbtn"
              style={{ color: "var(--txt)", fontFamily: "var(--fm)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", padding: "0.8rem 1.8rem", borderRadius: "9px", textDecoration: "none", border: "1px solid var(--bdr2)", gap: "0.4rem" }}>
              View CV ↗
            </MagBtn>
            <MagBtn href={resumeHref} download={site.resumeDownloadName || "Resume.pdf"} data-cursor="btn" onClickCapture={addRipple} className="hcbtn rbtn"
              style={{ color: "var(--txt)", fontFamily: "var(--fm)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", padding: "0.8rem 1.8rem", borderRadius: "9px", textDecoration: "none", border: "1px solid var(--bdr2)", gap: "0.4rem" }}>
              Download CV ↓
            </MagBtn>
            <MagBtn href={GMAIL_COMPOSE} {...emailLinkProps} className="hcbtn rbtn" onClickCapture={addRipple}
              style={{ color: "var(--txt)", fontFamily: "var(--fm)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", padding: "0.8rem 1.8rem", borderRadius: "9px", textDecoration: "none", border: "1px solid var(--bdr2)", gap: "0.4rem" }}>
              Say Hello →
            </MagBtn>
          </div>

          <div className="hsoc ha6" style={{ display: "flex", gap: "1.4rem", alignItems: "center" }}>
            {[{ l: "GitHub", h: site.github }, { l: "LinkedIn", h: site.linkedin }, { l: "Email", h: GMAIL_COMPOSE }].map(s => (
              <a key={s.l} href={s.h} {...emailLinkProps}
                style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dim)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => { e.target.style.color = "var(--cyan)"; }}
                onMouseLeave={e => { e.target.style.color = "var(--dim)"; }}>
                {s.l}
              </a>
            ))}
          </div>
        </div>

        <div className="hcard haC">
          <div className="cd" style={{ padding: "1.2rem", backdropFilter: "blur(10px)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top right,rgba(34,211,238,0.07),transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.2rem" }}>
                <div style={{ position: "relative", marginBottom: "0.9rem", width: "100%" }}>
                  <div style={{ position: "absolute", inset: -3, borderRadius: "18px", background: "linear-gradient(135deg,var(--cyan),var(--violet))", opacity: 0.35, filter: "blur(10px)", animation: "pulsate 3s ease-in-out infinite" }} />
                  <img
                    src={portrait}
                    alt={fullName}
                    width={400}
                    height={500}
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "4 / 5",
                      objectFit: "cover",
                      objectPosition: "center top",
                      borderRadius: "16px",
                      border: "1px solid rgba(34,211,238,0.25)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
                      display: "block",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--txt)", fontSize: "0.95rem" }}>{fullName}</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: "0.56rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.2rem" }}>{site.role}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
                {(site.cardStats || []).map(({ value: v, label: l }) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "0.7rem 0.3rem", textAlign: "center", border: "1px solid var(--bdr)", transition: "all 0.25s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bdr)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div className="cnum" style={{ fontSize: "1.2rem" }}>{v}</div>
                    <div style={{ fontFamily: "var(--fm)", fontSize: "0.5rem", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.15rem" }}>{l}</div>
                  </div>
                ))}
              </div>
              {[["📍 Location", site.location], ["🎓 Education", site.educationLine]].map(([k, v]) => (
                <div key={k} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 9, padding: "0.65rem 0.9rem", marginBottom: "0.5rem", border: "1px solid var(--bdr)" }}>
                  <div style={{ fontFamily: "var(--fm)", fontSize: "0.54rem", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{k}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--txt)", fontWeight: 500 }}>{v}</div>
                </div>
              ))}
              <div style={{ background: "rgba(52,211,153,0.06)", borderRadius: 9, padding: "0.55rem 0.9rem", border: "1px solid rgba(52,211,153,0.18)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", boxShadow: "0 0 8px var(--emerald)", display: "block", animation: "pulsate 2s infinite", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--fm)", fontSize: "0.58rem", color: "var(--emerald)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{site.openToWorkText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", animation: "float 3s ease-in-out infinite" }}>
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--dim)" }}>scroll</span>
        <svg width="1" height="36" viewBox="0 0 1 36"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><line x1="0.5" y1="0" x2="0.5" y2="36" stroke="url(#sg)" strokeWidth="1" /></svg>
      </div>

      <div style={{ position: "absolute", bottom: "1.5rem", right: "2rem", fontFamily: "var(--fm)", fontSize: "0.44rem", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>
        try: ↑↑↓↓←→←→ba
      </div>
    </section>
  );
}
