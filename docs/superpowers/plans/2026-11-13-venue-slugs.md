# Single-city Invite Links (`/hn`, `/sg`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship four Vietnamese invitation URLs — `/hn/`, `/sg/`, `/parent/hn/`, `/parent/sg/` — that show only one city's event, lock the RSVP city, and count down to that city's real start time.

**Architecture:** Each URL is a real `index.html` build entry (the site is multi-page, not routed), mounting the existing `App.svelte` or `AppParent.svelte` with a `venue` prop. A new dependency-free `src/lib/venue.ts` holds each city's date, start time, address, map link and RSVP city value once; `Locations.svelte`, `RSVP.svelte` and both app shells read from it.

**Tech Stack:** Svelte 5 (legacy `export let` props), Vite 8 multi-entry build, TypeScript, Tailwind 4, Node's built-in test runner (`node --test`, Node 26 strips TS types).

**Spec:** `docs/superpowers/specs/2026-11-13-venue-slugs-design.md`

## Global Constraints

- Canonical start times: HCMC `2026-12-27T10:30:00`, Hanoi `2027-01-05T17:00:00` (local time, no timezone suffix).
- RSVP `city` payload values must stay exactly `Ho Chi Minh` / `Hanoi` — the Google Sheet depends on them.
- City copy stays **Hồ Chí Minh** everywhere; never "Sài Gòn". `/sg` is only a URL segment.
- New pages are Vietnamese-only; `/en/` gains no new URLs.
- No new runtime dependencies; no SPA router; no links from `/` to the city pages.
- Production `base` stays `/thiepcuoi/`.
- `?slug=`, `?name=`, `?salutation=`, `?appellation=` must keep working on the new URLs.

## Review Focus

- `/sg` guests confirming attendance must land in the sheet as `Ho Chi Minh`, not `Hanoi` — the whole point of the change is a correct city per link.
- Legacy URLs still behave exactly as today (two cards, three city options, 10:30 countdown).
- `/hn` and `/hn` parent countdowns target 5 Jan 2027 17:00, not 27 Dec.
- A shared `/hn` link with `?slug=thanh&salutation=anh` still greets the guest and keeps the fixed city.
- Direct hits without the trailing slash (`/hn`) resolve in both dev and the built output.

---

### Task 1: Venue config module and test runner

**Files:**
- Create: `src/lib/venue.ts`
- Create: `tests/venue.test.ts`
- Modify: `package.json:6-11` (add `test` script)

**Interfaces:**
- Produces: `type VenueId = 'hn' | 'sg'`, `type Venue = 'all' | VenueId`, `type VenueCard` with fields `id, city, dateLabel(locale), time, address, mapUrl, mapAriaLabel(locale), accent, rsvpCity, startDate`, plus `VENUES: VenueCard[]` (order `[sg, hn]`), `venueCards(venue: Venue): VenueCard[]`, `venueStart(venue: Venue): Date`.

- [ ] **Step 1: Write the failing test**

`tests/venue.test.ts`:

```ts
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { VENUES, venueCards, venueStart } from '../src/lib/venue.ts'

test('two venues, Saigon first', () => {
  assert.deepEqual(VENUES.map((v) => v.id), ['sg', 'hn'])
})

test('canonical start times', () => {
  assert.equal(VENUES[0].startDate, '2026-12-27T10:30:00')
  assert.equal(VENUES[1].startDate, '2027-01-05T17:00:00')
  assert.equal(venueStart('sg').getTime(), new Date('2026-12-27T10:30:00').getTime())
  assert.equal(venueStart('hn').getTime(), new Date('2027-01-05T17:00:00').getTime())
  assert.equal(venueStart('all').getTime(), new Date('2026-12-27T10:30:00').getTime())
})

test('RSVP city values match the sheet', () => {
  assert.equal(VENUES[0].rsvpCity, 'Ho Chi Minh')
  assert.equal(VENUES[1].rsvpCity, 'Hanoi')
})

test('venueCards filters or returns everything', () => {
  assert.deepEqual(venueCards('all').map((v) => v.id), ['sg', 'hn'])
  assert.deepEqual(venueCards('hn').map((v) => v.id), ['hn'])
  assert.deepEqual(venueCards('sg').map((v) => v.id), ['sg'])
})

test('no hardcoded countdown dates survive in the app shells', () => {
  for (const file of ['src/App.svelte', 'src/AppParent.svelte']) {
    const src = readFileSync(file, 'utf8')
    assert.ok(!src.includes("new Date('2026"), `${file} should use venueStart()`)
  }
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/`
Expected: FAIL — `Cannot find module .../src/lib/venue.ts`.

- [ ] **Step 3: Write `src/lib/venue.ts`**

Fill in address and map URL from `src/lib/Locations.svelte` as it stands today (HCMC: `Riverside Palace, 360D Bến Vân Đồn, Phường Vĩnh Hội, Quận 4, TP. Hồ Chí Minh`; Hanoi: `Trống Đồng Palace, 65 P. Quán Sứ, Trần Hưng Đạo, Cửa Nam, Hà Nội`), and the two Google Maps hrefs from that file. `dateLabel` returns `locale.hcmDate` / `locale.hanoiDate`; `mapAriaLabel` returns `locale.hcmMapAriaLabel` / `locale.hanoiMapAriaLabel`; `time` is the display range `10:30 AM – 2:00 PM` / `5:00 PM – 8:00 PM`; `accent` is `'blue'` for sg and `'lilac'` for hn. `venueStart` returns `new Date(VENUES[0].startDate)` for `'all'`.

Use `import type { Locale } from './locales'` (type-only so `node --test` can load the module) and no enums or namespaces.

- [ ] **Step 4: Add the test script**

In `package.json` scripts: `"test": "node --test tests/"`.

- [ ] **Step 5: Run tests and typecheck**

Run: `npm test` → Expected: 5 passing. Run: `npm run check` → Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/venue.ts tests/venue.test.ts package.json
git commit -m "feat: add venue config for single-city invites"
```

---

### Task 2: Four entry pages, venue prop, correct countdowns

**Files:**
- Create: `hn/index.html`, `sg/index.html`, `parent/hn/index.html`, `parent/sg/index.html`
- Create: `src/main-hn.ts`, `src/main-sg.ts`, `src/main-parent-hn.ts`, `src/main-parent-sg.ts`
- Modify: `vite.config.ts:12-41`
- Modify: `src/App.svelte:10-15,73-84`
- Modify: `src/AppParent.svelte:10-25,77-90`

**Interfaces:**
- Consumes: `venueStart(venue: Venue): Date`, `Venue` from Task 1.
- Produces: `App.svelte` and `AppParent.svelte` each accept `export let venue: Venue = 'all'` and pass it to `Locations` and `RSVP`.

- [ ] **Step 1: Create the four HTML entries**

Copy the current head of `index.html` (fonts, icon, manifest) verbatim. Set `<html lang="vi">`, `<title>` as `Thiệp Cưới Hà Nội — Đức Duy & Xuân Thy` / `Thiệp Cưới Sài Gòn — Đức Duy & Xuân Thy` (the word "Sài Gòn" is allowed in the browser tab only; body copy stays Hồ Chí Minh), and point `<script type="module">` at the matching main file: `/src/main-hn.ts`, `/src/main-sg.ts`, `/src/main-parent-hn.ts`, `/src/main-parent-sg.ts`. Keep the skip link markup identical.

- [ ] **Step 2: Create the four main scripts**

Shape of each, matching `src/main.ts`:

```ts
import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, { target: document.getElementById('app')!, props: { venue: 'hn' } })
export default app
```

`main-sg.ts` → `App`, `venue: 'sg'`. `main-parent-hn.ts` → `AppParent`, `venue: 'hn'`. `main-parent-sg.ts` → `AppParent`, `venue: 'sg'`.

- [ ] **Step 3: Wire the props and date source**

In `App.svelte`: add `venue: Venue = 'all'` (import `Venue`/`venueStart` from `./lib/venue`), delete `const weddingDate = new Date('2026-12-27T18:00:00')`, define `const weddingDate = venueStart(venue)`, and pass `{venue}` to `<Locations>` and `<RSVP>`. Same in `AppParent.svelte`, deleting `new Date('2026-12-27T11:00:00')`.

- [ ] **Step 4: Register entries and dev redirects**

`vite.config.ts`: add inputs `hn: resolve(__dirname, 'hn/index.html')`, `sg: resolve(__dirname, 'sg/index.html')`, `parentHn: resolve(__dirname, 'parent/hn/index.html')`, `parentSg: resolve(__dirname, 'parent/sg/index.html')`. Extend the trailing-slash middleware path list to `/parent`, `/en`, `/hn`, `/sg`, `/parent/hn`, `/parent/sg` (one array, keep the existing redirect behaviour).

- [ ] **Step 5: Verify build output and types**

Run: `npm test` → 5 passing; `npm run check` → 0 errors; `npm run build` → then confirm `dist/hn/index.html`, `dist/sg/index.html`, `dist/parent/hn/index.html`, `dist/parent/sg/index.html` exist. In dev (`npm run dev`), `/hn` should redirect to `/hn/` and render the page.

Expected: all four URLs load; countdown on `/sg` and `/` reads 10:30 target date, `/hn` reads 5 Jan 2027.

- [ ] **Step 6: Commit**

```bash
git add hn sg parent src/main-*.ts src/App.svelte src/AppParent.svelte vite.config.ts
git commit -m "feat: add hn and sg invite entry pages"
```

---

### Task 3: Filter the events section

**Files:**
- Modify: `src/lib/Locations.svelte:1-119`

**Interfaces:**
- Consumes: `Venue`, `venueCards(venue)`, `VenueCard` from Task 1.
- Produces: `export let venue: Venue = 'all'` on `Locations`.

- [ ] **Step 1: Render cards from config**

Replace the two hardcoded cards with one `{#each venueCards(venue) as card (card.id)}` block that keeps today's card markup and classes, swapping literals for `card.city`, `card.dateLabel(locale)`, `card.time`, `card.address`, `card.mapUrl`, `card.mapAriaLabel(locale)`. Accent classes: `blue` → `bg-pastelBlue/20`, `text-blue-700`, `border-pastelBlue/30`, map button `bg-pastelBlue`; `lilac` → `bg-pastelLila/20`, `text-purple-600`, `border-pastelLila/30`, map button `bg-pastelLila`.

- [ ] **Step 2: Keep single-card layout sane**

When `venue !== 'all'`, wrap the list in a container limited to `max-w-md mx-auto` so one card does not stretch to `max-w-6xl` width. Two-card mode keeps the current `md:flex-row` layout.

- [ ] **Step 3: Verify**

Run: `npm run check` (0 errors) and `npm run dev`. Check `/`, `/hn`, `/sg`, `/parent/hn`, `/parent/sg`, `/en/`: legacy pages show two cards, city pages show exactly one, correct city, correct date and map link, map button opens the right venue.

- [ ] **Step 4: Commit**

```bash
git add src/lib/Locations.svelte
git commit -m "feat: show only the linked city in the events section"
```

---

### Task 4: Lock the RSVP city

**Files:**
- Modify: `src/lib/RSVP.svelte:1-20,133-146`

**Interfaces:**
- Consumes: `Venue`, `VENUES`, `venueCards` from Task 1.
- Produces: `export let venue: Venue = 'all'` on `RSVP`.

- [ ] **Step 1: Derive the city from the venue**

`let city = venue === 'all' ? 'Ho Chi Minh' : venueCards(venue)[0].rsvpCity`. Keep `city` bindable for the `all` case only. Import `Venue` as a type and `venueCards` as a value from `./venue`.

- [ ] **Step 2: Hide the selector on city pages**

Wrap the city `<select>` block in `{#if venue === 'all'}`. In the `{:else}` branch render a read-only line reusing existing locale strings: `<p class="text-gray-600">{city === 'Hanoi' ? locale.cityHanoi : locale.cityHCM}</p>` inside the same label/description styling as the current block. Submission payload keeps `city` unchanged, so `/sg` sends `Ho Chi Minh` and `/hn` sends `Hanoi`.

- [ ] **Step 3: Verify**

Run: `npm run check` (0 errors), `npm run dev`. On `/hn` confirm the form shows the Hanoi line and no city dropdown; submit a test entry with devtools Network open and check the POST body contains `"city":"Hanoi"`. Repeat on `/sg` expecting `"city":"Ho Chi Minh"`. On `/` the dropdown still offers all three options.

- [ ] **Step 4: Commit**

```bash
git add src/lib/RSVP.svelte
git commit -m "feat: lock RSVP city on single-city invites"
```

---

### Task 5: Document the new entries

**Files:**
- Modify: `CLAUDE.md:26-54` (project structure), `CLAUDE.md:65-75` (entry table), `CLAUDE.md:116-120` (deployment notes)

**Interfaces:** none.

- [ ] **Step 1: Update the entry table and structure tree**

List all seven entries with their HTML, main script and purpose, and add `src/lib/venue.ts` plus `tests/` to the structure tree. Note in deployment notes that `venue.ts` owns event dates/times and that the guest and parent countdowns share them.

- [ ] **Step 2: Full verification**

Run: `npm test` → 5 passing. `npm run check` → 0 errors. `npm run build` → success, four new `dist` entry files present.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document venue entries and config"
```
