import { useRef } from "react";

export default function MagBtn({ children, style, className, onClick, href, target, rel, onClickCapture, download }) {
  const btnRef = useRef(null);
  const onMove = (e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.28;
    const dy = (e.clientY - cy) * 0.28;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
  };
  const onLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0) scale(1)";
  };
  const baseStyle = { transition: "transform 0.2s ease, box-shadow 0.25s ease", display: "inline-flex", alignItems: "center", ...style };

  if (href) {
    return (
      <a ref={btnRef} href={href} target={target} rel={rel} download={download} style={baseStyle} className={className}
        onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} onClickCapture={onClickCapture}>{children}</a>
    );
  }
  return (
    <button ref={btnRef} style={baseStyle} className={className}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} onClickCapture={onClickCapture}>{children}</button>
  );
}
