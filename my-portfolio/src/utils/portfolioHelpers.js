/** Prefix GridFS paths like /uploads/:id with the API host when the UI is on another origin. */
export function mediaUrl(url) {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (!String(url).startsWith("/uploads")) return url;
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  return `${base}${url}`;
}

export function gmailCompose(email) {
  const to = email || "rajendrakarki0614@gmail.com";
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodeURIComponent("Portfolio inquiry")}&body=${encodeURIComponent("Hi Rajendra,\n\n")}`;
}

export function skillItems(group) {
  return (group?.items || []).map((it) =>
    typeof it === "string" ? { name: it, level: 80 } : { name: it.name || "", level: Number(it.level ?? 80) }
  );
}
