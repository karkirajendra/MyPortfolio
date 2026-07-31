import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function compressPhoto() {
  const src = join(root, "src/assets/rajendra.JPG");
  const outJpg = join(root, "src/assets/rajendra-web.jpg");
  await sharp(src)
    .rotate()
    .resize(800, 1000, { fit: "cover", position: "top" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outJpg);
  console.log("Wrote", outJpg);
}

async function buildResume() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]); // Letter
  const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const ink = rgb(0.08, 0.1, 0.14);
  const muted = rgb(0.35, 0.4, 0.48);
  const accent = rgb(0.05, 0.55, 0.65);
  const line = rgb(0.85, 0.88, 0.92);

  let y = 752;
  const left = 48;
  const width = 516;

  const drawText = (text, x, yy, size, font, color = ink) => {
    page.drawText(text, { x, y: yy, size, font, color });
  };

  const section = (title) => {
    y -= 8;
    drawText(title.toUpperCase(), left, y, 10, helveticaBold, accent);
    y -= 6;
    page.drawLine({ start: { x: left, y }, end: { x: left + width, y }, thickness: 1, color: line });
    y -= 16;
  };

  // Header
  drawText("RAJENDRA KARKI", left, y, 22, helveticaBold, ink);
  y -= 18;
  drawText("Full-Stack Developer", left, y, 12, helvetica, accent);
  y -= 16;
  drawText("Kathmandu, Nepal  ·  rajendrakarki0614@gmail.com", left, y, 9, helvetica, muted);
  y -= 12;
  drawText("github.com/karkirajendra  ·  linkedin.com/in/rajendra-karki-316408279", left, y, 9, helvetica, muted);
  y -= 22;

  section("Summary");
  const summary =
    "BCA student (7th semester, Tribhuvan University) and full-stack developer building production-ready web apps with MERN, Laravel, and Vue.js. Focused on clean UI, reliable APIs, and shipping end-to-end features.";
  const wrap = (text, maxChars = 95) => {
    const words = text.split(" ");
    const lines = [];
    let cur = "";
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (next.length > maxChars) {
        lines.push(cur);
        cur = w;
      } else cur = next;
    }
    if (cur) lines.push(cur);
    return lines;
  };
  for (const ln of wrap(summary)) {
    drawText(ln, left, y, 9.5, helvetica, ink);
    y -= 13;
  }
  y -= 6;

  section("Skills");
  const skillLines = [
    "Frontend: React.js, Vue.js 3, Tailwind CSS, Bootstrap, HTML5, CSS3",
    "Backend: Node.js, Express.js, Laravel, PHP",
    "Databases: MongoDB, MySQL, SQLite",
    "Languages: JavaScript, PHP, Java, C, C#",
    "Tools: Git, GitHub, Vite, JWT Auth, REST APIs, Cloudinary",
  ];
  for (const ln of skillLines) {
    drawText(ln, left, y, 9.5, helvetica, ink);
    y -= 13;
  }
  y -= 4;

  section("Experience");
  drawText("Full-Stack Developer — Independent Projects", left, y, 10, helveticaBold, ink);
  drawText("2025 — Present", left + 360, y, 9, helvetica, muted);
  y -= 14;
  for (const b of [
    "Built JWT role-based auth, dashboards, and REST APIs across multiple apps.",
    "Shipped production workflows: uploads, search, booking, and admin analytics.",
  ]) {
    drawText(`•  ${b}`, left, y, 9.5, helvetica, ink);
    y -= 13;
  }
  y -= 6;
  drawText("MERN Stack Training — N9-Solution", left, y, 10, helveticaBold, ink);
  drawText("2024 — 2025", left + 360, y, 9, helvetica, muted);
  y -= 14;
  for (const b of [
    "Strengthened React patterns, API design, and modern tooling (Vite, Git).",
    "Delivered full-stack assignments with authentication, CRUD, and deployment basics.",
  ]) {
    drawText(`•  ${b}`, left, y, 9.5, helvetica, ink);
    y -= 13;
  }
  y -= 4;

  section("Projects");
  const projects = [
    {
      title: "RoomSathi — Property Rental Platform (MERN)",
      bullets: [
        "Marketplace with 3-role JWT auth, advanced search, Cloudinary uploads, booking flow.",
        "Admin analytics dashboard and 50+ REST API endpoints.",
        "GitHub: github.com/karkirajendra/sixthSem-project",
      ],
    },
    {
      title: "Appointment System — Booking Management (Laravel)",
      bullets: [
        "Dual auth for owners/customers, calendar booking, conflict detection, roster management.",
        "GitHub: github.com/karkirajendra/Apointment-System",
      ],
    },
    {
      title: "Futech — Blog Platform (Laravel + Vue.js 3)",
      bullets: [
        "Decoupled REST API + Vue SPA with full blog CRUD and Vite-based development.",
        "GitHub: github.com/karkirajendra/futech_project",
      ],
    },
    {
      title: "Expense Tracker — Personal Finance (PHP + MySQL)",
      bullets: [
        "Daily/weekly/monthly categorization, transaction history, and summary reports.",
      ],
    },
  ];
  for (const p of projects) {
    drawText(p.title, left, y, 10, helveticaBold, ink);
    y -= 13;
    for (const b of p.bullets) {
      for (const ln of wrap(`•  ${b}`, 92)) {
        drawText(ln, left, y, 9, helvetica, ink);
        y -= 12;
      }
    }
    y -= 6;
  }

  section("Education");
  drawText("Bachelor of Computer Applications (BCA) — Tribhuvan University", left, y, 10, helveticaBold, ink);
  y -= 13;
  drawText("7th Semester  ·  Kathmandu, Nepal", left, y, 9.5, helvetica, muted);
  y -= 28;

  drawText("References available upon request.", left, y, 8.5, helvetica, muted);

  const bytes = await pdf.save();
  const out = join(root, "public/resume.pdf");
  writeFileSync(out, bytes);
  console.log("Wrote", out, `(${bytes.length} bytes)`);
}

await compressPhoto();
await buildResume();
