import { useState, useEffect } from "react";
import "./styles/global.css";
import { useScrollProg } from "./hooks/useScrollProg";
import { useActiveSection } from "./hooks/useActiveSection";
import { useKonami } from "./hooks/useKonami";
import { useReveal } from "./hooks/useReveal";
import { ContentProvider } from "./content/ContentContext";
import { useContent } from "./content/useContent";
import Nav from "./components/Nav";
import { navIds } from "./utils/navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Process from "./components/Process";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import ProjectModal from "./components/ProjectModal";
import Certificates from "./components/Certificates";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ThreeBackground from "./components/ThreeBackground";
import EasterEgg from "./components/EasterEgg";

function Portfolio() {
  const { content } = useContent();
  const site = content.site;
  const prog = useScrollProg();
  const active = useActiveSection(["hero", ...navIds]);
  const [modal, setModal] = useState(null);
  const [konamiActive, konamiClose] = useKonami();
  useReveal();

  // ── Portfolio light/dark theme ──────────────────────────────
  const [pfTheme, setPfTheme] = useState(
    () => localStorage.getItem("pf-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", pfTheme);
    localStorage.setItem("pf-theme", pfTheme);
  }, [pfTheme]);

  const togglePfTheme = () => setPfTheme(t => (t === "dark" ? "light" : "dark"));
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = (modal || konamiActive) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal, konamiActive]);

  useEffect(() => {
    if (!modal) return;
    const fn = (e) => { if (e.key === "Escape") setModal(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [modal]);

  useEffect(() => {
    const name = `${site.firstName} ${site.lastName}`.trim();
    if (name) document.title = `${name} | ${site.role || "Portfolio"}`;
  }, [site.firstName, site.lastName, site.role]);

  return (
    <>
      <ThreeBackground />
      <CustomCursor />
      <div id="pgb" style={{ width: `${prog * 100}%` }} />
      <div className="nz" /><div className="gl" /><div className="sc" />

      <Nav
        active={active}
        site={site}
        hasEducation={content.education?.length > 0}
        hasCertificates={content.certificates?.length > 0}
        theme={pfTheme}
        onToggleTheme={togglePfTheme}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <Hero site={site} />
        <About site={site} photos={content.photos} />
        <Education items={content.education} />
        <Skills groups={content.skills} />
        <Process
          steps={content.processSteps}
          intro={site.processIntro}
          exampleTitle={site.processExampleTitle}
          exampleBody={site.processExampleBody}
        />
        <Experience items={content.experience} focusAreas={content.focusAreas} />
        <Projects items={content.projects} onOpen={setModal} />
        <Certificates items={content.certificates} />
        <Contact site={site} />
        <Footer site={site} />
      </div>

      {modal && <ProjectModal p={modal} onClose={() => setModal(null)} />}
      {konamiActive && <EasterEgg onClose={konamiClose} />}
    </>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <Portfolio />
    </ContentProvider>
  );
}
