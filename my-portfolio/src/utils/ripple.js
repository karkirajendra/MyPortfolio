export function addRipple(e) {
  const btn = e.currentTarget;
  const r = document.createElement("span");
  r.className = "rip";
  const rect = btn.getBoundingClientRect();
  r.style.left = `${e.clientX - rect.left}px`;
  r.style.top = `${e.clientY - rect.top}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 700);
}
