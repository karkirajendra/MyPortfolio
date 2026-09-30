import { useState } from "react";
import { api } from "../api";

export default function AccountPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (next.length < 8) {
      setErr("New password must be at least 8 characters long.");
      return;
    }
    if (next !== confirm) {
      setErr("New passwords do not match. Please re-enter.");
      return;
    }

    setBusy(true);
    try {
      await api("/admin/password", { method: "POST", json: { current, next } });
      setMsg("Password successfully updated!");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <div className="adm-header">
        <div>
          <h1>Account & Security</h1>
          <p className="adm-lead">
            Update your admin password and view security details. Your credentials control full CMS access.
          </p>
        </div>
      </div>

      <div className="adm-block" style={{ maxWidth: 540 }}>
        <h3>Change Password</h3>
        {err && <p className="adm-err">{err}</p>}
        {msg && <p className="adm-ok-banner">{msg}</p>}

        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: ".9rem", marginTop: ".8rem" }}>
          <label>
            Current password
            <input
              type={showPassword ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter current password"
              required
            />
          </label>

          <label>
            New password (minimum 8 characters)
            <input
              type={showPassword ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Enter new password"
              minLength={8}
              required
            />
          </label>

          <label>
            Confirm new password
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              minLength={8}
              required
            />
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <input
              type="checkbox"
              id="show-pw"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ width: "auto" }}
            />
            <label htmlFor="show-pw" style={{ cursor: "pointer", fontSize: ".82rem" }}>
              Show passwords in plaintext
            </label>
          </div>

          <div className="adm-toolbar" style={{ marginTop: ".5rem" }}>
            <button type="submit" className="adm-save" disabled={busy}>
              {busy ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      </div>

      <div className="adm-block" style={{ maxWidth: 540, marginTop: "1rem" }}>
        <h3>Seeding & Resetting Credentials</h3>
        <p className="adm-sub">
          If you ever forget your password, you can reset it anytime by running the seed command in your terminal:
        </p>
        <pre style={{ background: "#03050a", padding: ".8rem", borderRadius: 8, fontSize: ".8rem", color: "#22d3ee", overflowX: "auto" }}>
          npm run seed -- --reset-admin
        </pre>
        <p style={{ fontSize: ".75rem", color: "#64748b", marginTop: ".4rem" }}>
          Admin email and password are dynamically configured via <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in your environment variables.
        </p>
      </div>
    </section>
  );
}
