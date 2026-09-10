/** Seed payload matching the current public portfolio. */

export const defaultSite = {
  firstName: "Rajendra",
  lastName: "Karki",
  initials: "RK",
  brand: "rajendra.dev",
  role: "Full-Stack Developer",
  location: "Kathmandu, Nepal",
  educationLine: "BCA 7th Sem · TU",
  available: true,
  availableText: "Available for opportunities",
  openToWorkText: "Open to work",
  tagline:
    "Building production-ready web apps with clean UI and reliable backend workflows. Based in",
  typedRoles: [
    "Full-Stack Developer",
    "MERN Stack Engineer",
    "Laravel Developer",
    "Vue.js Enthusiast",
    "Problem Solver",
  ],
  tags: ["MERN Stack", "Laravel", "Vue.js 3", "REST APIs"],
  bio: [
    "I'm a motivated BCA student in my 7th semester at Tribhuvan University — with a passion for building web apps that people actually use.",
    "Deep experience with MERN stack, Laravel, and Vue.js — shipped multiple production-ready projects from rental platforms to booking systems.",
    "I thrive at the intersection of clean code and intuitive design, constantly leveling up my craft.",
  ],
  certs: ["★ MERN Stack Training — N9-Solution", "★ Git & GitHub Basics"],
  stats: [
    { n: 4, suffix: "+", label: "Projects Shipped", desc: "Full-stack production apps." },
    { n: 50, suffix: "+", label: "API Endpoints", desc: "Designed & documented." },
    { n: 7, suffix: "th", label: "Semester", desc: "Tribhuvan University, BCA." },
    { n: 2, suffix: "+", label: "Years Coding", desc: "Building and shipping daily." },
  ],
  cardStats: [
    { value: "4", label: "Projects" },
    { value: "50+", label: "APIs" },
    { value: "2+", label: "Years" },
  ],
  email: "rajendrakarki0614@gmail.com",
  github: "https://github.com/karkirajendra",
  githubLabel: "karkirajendra",
  linkedin: "https://www.linkedin.com/in/rajendra-karki-316408279",
  linkedinLabel: "rajendra-karki",
  contactBlurb:
    "Actively looking for internship and entry-level developer opportunities. Have a project or role? Let's talk.",
  processIntro:
    "Every project follows a deliberate mental model — from raw problem to shipped product. Here's the process behind the code.",
  processExampleTitle: "Real example — RoomSathi",
  processExampleBody:
    "Problem: Finding rooms in Kathmandu is fragmented and low-trust. Approach: Designed 3-role auth first, then built search → booking → admin analytics as independent modules. Result: 50+ API endpoints, shipped in 1 semester.",
  resumeUrl: "/resume.pdf",
  resumeDownloadName: "Rajendra-Karki-Resume.pdf",
  portraitUrl: "",
  aboutPhotoUrl: "",
};

export const defaultSkills = [
  {
    label: "Frontend",
    col: "#22d3ee",
    bg: "rgba(34,211,238,0.06)",
    bd: "rgba(34,211,238,0.22)",
    items: [
      { name: "React.js", level: 90 },
      { name: "Vue.js 3", level: 82 },
      { name: "Tailwind CSS", level: 88 },
      { name: "Bootstrap", level: 80 },
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 92 },
    ],
  },
  {
    label: "Backend",
    col: "#34d399",
    bg: "rgba(52,211,153,0.06)",
    bd: "rgba(52,211,153,0.22)",
    items: [
      { name: "Node.js", level: 86 },
      { name: "Express.js", level: 85 },
      { name: "Laravel", level: 78 },
      { name: "PHP", level: 80 },
    ],
  },
  {
    label: "Database",
    col: "#a78bfa",
    bg: "rgba(167,139,250,0.06)",
    bd: "rgba(167,139,250,0.22)",
    items: [
      { name: "MongoDB", level: 84 },
      { name: "MySQL", level: 80 },
      { name: "SQLite", level: 72 },
    ],
  },
  {
    label: "Languages",
    col: "#fbbf24",
    bg: "rgba(251,191,36,0.06)",
    bd: "rgba(251,191,36,0.22)",
    items: [
      { name: "JavaScript", level: 90 },
      { name: "PHP", level: 80 },
      { name: "Java", level: 65 },
      { name: "C", level: 60 },
      { name: "C#", level: 58 },
    ],
  },
  {
    label: "Tools & Others",
    col: "#fb7185",
    bg: "rgba(251,113,133,0.06)",
    bd: "rgba(251,113,133,0.22)",
    items: [
      { name: "Git", level: 85 },
      { name: "GitHub", level: 85 },
      { name: "Vite", level: 80 },
      { name: "JWT Auth", level: 82 },
      { name: "REST APIs", level: 88 },
      { name: "Cloudinary", level: 75 },
      { name: "XAMPP", level: 70 },
    ],
  },
];

export const defaultEducation = [
  {
    id: "edu-1",
    when: "2022 — Present",
    degree: "Bachelor of Computer Application (BCA)",
    school: "Tribhuvan University",
    detail: "7th semester — focused on full-stack web development and software engineering.",
    col: "#22d3ee",
  },
];

export const defaultExperience = [
  {
    id: "exp-1",
    when: "2025 — Present",
    role: "Full-Stack Developer",
    org: "Independent Projects",
    stack: "MERN · Laravel · Vue",
    col: "#22d3ee",
    points: [
      "Built role-based auth systems (JWT), dashboards, and REST APIs across multiple apps.",
      "Focused on performance, clean UI, and production-ready workflows (uploads, search, payments).",
    ],
  },
  {
    id: "exp-2",
    when: "2024 — 2025",
    role: "MERN Stack Training",
    org: "N9-Solution",
    stack: "React · Node · MongoDB",
    col: "#34d399",
    points: [
      "Strengthened React patterns, API design, and modern tooling (Vite, Git/GitHub).",
      "Delivered full-stack assignments with authentication, CRUD, and deployment basics.",
    ],
  },
];

export const defaultFocusAreas = [
  { id: "fa-1", icon: "◈", label: "Product UI", desc: "Accessible, responsive, polished interfaces." },
  { id: "fa-2", icon: "◫", label: "APIs", desc: "Pragmatic REST with auth & validation." },
  { id: "fa-3", icon: "⟳", label: "Delivery", desc: "Fast iteration: Vite + Git + clean commits." },
];

export const defaultProcess = [
  {
    id: "pr-1",
    num: "01",
    icon: "◈",
    title: "Understand the Problem",
    col: "#22d3ee",
    desc: "I start by defining who the user is and what's actually painful for them. No code yet — just clarity on the core problem worth solving.",
    tag: "Research",
  },
  {
    id: "pr-2",
    num: "02",
    icon: "◫",
    title: "Design the Architecture",
    col: "#a78bfa",
    desc: "Plan the data model, API surface, and component structure before writing a line. Clean architecture decisions compound — messy ones compound too.",
    tag: "Planning",
  },
  {
    id: "pr-3",
    num: "03",
    icon: "⟳",
    title: "Build & Iterate",
    col: "#34d399",
    desc: "Ship a working core fast. Get feedback. Layer on polish. Vite + Git mean I can iterate in hours, not days.",
    tag: "Development",
  },
  {
    id: "pr-4",
    num: "04",
    icon: "✦",
    title: "Deliver & Document",
    col: "#fbbf24",
    desc: "Clean code, clear commits, and a README that makes handoff painless. Shipped work > perfect work-in-progress.",
    tag: "Delivery",
  },
];

export const defaultProjects = [
  {
    id: "proj-1",
    num: "01",
    title: "RoomSathi",
    subtitle: "Property Rental Platform",
    desc: "Full-stack MERN rental marketplace connecting room seekers with landlords. JWT auth with 3 roles, advanced property search, Cloudinary image uploads, booking workflow with payments, and an admin analytics dashboard across 50+ REST API endpoints.",
    story: {
      problem: "Finding rooms in Kathmandu is messy: scattered listings, low trust, and slow communication.",
      solution: "A product-style marketplace with role-based flows for seekers, landlords, and admins — search, media, booking, and analytics in one place.",
      highlights: [
        "JWT auth with 3 roles + protected routes",
        "Advanced search + filters for fast discovery",
        "Cloudinary uploads with safe media workflow",
        "Booking workflow and admin analytics dashboard",
      ],
    },
    tech: ["Node.js", "Express", "MongoDB", "React"],
    github: "https://github.com/karkirajendra/sixthSem-project",
    demo: "",
    badge: "MERN Stack",
    ca: "#22d3ee",
    cb: "#0ea5e9",
    featured: true,
    image: "",
  },
  {
    id: "proj-2",
    num: "02",
    title: "Appointment System",
    subtitle: "Booking Management",
    desc: "Laravel scheduling system for salons, clinics & businesses. Dual auth for owners and customers, calendar-based booking, automated conflict detection, employee roster management, and timezone-aware scheduling.",
    story: {
      problem: "Manual scheduling causes double-bookings, missed appointments, and no visibility for owners.",
      solution: "A calendar-first system with dual auth, conflict detection, and clear business controls.",
      highlights: [
        "Dual auth for owners + customers",
        "Calendar-based booking with conflict prevention",
        "Employee roster management",
        "Timezone-aware scheduling",
      ],
    },
    tech: ["Laravel 5.4", "Bootstrap", "MySQL"],
    github: "https://github.com/karkirajendra/Apointment-System",
    demo: "",
    badge: "",
    ca: "#34d399",
    cb: "#0ea5e9",
    featured: false,
    image: "",
  },
  {
    id: "proj-3",
    num: "03",
    title: "Futech",
    subtitle: "Modern Blog Platform",
    desc: "Decoupled blogging platform with a Laravel REST API backend and Vue.js 3 SPA frontend. Independent deployment, Vite HMR for fast development, pnpm package management, and full blog CRUD operations.",
    story: {
      problem: "Traditional monolith blog setups are harder to scale and iterate on the frontend.",
      solution: "A decoupled architecture: Laravel REST API + Vue SPA for fast, independent development.",
      highlights: [
        "Decoupled API + SPA architecture",
        "Full blog CRUD flow",
        "Fast dev experience with Vite HMR",
        "Deployable as separate frontend/backend services",
      ],
    },
    tech: ["Laravel", "Vue.js 3", "Vite"],
    github: "https://github.com/karkirajendra/futech_project",
    demo: "",
    badge: "",
    ca: "#a78bfa",
    cb: "#fb7185",
    featured: false,
    image: "",
  },
  {
    id: "proj-4",
    num: "04",
    title: "Expense Tracker",
    subtitle: "Personal Finance Tool",
    desc: "Web-based personal finance tracker with daily/weekly/monthly expense categorization, transaction history, summary reports, and clean CRUD interface built with core PHP and MySQL.",
    story: {
      problem: "Most expense notes don't convert to insight — people need summaries, categories, and history.",
      solution: "A simple CRUD app with categories and summaries that makes spending patterns visible.",
      highlights: [
        "Daily/weekly/monthly categorization",
        "Transaction history with summaries",
        "Clean CRUD experience",
        "Simple, reliable PHP + MySQL stack",
      ],
    },
    tech: ["PHP", "MySQL", "HTML", "CSS"],
    github: "",
    demo: "",
    badge: "",
    ca: "#fbbf24",
    cb: "#fb7185",
    featured: false,
    image: "",
  },
];

export const defaultCertificates = [
  {
    id: "cert-1",
    title: "MERN Stack Web Development",
    organization: "N9-Solution",
    issueDate: "2024-12-15",
    credentialId: "N9S-MERN-2024-089",
    description: "Intensive hands-on professional training in full-stack JavaScript: React.js, Node.js, Express.js, MongoDB, JWT auth, and production API design.",
    imageUrl: "",
    certificateUrl: "https://github.com/karkirajendra",
    displayOrder: 1,
    featured: true,
  },
  {
    id: "cert-2",
    title: "Git & GitHub Version Control Essentials",
    organization: "Independent Assessment",
    issueDate: "2024-05-10",
    credentialId: "GIT-VCS-2024-412",
    description: "Mastery of branching workflows, pull requests, merge conflict resolution, CI/CD pipeline fundamentals, and open-source collaboration.",
    imageUrl: "",
    certificateUrl: "https://github.com/karkirajendra",
    displayOrder: 2,
    featured: true,
  },
];

export function buildDefaultStore(admin) {
  return {
    admin,
    site: defaultSite,
    skills: defaultSkills,
    education: defaultEducation,
    experience: defaultExperience,
    focusAreas: defaultFocusAreas,
    processSteps: defaultProcess,
    projects: defaultProjects,
    photos: [],
    certificates: defaultCertificates,
  };
}
