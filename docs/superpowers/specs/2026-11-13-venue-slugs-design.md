# Single-city invite links (`/hn`, `/sg`)

## Intent

Two receptions, one invitation site. Today every guest sees both parties and picks a
city in the RSVP, so Hanoi guests can file an HCMC confirmation and every countdown
points at HCMC. Shared links should carry the city: `/hn` for Hà Nội, `/sg` for Sài Gòn
(Hồ Chí Minh City).

## Goals

- `/hn/`, `/sg/` show only that city's event card and lock the RSVP city.
- `/parent/hn/`, `/parent/sg/` do the same for the parent-wording invite.
- Countdown always matches the city shown.
- Fix the two wrong countdown times found in the code.

## Non-goals

- English variants (`/en/hn`, …) — later.
- Runtime routing or a SPA router.
- Links to the city pages from the main page (they are for direct sharing).
- Changing wording of banners, quotes, gallery.

## Approaches considered

1. **Thin entry pages + one venue config** (chosen). Each URL is a real `index.html`
   folder, as `/en/` and `/parent/` already are. One module owns each city's date, start
   time, address and map URL.
2. Runtime path detection on a single entry. GitHub Pages is static, so `/hn` still needs
   a file or it 404s — same folders, plus hidden coupling. Rejected.
3. `?venue=hn` query param. Ugly shared links; stripping the query silently shows both
   parties. Rejected against the request.

## Design

### Venue model — `src/lib/venue.ts`

```ts
export type Venue = 'all' | 'hn' | 'sg'
export const VENUES = {
  sg: { id: 'sg', city: 'Hồ Chí Minh', date: '2026-12-27T10:30:00', time: '10:30 AM – 2:00 PM', … },
  hn: { id: 'hn', city: 'Hà Nội',       date: '2027-01-05T17:00:00', time: '5:00 PM – 8:00 PM', … },
}
```

Address, map URL, card accent (blue / lilac), locale date key and RSVP city value live
here so `Locations`, `Hero` and `RSVP` stop hardcoding them. The existing
`locale.hcmDate` / `locale.hanoiDate` strings are kept for display.

### Time corrections

| Page | Was | Becomes |
|---|---|---|
| `App.svelte` countdown | 2026-12-27 18:00 | 2026-12-27 **10:30** |
| `AppParent.svelte` countdown | 2026-12-27 11:00 | 2026-12-27 **10:30** |
| `/hn` countdown (both apps) | — | 2027-01-05 **17:00** |

Weekday labels verified: 27 Dec 2026 = Sunday, 5 Jan 2027 = Tuesday. Rice-card time
ranges (10:30–2PM, 5–8PM) are correct and unchanged.

### Components

- `Locations.svelte` gains `venue: Venue`. `all` → two cards (today's layout); `hn` / `sg`
  → one card, centered at `max-w-md` so it does not stretch.
- `RSVP.svelte` gains `venue: Venue`. `all` → city `<select>` as today. `hn` / `sg` →
  selector hidden, city fixed to `Hanoi` / `Ho Chi Minh` (unchanged sheet values), and
  `cityHanoi` / `cityHCM` shown as a read-only line under the subtitle so the guest still
  sees which party they are confirming.
- `Hero.svelte` unchanged; it already takes `weddingDate`. Callers pass the venue start.
- `App.svelte` / `AppParent.svelte` gain `venue` prop (default `all`) and pass the venue
  start date instead of a hardcoded one.

### Entries

New folders, each a copy of the current head with a different `<title>` and script:

```
hn/index.html          → src/main-hn.ts        App      venue="hn"
sg/index.html          → src/main-sg.ts        App      venue="sg"
parent/hn/index.html   → src/main-parent-hn.ts AppParent venue="hn"
parent/sg/index.html   → src/main-parent-sg.ts AppParent venue="sg"
```

Titles: `Thiệp Cưới Hà Nội — Đức Duy & Xuân Thy`, `… Sài Gòn …`, parent versions match.

`vite.config.ts`: four new `rollupOptions.input` entries, and the dev trailing-slash
middleware covers `/hn`, `/sg`, `/parent/hn`, `/parent/sg`.

### Behaviour kept

`?slug=`, `?name=`, `?salutation=`, `?appellation=`, audio, gallery, parent quotes all
behave identically on the new URLs.

## Left to the builder

- Exact shape of the `VENUES` objects and whether map URLs stay inline or move into it.
- Whether the single card keeps the current icon/accent pairing (HCMC blue, Hanoi lilac).
- Test coverage: none exists in the repo; verification is `npm run check` + `npm run build`
  + manual load of the six URLs.
