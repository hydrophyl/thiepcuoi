# English Page — Design Spec
**Date:** 2026-05-05
**Status:** Approved

## Goal
Add a full English translation of the Vietnamese wedding invitation site, accessible at `/en/`. All visual design, layout, and assets are identical to the Vietnamese page; only user-visible strings change.

## Constraints
- Light mode only (matches existing site)
- Same backend endpoints (`/rsvp`, `/track-visit`) used by both pages
- `?name=` / `?slug=` personalisation still works on `/en/`; English guest banner shown instead of Vietnamese
- `?appellation=` and `?salutation=` params are Vietnamese honorifics — ignored on the English page (not displayed)
- No new npm dependencies

## Architecture

### New Files
| Path | Purpose |
|------|---------|
| `en/index.html` | Second Vite entry point; `lang="en"`, English `<title>`, English skip-link text, points to `src/main-en.ts` |
| `src/main-en.ts` | Mounts `App.svelte` with `lang="en"` prop |
| `src/lib/locales.ts` | `Locale` TypeScript type + `vi` and `en` locale objects |

### Modified Files
| Path | Change |
|------|--------|
| `vite.config.ts` | Add `en/index.html` as second Rollup input entry |
| `src/App.svelte` | Accept `lang: 'vi' \| 'en' = 'vi'` prop; import locale; pass locale object to all child components |
| `src/lib/Hero.svelte` | Accept `locale` prop; replace hardcoded strings |
| `src/lib/Story.svelte` | Accept `locale` prop; replace `alt` text only (body copy already in English) |
| `src/lib/Gallery.svelte` | Accept `locale` prop; replace title, aria-label, image alt text |
| `src/lib/Locations.svelte` | Accept `locale` prop; replace all text strings |
| `src/lib/RSVP.svelte` | Accept `locale` prop; replace all labels, placeholders, errors, options, button text |
| `src/lib/AudioPlayer.svelte` | Accept `locale` prop; replace Vietnamese `aria-label` strings |
| `vite.config.ts` | Add `en/index.html` as second Rollup input entry |

### Runtime URL Routing
- `yourdomain.com/` → `dist/index.html` → `main.ts` → `App` with default `lang="vi"`
- `yourdomain.com/en/` → `dist/en/index.html` → `main-en.ts` → `App` with `lang="en"`

## Locale Type (`src/lib/locales.ts`)

```typescript
export type Locale = {
  // Shell
  lang: string
  skipLink: string
  pageTitle: string

  // App.svelte — guest banner + footer
  guestBanner: (opts: { name: string; salutation: string; appellation: string }) => string
  footerTagline: string

  // Hero.svelte
  heroAriaLabel: string
  heroSubheading: string
  countdown: {
    days: string
    hours: string
    minutes: string
    seconds: string
    ariaLabel: (d: number, h: number, m: number, s: number) => string
  }

  // Story.svelte
  storyImageAlt: (n: number) => string

  // Gallery.svelte
  galleryTitle: string
  galleryAriaLabel: string
  galleryImageAlt: (n: number) => string

  // Locations.svelte
  locationsTitle: string
  eventType: string
  hcmDate: string
  hanoiDate: string
  mapButton: string
  hcmMapAriaLabel: string
  hanoiMapAriaLabel: string

  // RSVP.svelte
  rsvpTitle: string
  rsvpSubtitle: (opts: { salutation: string; appellation: string }) => string
  rsvpThankYouTitle: string
  rsvpThankYouMsg: string
  nameLabel: string
  namePlaceholder: string
  nameError: string
  nameTooLong: string
  attendanceLabel: string
  attendanceYes: string
  attendanceNo: string
  attendanceMaybe: string
  guestsLabel: string
  guestsError: string
  cityLabel: string
  cityHCM: string
  cityHanoi: string
  cityBoth: string
  confirmByLabel: string
  confirmByError: string
  submitBtn: string
  submittingBtn: string

  // AudioPlayer.svelte
  audioPlay: string
  audioPause: string
}
```

## English String Values

| Key | English value |
|-----|--------------|
| `skipLink` | `"Skip to main content"` |
| `pageTitle` | `"Wedding Invitation — Bé Hy & Bé Di"` |
| `guestBanner` | `"Welcome, {name}! You are cordially invited to our wedding."` (salutation/appellation ignored) |
| `footerTagline` | `"© 2026 · See you there"` |
| `heroAriaLabel` | `"Wedding invitation for Bé Hy and Bé Di"` |
| `heroSubheading` | `"We are getting married"` |
| `countdown.days` | `"Days"` |
| `countdown.hours` | `"Hours"` |
| `countdown.minutes` | `"Minutes"` |
| `countdown.seconds` | `"Seconds"` |
| `countdown.ariaLabel` | `"Countdown: {d} days, {h} hours, {m} minutes, {s} seconds until the wedding"` |
| `storyImageAlt` | `"Memory {n}"` |
| `galleryTitle` | `"Memories"` |
| `galleryAriaLabel` | `"Wedding photo gallery"` |
| `galleryImageAlt` | `"Wedding photo {n}"` |
| `locationsTitle` | `"Events"` |
| `eventType` | `"Wedding Reception"` |
| `hcmDate` | `"Sunday, December 27, 2026"` |
| `hanoiDate` | `"Tuesday, January 05, 2027"` |
| `mapButton` | `"View Map"` |
| `hcmMapAriaLabel` | `"View map for Ho Chi Minh City reception (opens in new tab)"` |
| `hanoiMapAriaLabel` | `"View map for Hanoi reception (opens in new tab)"` |
| `rsvpTitle` | `"RSVP"` |
| `rsvpSubtitle` | `"Your presence would be our greatest honor."` |
| `rsvpThankYouTitle` | `"Thank you!"` |
| `rsvpThankYouMsg` | `"Your response has been recorded."` |
| `nameLabel` | `"Full Name"` |
| `namePlaceholder` | `"Enter your name..."` |
| `nameError` | `"Please enter your name."` |
| `nameTooLong` | `"Name is too long (max 100 characters)."` |
| `attendanceLabel` | `"Attendance"` |
| `attendanceYes` | `"Absolutely! 🎉"` |
| `attendanceNo` | `"Sorry, I can't make it"` |
| `attendanceMaybe` | `"Not sure yet, I'll confirm later"` |
| `guestsLabel` | `"Number of guests"` |
| `guestsError` | `"Number of guests must be between 1 and 20."` |
| `cityLabel` | `"Which reception will you attend?"` |
| `cityHCM` | `"Ho Chi Minh City – Dec 27, 2026 (6PM–9PM)"` |
| `cityHanoi` | `"Hanoi – Jan 05, 2027 (5PM–8PM)"` |
| `cityBoth` | `"Both!"` |
| `confirmByLabel` | `"I'll confirm by..."` |
| `confirmByError` | `"Please select a date by which you'll confirm."` |
| `submitBtn` | `"Send RSVP"` |
| `submittingBtn` | `"Sending..."` |
| `audioPlay` | `"Play background music"` |
| `audioPause` | `"Pause background music"` |

## Vietnamese String Values (existing strings moved into locale object)
All existing hardcoded Vietnamese strings in components are moved into the `vi` locale object with the same keys. No existing Vietnamese text changes.

## `appellation` / `salutation` handling on English page
These URL params are Vietnamese cultural honorifics (e.g. `?appellation=con&salutation=bà`). On the English page they are read from the URL but not displayed — the English guest banner only uses `name`. The RSVP subtitle uses a fixed English string, ignoring both params.

## Vite Multi-Entry Config
```typescript
import path from 'path'

build: {
  rollupOptions: {
    input: {
      main: path.resolve(__dirname, 'index.html'),
      en:   path.resolve(__dirname, 'en/index.html'),
    },
    output: {
      manualChunks(id) {
        if (id.includes('node_modules/svelte')) return 'vendor-svelte'
      }
    }
  }
}
```
The `en/index.html` entry produces `dist/en/index.html`. No other build output changes.

## Implementation Order
1. `src/lib/locales.ts` — define type + both locale objects
2. `src/App.svelte` — add `lang` prop, import locale, pass to children
3. Components (Hero → Story → Gallery → Locations → RSVP → AudioPlayer) — add locale prop, replace strings
4. `en/index.html` + `src/main-en.ts` — second entry point
5. `vite.config.ts` — add second input
6. `npm run build` — verify both entries emit, no errors
