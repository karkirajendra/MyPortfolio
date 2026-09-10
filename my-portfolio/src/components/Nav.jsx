import { useState, useEffect } from "react";
import MagBtn from "./MagBtn";
import { navIds } from "../utils/navigation";

export default function Nav({ active, site, hasEducation, hasCertificates, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const resumeHref = site?.resumeUrl || `${import.meta.env.BASE_URL}resume.pdf`;
  const resumeName = site?.resumeDownloadName || "Resume.pdf";
  const ids = navIds.filter((id) => {
    if (id === "education" && hasEducation === false) return false;
    if (id === "certificates" && hasCertificates === false) return false;
    return true;
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav className={`portfolio-nav flex items-center justify-between ${scrolled ? "sc2" : ""}`}>
        <a href="#hero" className="nlogo">
          <div className="lmark">{site?.initials || "RK"}</div>
          <span>{site?.brand || "rajendra.dev"}</span>
        </a>
        <ul className="nlinks flex items-center">
          {ids.map(id => (
            <li key={id}><a href={`#${id}`} className={active === id ? "act" : ""}>{id}</a></li>
          ))}
          <li>
            <MagBtn href={resumeHref} target="_blank" rel="noopener noreferrer" className="hbtn-outline hnb" data-cursor="btn">
              View CV ↗
            </MagBtn>
          </li>
          <li>
            <MagBtn href={resumeHref} download={resumeName} className="hbtn hnb" data-cursor="btn">
              Download CV ↓
            </MagBtn>
          </li>
          <li>
            <button
              className="pf-theme-btn hnb"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Theme toggle: visible on mobile (when .hnb items are hidden) */}
          <button
            className="pf-theme-btn ham"
            style={{ display: "none", border: "1px solid var(--bdr2)" }}
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="ham" onClick={() => setMob(o => !o)} aria-label="Toggle menu">
            {[0, 1, 2].map(i => <span key={i} className={`hl${mob ? " op" : ""}`} />)}
          </button>
        </div>
      </nav>

      {mob && (
        <div className="mmenu" onClick={() => setMob(false)}>
          {ids.map(id => <a key={id} href={`#${id}`}>{id}</a>)}
          <a href={resumeHref} target="_blank" rel="noopener noreferrer" className="hbtn-outline" style={{ fontSize: "0.8rem" }}>
            View CV ↗
          </a>
          <a href={resumeHref} download={resumeName} className="hbtn" style={{ fontSize: "0.8rem" }}>
            Download CV ↓
          </a>
          <button
            className="pf-theme-btn"
            onClick={(e) => { e.stopPropagation(); onToggleTheme(); }}
            style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
        </div>
      )}
    </>
  );
}
