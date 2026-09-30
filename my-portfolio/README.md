# Portfolio (app)

The Vite + React app and Express + MongoDB CMS live in this folder. See the [root README](../README.md) for full docs.

```bash
copy .env.example .env
npm install
npm run seed
npm run dev
```

- Site: http://localhost:5173
- Admin: http://localhost:5173/admin (login with your configured ADMIN_EMAIL and ADMIN_PASSWORD in .env)

MongoDB must be running (`MONGODB_URI` in `.env`).
