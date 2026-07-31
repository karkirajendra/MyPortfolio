import { useState, useEffect } from "react";
import "./styles/global.css";
import { useScrollProg } from "./hooks/useScrollProg";
import { useActiveSection } from "./hooks/useActiveSection";
import { useKonami } from "./hooks/useKonami";
import { useReveal } from "./hooks/useReveal";
import Nav, { navIds } from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Process from "./components/Process";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import ProjectModal from "./components/ProjectModal";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ThreeBackground from "./components/ThreeBackground";
import EasterEgg from "./components/EasterEgg";

export default function App() {
  const prog = useScrollProg();
  const active = useActiveSection(["hero", ...navIds]);
  const [modal, setModal] = useState(null);
  const [konamiActive, konamiClose] = useKonami();
  useReveal();

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

  return (
    <>
      <ThreeBackground />
      <CustomCursor />
      <div id="pgb" style={{ width: `${prog * 100}%` }} />
      <div className="nz" /><div className="gl" /><div className="sc" />

      <Nav active={active} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <Hero />
        <About />
        <Skills />
        <Process />
        <Experience />
        <Projects onOpen={setModal} />
        <Contact />
        <Footer />
      </div>

      {modal && <ProjectModal p={modal} onClose={() => setModal(null)} />}
      {konamiActive && <EasterEgg onClose={konamiClose} />}
    </>
  );
}
