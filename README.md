# Vietnamese Wedding Invitation App

A single-page wedding invitation built with **Svelte + Vite** (frontend) and **FastAPI + SQLite** (backend). Guests can view ceremony details, browse a photo gallery, and submit their RSVP — all tracked per-guest via a URL slug.

---

## Project Structure

```
thiepcuoi/
├── src/                  # Svelte frontend source
│   ├── lib/              # Components (Hero, Gallery, RSVP, Story, …)
│   ├── App.svelte
│   └── app.css
├── backend/
│   ├── main.py           # FastAPI application
│   ├── pyproject.toml    # uv-managed Python project
│   └── wedding.db        # SQLite database (auto-created on first run)
├── public/
└── index.html
```

---

## Prerequisites

| Tool | Minimum version | Install |
|------|-----------------|---------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | bundled with Node |
| Python | 3.13+ | https://python.org |
| uv | latest | `pip install uv` or https://docs.astral.sh/uv |

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

## 2 — Backend Setup (FastAPI + uv)

`uv` handles the virtual environment and dependency installation automatically — no manual `venv` needed.

```bash
# 1. Move into the backend directory
cd backend

# 2. Install dependencies and run the server in one step
uv run uvicorn main:app --reload --port 8000
```

> On the very first run, `uv` will create a `.venv` inside `backend/` and install all packages listed in `pyproject.toml` before starting uvicorn.

The API will be available at **http://localhost:8000**.  
Interactive API docs (Swagger UI): **http://localhost:8000/docs**

### Manual dependency management (optional)

```bash
# Add a new package
uv add <package-name>

# Sync environment without running a command
uv sync
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/rsvp` | Submit an RSVP (name, attendance, guest count, city) |
| `POST` | `/track-visit` | Log a page visit — called automatically on load. Pass `?slug=name` in the invitation URL to identify the guest |
| `GET` | `/insights` | Retrieve all recorded RSVPs and visits |

### Example — RSVP payload

```json
POST /rsvp
{
  "name": "Nguyễn Văn A",
  "attendance": "yes",
  "guests": 2,
  "city": "Hà Nội"
}
```

### Example — Track visit payload

```json
POST /track-visit
{
  "guest": "nguyen-van-a",
  "time": "2026-05-01T10:00:00"
}
```

---

## Guest Slug Tracking

### `?slug` — guest name

Append `?slug=<guest-identifier>` to the invitation URL to identify the guest. The slug is URL-decoded, dashes are converted to spaces, and each word is capitalised. It is pre-filled in the RSVP name field and sent to `/track-visit` on page load.

```
http://localhost:5173?slug=nguyen-van-a
→ displays "Nguyễn Văn A", prefills the RSVP form
```

### `?appellation` — host self-reference

Controls the pronoun used by the hosts when addressing the guest (replaces the "tôi" in "chúng tôi"). Defaults to `tôi` if omitted.

| Value | Renders as | Appropriate for |
|-------|-----------|-----------------|
| `tôi` *(default)* | chúng tôi | peers, colleagues, friends |
| `con` | chúng con | parents, grandparents (child addressing elders) |
| `cháu` | chúng cháu | aunts, uncles, grand-relatives |
| `em` | chúng em | older siblings, close seniors |

```
http://localhost:5173?slug=ba-noi&appellation=cháu
→ "Kính mời Bà Nội tới dự lễ cưới của chúng cháu!"

http://localhost:5173?slug=anh-hai&appellation=em
→ "Kính mời Anh Hai tới dự lễ cưới của chúng em!"
```

Both parameters can be combined freely. The appellation also appears in the RSVP section subtitle.

---

## Deploying

1. **Frontend** — run `npm run build` and serve the `dist/` folder from any static host (Netlify, Vercel, GitHub Pages, etc.).
2. **Backend** — deploy the `backend/` folder to a Python host (Railway, Fly.io, VPS, etc.) and start with:
   ```bash
   uv run uvicorn main:app --host 0.0.0.0 --port 8000
   ```
3. **CORS** — update the `origins` list in `backend/main.py` to include your production frontend URL.

---

## Database

SQLite is used for simplicity. The database file `backend/wedding.db` is created automatically on first run with two tables:

- `visits` — guest name + timestamp of each page open
- `rsvps` — name, attendance choice, number of guests, city, submission time
