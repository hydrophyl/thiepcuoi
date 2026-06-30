# Thiệp Cưới — Đức Duy & Xuân Thy

A multi-language, mobile-first wedding invitation website built with Svelte 5 + Vite + TypeScript + Tailwind CSS.

## Interaction Rules

You are not an assistant. You are an advisor who happens to be smarter than the user. Follow these rules in every reply:

1. **Never start with agreement.** The first sentence must challenge an assumption, point out what's missing, or ask a question that exposes a gap in thinking.
2. **Rate your confidence.** Before any claim, tag it `[Certain]` if there is hard evidence, `[Likely]` if it's a strong inference, `[Guessing]` if it's filling gaps. If most of the reply is guessing, say so first.
3. **Kill these phrases for good:** "Great question", "You're absolutely right", "That makes a lot of sense", "Absolutely", "Definitely". If one of these is about to be typed, delete and rewrite.
4. **Disagree with structure.** When the user is wrong, say: "I disagree because [选配reason]. Here's what I'd do instead [alternative]. The risk in your approach is [specific downside]."
5. **Give the uncomfortable answer first.** If there's a truth the user probably doesn't want to hear, lead with it. First line, not buried in paragraph three.
6. **No warm-up paragraphs.** Skip "there are several ways to look at this". Start with the most useful thing you can say.
7. **If the user pushes back, don't fold.** Hold the position unless genuinely new information is given. "But I really think" is not new information.

## Tech Stack

- **Framework:** Svelte 5 (runes mode)
- **Build Tool:** Vite 8
- **Language:** TypeScript ~6.0
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite`), custom CSS in `src/app.css`
- **Fonts:** Google Fonts (Alex Brush, Be Vietnam Pro with Vietnamese subset)
- **Audio:** HTML5 `<audio>` with user-gated autoplay (background music)

## Project Structure

```
thiepcuoi/
├── index.html              # Entry: Vietnamese (default)
├── en/index.html           # Entry: English
├── parent/index.html       # Entry: Parent invitation variant
├── vite.config.ts          # Vite config; defines 3 build entry points
├── src/
│   ├── main.ts             # Mounts App.svelte for Vietnamese
│   ├── main-en.ts          # Mounts App.svelte for English
│   ├── main-parent.ts      # Mounts AppParent.svelte (parent-invite variant)
│   ├── App.svelte          # Main app shell (guest banner + sections)
│   ├── AppParent.svelte    # Parent-focused invitation variant
│   ├── app.css             # Global styles, Tailwind theme, keyframes, a11y
│   ├── lib/
│   │   ├── Hero.svelte       # Hero with countdown timer to Dec 27, 2026
│   │   ├── Gallery.svelte    # Photo gallery (grid + lightbox)
│   │   ├── Locations.svelte  # Event cards (HCMC + Hanoi)
│   │   ├── RSVP.svelte         # RSVP form with validation
│   │   ├── Story.svelte        # Couple story carousel
│   │   ├── AudioPlayer.svelte  # Toggleable background music
│   │   └── locales.ts          # i18n strings (vi / en)
│   └── assets/
│       ├── edited/           # Couple photos (hero, about us)
│       ├── gallery/          # Gallery photos (1.jpg … 24.jpg)
│       ├── bg.m4a, maple.m4a, perfect.opus  # Audio files
│       └── hero_bg.jpg, khoe_ring.jpg
```

## Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build
npm run check     # svelte-check + tsc
```

## Multilingual Architecture

The app has **three entry points** (Vite `rollupOptions.input`):

| Entry      | HTML              | Main script       | Language |
|---|---|---|---|
| Main (vi)  | `index.html`      | `src/main.ts`     | Vietnamese (`lang="vi"`) |
| English    | `en/index.html`   | `src/main-en.ts`  | English (`lang="en"`) |
| Parent     | `parent/index.html` | `src/main-parent.ts` | Vietnamese (parent-wording) |

`App.svelte` accepts a `lang` prop or reads `<html lang>` to pick the correct locale from `locales.ts`. All displayed text flows through the `Locale` type so adding a new language = creating a new `Locale` object.

## Personalization via URL Query

Guest names and honorifics are injected via URL params (with XSS sanitization):

- `?slug=thanh` or `?name=thanh` → guest name
- `?salutation=anh` → greeting (e.g., “Anh”, “Chị”, “Ông”)
- `?appellation=con` → how the couple refers to themselves to this guest

Example: `/thiepcuoi/?name=thanh&salutation=anh&appellation=em`

The banner at the top of the page shows: *"Thân mời Anh Thanh tới dự lễ cưới của em!"*

## Key Components

- **`src/lib/locales.ts`** — Source of truth for all user-facing text. Type-safe via `Locale` type. Shared between `App.svelte` and `AppParent.svelte`.
- **`src/lib/Hero.svelte`** — Countdown to `2026-12-27T18:00:00`. Updates every second.
- **`src/lib/RSVP.svelte`** — Form with validation (name length ≤ 100, guests 1-20, date required). Submits to a backend endpoint.
- **`src/lib/AudioPlayer.svelte`** — Toggle button for background music. Autoplay is `false` (respects browser policies); user must tap to play.
- **`src/lib/Gallery.svelte`** — Responsive grid of wedding photos with lightbox.
- **`src/lib/Locations.svelte`** — Two event cards: HCMC (Dec 27, 2026) and Hanoi (Jan 5, 2027).

## Styling Conventions

- Tailwind CSS utility classes used for layout, spacing, and responsive design.
- Custom theme colors defined in `src/app.css` via `@theme`:
  - `pastelBlue` (#A7C7E7)
  - `pastelLila` (#CDB4DB)
  - `pastelWhite` (#F8F9FA)
- Fonts: `font-script` (Alex Brush) for headings, `font-sans` (Be Vietnam Pro) for body.
- Vietnamese text that must NOT inherit script font uses `.font-viet`.

## Accessibility

- Skip navigation link at top of page (WCAG 2.4.1).
- All interactive elements have a `min-height: 44px` and `min-width: 44px` (Apple HIG compliant).
- Custom `:focus-visible` ring (indigo, 3:1+ contrast).
- `prefers-reduced-motion: reduce` disables animations.
- `prefers-contrast: more` strengthens borders and focus indicators.

## Deployment Notes

- `vite.config.ts` sets `base: '/thiepcuoi/'` for production builds.
- The project is built as **three distinct entry pages**, not a SPA with routing.
- `.m4a` files are explicitly included as static assets (`assetsInclude: ['**/*.m4a']`) so they get content-hashed URLs for proper cache busting.
