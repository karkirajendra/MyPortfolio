import { useState } from "react";

function nid() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function CollectionPage({ title, hint, items, fields, blank, onSave }) {
  const [rows, setRows] = useState(items || []);
  const [msg, setMsg] = useState("");

  const setRow = (i, key, value) => {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  };

  const valueOf = (row, key, type) => {
    if (type === "lines") return (row[key] || []).join("\n");
    return row[key] ?? "";
  };

  const save = async () => {
    const ok = await onSave(rows);
    setMsg(ok ? "Saved" : "Save failed");
  };

  return (
    <section className="adm-block">
      <h1>{title}</h1>
      {hint && <p className="adm-lead">{hint}</p>}
      <div className="adm-toolbar">
        <button type="button" className="adm-btn ghost" onClick={() => setRows((rs) => [...rs, { id: nid(), ...blank }])}>Add</button>
        <button type="button" className="adm-save" onClick={save}>Save {title.toLowerCase()}</button>
        {msg && <span className="adm-ok">{msg}</span>}
      </div>
      {rows.map((row, i) => (
        <div className="adm-item" key={row.id || i}>
          <div className="adm-toolbar">
            <h3>{row.title || row.role || row.degree || row.label || `#${i + 1}`}</h3>
            <button type="button" className="adm-btn danger" onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))}>Remove</button>
          </div>
          {fields.map(([key, label, type]) => (
            <label key={key}>
              {label}
              {type === "textarea" || type === "lines" ? (
                <textarea rows={type === "lines" ? 4 : 3} value={valueOf(row, key, type)} onChange={(e) => {
                  const v = type === "lines" ? e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) : e.target.value;
                  setRow(i, key, v);
                }} />
              ) : (
                <input value={valueOf(row, key)} onChange={(e) => setRow(i, key, e.target.value)} />
              )}
            </label>
          ))}
        </div>
      ))}
    </section>
  );
}
