# Rajendra Karki — Portfolio

Personal portfolio site for **Rajendra Karki**, a full-stack developer based in Kathmandu, Nepal.

**Live:** _(add your Vercel/Netlify URL after deploy)_  
**GitHub:** [karkirajendra/MyPortfolio](https://github.com/karkirajendra/MyPortfolio)

## Tech stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4** (utilities + custom theme CSS)
- **Three.js** (lazy-loaded particle background)
- Custom cursor, scroll reveals, reduced-motion / touch-aware UX

## Features

- Responsive sections: Hero, About, Skills, Process, Experience, Projects, Contact
- Project case-study modal
- Resume download (`public/resume.pdf`)
- Accessibility: `prefers-reduced-motion`, touch devices keep the native cursor
- SEO: title, description, Open Graph / Twitter meta tags

## Project structure

```
my-portfolio/
├── public/           # favicon, og-image, resume.pdf
├── src/
│   ├── components/   # UI sections & shared widgets
│   ├── data/         # projects, skills, experience
│   ├── hooks/        # scroll, tilt, reduced-motion, etc.
│   ├── styles/       # global theme & animations
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── vite.config.js
```

## Run locally

```bash
cd my-portfolio
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Before you share

1. Drop your CV at `my-portfolio/public/resume.pdf` (Resume buttons already link there).
2. Deploy on [Vercel](https://vercel.com) or [Netlify](https://netlify.com):
   - Root directory: `my-portfolio`
   - Build command: `npm run build`
   - Output: `dist`
3. Update Open Graph URLs in `index.html` to your live domain.
4. Add live `demo` URLs in `src/data/projects.js` when projects are hosted.
5. On GitHub → Settings → General: set description, website URL, and topics (`react`, `vite`, `tailwindcss`, `portfolio`, `threejs`).

## License

Personal portfolio — all rights reserved.
