# Vietnamese Wedding Invitation App

A single-page wedding invitation built with **Svelte + Vite** (frontend) 
---

## Project Structure

```
thiepcuoi/
├── src/                  # Svelte frontend source
│   ├── lib/              # Components (Hero, Gallery, RSVP, Story, …)
│   ├── App.svelte
│   └── app.css
├── public/
└── index.html
```

---

## Prerequisites

| Tool | Minimum version | Install |
|------|-----------------|---------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | bundled with Node |

---

## 1 — Frontend Setup

All commands run from the **project root**.

```bash
# 1. Install Node dependencies
npm install

# 2. Start the Vite dev server (hot-reload enabled)
npm run dev
```

Open **http://localhost:5173** in your browser.

> **Other useful scripts**
> | Command | Description |
> |---------|-------------|
> | `npm run build` | Production build → `dist/` |
> | `npm run preview` | Serve the production build locally |
> | `npm run check` | Run Svelte + TypeScript type checking |

---

## Deploying

1. **Frontend** — run `npm run build` and serve the `dist/` folder from any static host (Netlify, Vercel, GitHub Pages, etc.).
---
