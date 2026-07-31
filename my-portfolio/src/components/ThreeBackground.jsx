import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function ThreeBackground() {
  const canvasRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let animId;
    let renderer, geo, mat, lineGeo, lineMat;
    let onResize;

    (async () => {
      const THREE = await import("three");
      if (cancelled || !canvasRef.current) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));
      renderer.setSize(W, H);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
      camera.position.z = 55;

      const COUNT = 160;
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const vel = [];

      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 130;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 130;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        vel.push({ x: (Math.random() - 0.5) * 0.015, y: (Math.random() - 0.5) * 0.015 });
        const t = Math.random();
        colors[i * 3] = t < 0.5 ? 0.13 : 0.65;
        colors[i * 3 + 1] = t < 0.5 ? 0.83 : 0.55;
        colors[i * 3 + 2] = t < 0.5 ? 0.93 : 0.98;
      }

      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      mat = new THREE.PointsMaterial({ size: 0.5, transparent: true, opacity: 0.5, vertexColors: true, sizeAttenuation: true });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);

      lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.04 });
      lineGeo = new THREE.BufferGeometry();
      const linePos = new Float32Array(COUNT * COUNT * 6);
      lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);

      const THRESHOLD = 22;

      const animate = () => {
        animId = requestAnimationFrame(animate);
        for (let i = 0; i < COUNT; i++) {
          positions[i * 3] += vel[i].x;
          positions[i * 3 + 1] += vel[i].y;
          if (Math.abs(positions[i * 3]) > 65) vel[i].x *= -1;
          if (Math.abs(positions[i * 3 + 1]) > 65) vel[i].y *= -1;
        }
        geo.attributes.position.needsUpdate = true;

        let li = 0;
        for (let i = 0; i < COUNT; i++) {
          for (let j = i + 1; j < COUNT; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            if (dx * dx + dy * dy < THRESHOLD * THRESHOLD) {
              linePos[li++] = positions[i * 3];
              linePos[li++] = positions[i * 3 + 1];
              linePos[li++] = positions[i * 3 + 2];
              linePos[li++] = positions[j * 3];
              linePos[li++] = positions[j * 3 + 1];
              linePos[li++] = positions[j * 3 + 2];
            }
          }
        }
        for (let i = li; i < linePos.length; i++) linePos[i] = 0;
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.setDrawRange(0, li / 3);

        pts.rotation.y += 0.0003;
        renderer.render(scene, camera);
      };
      animate();

      onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      if (onResize) window.removeEventListener("resize", onResize);
      renderer?.dispose();
      geo?.dispose();
      mat?.dispose();
      lineGeo?.dispose();
      lineMat?.dispose();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}
