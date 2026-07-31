import { useState, useEffect } from "react";
import MagBtn from "./MagBtn";

const navIds = ["about", "skills", "process", "experience", "projects", "contact"];

export default function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav className={`flex items-center justify-between ${scrolled ? "sc2" : ""}`}>
        <a href="#hero" className="nlogo">
          <div className="lmark">RK</div>
          <span>rajendra<span style={{ color: "var(--cyan)" }}>.</span>dev</span>
        </a>
        <ul className="nlinks flex items-center">
          {navIds.map(id => (
            <li key={id}><a href={`#${id}`} className={active === id ? "act" : ""}>{id}</a></li>
          ))}
          <li>
            <MagBtn href="/resume.pdf" download className="hbtn-outline hnb" data-cursor="btn">Resume</MagBtn>
          </li>
          <li>
            <MagBtn href="mailto:Karkirajenda22@gmail.com" className="hbtn hnb" data-cursor="btn">Hire Me</MagBtn>
          </li>
        </ul>
        <button className="ham" onClick={() => setMob(o => !o)} aria-label="Toggle menu">
          {[0, 1, 2].map(i => <span key={i} className={`hl${mob ? " op" : ""}`} />)}
        </button>
      </nav>

      {mob && (
        <div className="mmenu" onClick={() => setMob(false)}>
          {navIds.map(id => <a key={id} href={`#${id}`}>{id}</a>)}
          <a href="/resume.pdf" download className="hbtn-outline" style={{ fontSize: "0.8rem" }}>Resume</a>
          <a href="mailto:Karkirajenda22@gmail.com" className="hbtn" style={{ fontSize: "0.8rem" }}>Hire Me</a>
        </div>
      )}
    </>
  );
}

export { navIds };
