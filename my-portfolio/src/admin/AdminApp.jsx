import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, Route, Routes, useNavigate, useOutletContext } from "react-router-dom";
import { api, clearStoredToken, setStoredToken } from "./api";
import "./admin.css";
import SitePage from "./pages/SitePage";
import SkillsPage from "./pages/SkillsPage";
import EducationPage from "./pages/EducationPage";
import CollectionPage from "./pages/CollectionPage";
import ProjectsPage from "./pages/ProjectsPage";
import PhotosPage from "./pages/PhotosPage";
import CertificatesPage from "./pages/CertificatesPage";
import AccountPage from "./pages/AccountPage";

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    api("/auth/me")
      .then((user) => {
        if (active && user && user.email) {
          nav("/admin", { replace: true });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await api("/auth/login", { method: "POST", json: { email, password } });
      if (res?.token) {
        setStoredToken(res.token);
      }
      nav("/admin");
    } catch (ex) {
      setErr(ex.message || "Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-login">
      <form className="adm-card" onSubmit={submit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className="adm-kicker">Portfolio CMS</p>
          <span className="adm-badge-live">
            <span className="adm-badge-dot" /> Live DB
          </span>
        </div>
        <h1>Admin Sign In</h1>
        <p className="adm-sub">Manage your portfolio content — skills, education, projects, and more.</p>

        {err && <p className="adm-err">{err}</p>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            autoComplete="username"
            required
          />
        </label>

        <label>
          Password
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>

        <label className="adm-checkbox-row">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Show password
        </label>

        <button type="submit" disabled={busy} className="adm-btn-primary">
          {busy ? "Authenticating…" : "Sign in →"}
        </button>
      </form>
    </div>
  );
}

function Shell() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [content, setContent] = useState(null);
  const [err, setErr] = useState("");
  const [dbStatus, setDbStatus] = useState("checking");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("adm-theme") || "dark";
  });

  // Apply theme token to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("adm-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  const load = async () => {
    const data = await api("/content");
    setContent(data);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const user = await api("/auth/me");
        if (!active) return;
        if (user && user.email) {
          setMe(user);
          await load();
          const health = await api("/health").catch(() => ({ ok: false }));
          if (active) setDbStatus(health.ok ? "connected" : "down");
        } else {
          clearStoredToken();
          setMe(false);
        }
      } catch {
        if (active) {
          clearStoredToken();
          setMe(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (me === null) return <div className="adm-boot">Checking authentication…</div>;
  if (!me || !me.email) return <Navigate to="/admin/login" replace />;
  if (!content) return <div className="adm-boot">Loading content from MongoDB…</div>;

  const logout = async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    clearStoredToken();
    nav("/admin/login");
  };

  const save = async (patch) => {
    setErr("");
    try {
      const next = await api("/admin/content", { method: "PATCH", json: patch });
      setContent(next);
      return true;
    } catch (ex) {
      setErr(ex.message || "Save failed");
      return false;
    }
  };

  const portfolioLinks = [
    ["", "📊", "Overview"],
    ["site", "🏠", "Site & About"],
    ["skills", "⚡", "Skills & Levels"],
    ["education", "🎓", "Education"],
    ["experience", "💼", "Experience"],
    ["process", "🔄", "Process"],
    ["projects", "🗂️", "Projects"],
    ["certificates", "📜", "Certificates"],
    ["photos", "🖼️", "Photos & Media"],
  ];

  const securityLinks = [
    ["account", "🔒", "Account & Security"],
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`adm-side-overlay${sidebarOpen ? " open" : ""}`}
        onClick={closeSidebar}
      />

      <div className="adm">
        {/* SIDEBAR */}
        <aside className={`adm-side${sidebarOpen ? " mobile-open" : ""}`}>
          {/* Brand */}
          <div className="adm-brand">
            <div className="adm-brand-avatar">RK</div>
            <div className="adm-brand-info">
              <strong>Portfolio CMS</strong>
              <small title={me.email}>{me.email}</small>
            </div>
          </div>

          {/* DB status badge */}
          <div style={{ paddingBottom: ".65rem", borderBottom: "1px solid var(--adm-border)", marginBottom: ".65rem" }}>
            <span className="adm-badge-live" style={dbStatus !== "connected" ? { background: "rgba(251,113,133,.08)", borderColor: "rgba(251,113,133,.22)", color: "var(--adm-red)" } : {}}>
              <span
                className="adm-badge-dot"
                style={dbStatus !== "connected" ? { background: "var(--adm-red)", boxShadow: "0 0 6px var(--adm-red)" } : {}}
              />
              {dbStatus === "connected" ? "MongoDB Live" : "DB Connecting"}
            </span>
          </div>

          {/* Nav — Portfolio group */}
          <div className="adm-nav-group">
            <div className="adm-nav-label">Portfolio</div>
            <nav>
              {portfolioLinks.map(([to, icon, label]) => (
                <NavLink
                  key={to || "home"}
                  to={to ? `/admin/${to}` : "/admin"}
                  end={!to}
                  onClick={closeSidebar}
                >
                  <span style={{ fontSize: ".9rem" }}>{icon}</span>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Nav — Security group */}
          <div className="adm-nav-group">
            <div className="adm-nav-label">Security</div>
            <nav>
              {securityLinks.map(([to, icon, label]) => (
                <NavLink key={to} to={`/admin/${to}`} onClick={closeSidebar}>
                  <span style={{ fontSize: ".9rem" }}>{icon}</span>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="adm-side-foot">
            <a href="/" target="_blank" rel="noreferrer">
              <span>↗</span> View Live Portfolio
            </a>
            <button type="button" onClick={logout}>
              <span>⏻</span> Sign out
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT WRAPPER */}
        <div className="adm-main-wrap">
          {/* TOPBAR */}
          <header className="adm-topbar">
            <div className="adm-topbar-right">
              <button
                className="adm-hamburger"
                onClick={() => setSidebarOpen(o => !o)}
                aria-label="Toggle navigation"
              >
                ☰
              </button>
            </div>
            <div className="adm-topbar-right">
              <button
                className="adm-theme-btn"
                onClick={toggleTheme}
                aria-label="Toggle light/dark theme"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </header>

          <main className="adm-main">
            {err && <p className="adm-err sticky">{err}</p>}
            <Outlet context={{ content, save, load }} />
          </main>
        </div>
      </div>
    </>
  );
}

function Overview({ content }) {
  const totalSkills = (content.skills || []).reduce(
    (acc, g) => acc + (g.items?.length || 0),
    0
  );

  const stats = [
    ["⚡", totalSkills, "Total skills", "/admin/skills"],
    ["🎓", content.education?.length || 0, "Education entries", "/admin/education"],
    ["💼", content.experience?.length || 0, "Experience roles", "/admin/experience"],
    ["🗂️", content.projects?.length || 0, "Projects", "/admin/projects"],
    ["📜", content.certificates?.length || 0, "Certificates", "/admin/certificates"],
    ["🖼️", content.photos?.length || 0, "Gallery photos", "/admin/photos"],
  ];

  const quickAccess = [
    { icon: "⚡", to: "/admin/skills", title: "Skills & Levels", desc: "Edit skill categories and proficiency levels" },
    { icon: "🎓", to: "/admin/education", title: "Education", desc: "Add or update education history" },
    { icon: "🗂️", to: "/admin/projects", title: "Projects", desc: "Manage projects with cover images" },
    { icon: "📜", to: "/admin/certificates", title: "Certificates", desc: "Manage certificates, credentials, and achievements" },
    { icon: "🖼️", to: "/admin/photos", title: "Photos & Media", desc: "Upload portrait, gallery, and resume" },
    { icon: "🏠", to: "/admin/site", title: "Site & About", desc: "Edit headlines, bio, and social links" },
  ];

  return (
    <section>
      <h1>Portfolio Overview</h1>
      <p className="adm-lead">
        Every edit saves directly to MongoDB and reflects on your live portfolio instantly.
      </p>

      <div className="adm-stats">
        {stats.map(([icon, n, label, to]) => (
          <NavLink key={label} to={to} className="adm-stat">
            <b>{n}</b>
            <span>{icon} {label}</span>
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Quick Access</h2>
        <p className="adm-sub">Jump into any section to make changes:</p>
        <div className="adm-qa-grid">
          {quickAccess.map(({ icon, to, title, desc }) => (
            <NavLink key={to} to={to} className="adm-qa-card">
              <div className="adm-qa-icon">{icon}</div>
              <div className="adm-qa-body">
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
              <span className="adm-qa-arrow">→</span>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessBundle({ content, save }) {
  const [intro, setIntro] = useState(content.site?.processIntro || "");
  const [title, setTitle] = useState(content.site?.processExampleTitle || "");
  const [body, setBody] = useState(content.site?.processExampleBody || "");
  const [msg, setMsg] = useState("");

  return (
    <>
      <section className="adm-block">
        <h1>Process Copy</h1>
        <label>
          Intro text
          <textarea rows={3} value={intro} onChange={(e) => setIntro(e.target.value)} />
        </label>
        <label>
          Real example title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Real example body
          <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
        <button
          type="button"
          className="adm-save"
          onClick={async () => {
            const ok = await save({
              site: { ...content.site, processIntro: intro, processExampleTitle: title, processExampleBody: body },
            });
            setMsg(ok ? "Saved process copy!" : "Save failed");
          }}
        >
          Save process copy
        </button>
        {msg && <span className="adm-ok">{msg}</span>}
      </section>

      <CollectionPage
        title="Process steps"
        items={content.processSteps}
        fields={[
          ["num", "Step number (e.g. 01, 02)"],
          ["icon", "Icon symbol"],
          ["title", "Title"],
          ["tag", "Tag label"],
          ["col", "Accent color"],
          ["desc", "Description", "textarea"],
        ]}
        blank={{ num: "05", icon: "✦", title: "", tag: "", col: "#22d3ee", desc: "" }}
        onSave={(processSteps) => save({ processSteps })}
      />
    </>
  );
}

function SiteRoute() {
  const { content, save } = useOutletContext();
  return <SitePage site={content.site} onSave={(site) => save({ site })} />;
}

function SkillsRoute() {
  const { content, save } = useOutletContext();
  return <SkillsPage skills={content.skills} onSave={(skills) => save({ skills })} />;
}

function EducationRoute() {
  const { content, save } = useOutletContext();
  return <EducationPage education={content.education} onSave={(education) => save({ education })} />;
}

function ExperienceRoute() {
  const { content, save } = useOutletContext();
  return (
    <>
      <CollectionPage
        title="Experience"
        hint="Roles on the public Experience section. Put each bullet on its own line."
        items={content.experience}
        fields={[
          ["when", "Period"],
          ["role", "Role"],
          ["org", "Organization"],
          ["stack", "Stack label"],
          ["col", "Accent color"],
          ["points", "Points (one per line)", "lines"],
        ]}
        blank={{ when: "", role: "", org: "", stack: "", col: "#22d3ee", points: [] }}
        onSave={(experience) => save({ experience })}
      />
      <CollectionPage
        title="Focus areas"
        hint="Sidebar cards next to experience."
        items={content.focusAreas}
        fields={[
          ["icon", "Icon"],
          ["label", "Label"],
          ["desc", "Description", "textarea"],
        ]}
        blank={{ icon: "◈", label: "", desc: "" }}
        onSave={(focusAreas) => save({ focusAreas })}
      />
    </>
  );
}

function ProcessRoute() {
  const { content, save } = useOutletContext();
  return <ProcessBundle content={content} save={save} />;
}

function ProjectsRoute() {
  const { content, save } = useOutletContext();
  return <ProjectsPage projects={content.projects} onSave={(projects) => save({ projects })} />;
}

function CertificatesRoute() {
  const { content, save } = useOutletContext();
  return <CertificatesPage certificates={content.certificates} onSave={(certificates) => save({ certificates })} />;
}

function PhotosRoute() {
  const { content, save, load } = useOutletContext();
  return <PhotosPage content={content} onReload={load} onSave={save} />;
}

function OverviewRoute() {
  const { content } = useOutletContext();
  return <Overview content={content} />;
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<Shell />}>
        <Route index element={<OverviewRoute />} />
        <Route path="site" element={<SiteRoute />} />
        <Route path="skills" element={<SkillsRoute />} />
        <Route path="education" element={<EducationRoute />} />
        <Route path="experience" element={<ExperienceRoute />} />
        <Route path="process" element={<ProcessRoute />} />
        <Route path="projects" element={<ProjectsRoute />} />
        <Route path="certificates" element={<CertificatesRoute />} />
        <Route path="photos" element={<PhotosRoute />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
}
