# English Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full English version of the wedding invitation, accessible at `/en/`, using a shared locale object so every component has one copy of its code.

**Architecture:** A `Locale` TypeScript type + `vi`/`en` objects in `src/lib/locales.ts`. Each component receives a `locale` prop and uses it instead of hardcoded strings. A second Vite entry (`en/index.html` → `src/main-en.ts`) mounts `App` with `lang="en"`, which picks the `en` locale and passes it down.

**Tech Stack:** Svelte 5 (`mount()` API), Vite multi-entry, TypeScript, Tailwind CSS v4

---

### Task 1: Create `src/lib/locales.ts`

**Files:**
- Create: `src/lib/locales.ts`

- [ ] **Step 1: Create the file with the full `Locale` type and both locale objects**

```typescript
// src/lib/locales.ts

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

export const vi: Locale = {
  lang: 'vi',
  skipLink: 'Chuyển tới nội dung chính',
  pageTitle: 'Thiệp Cưới — Bé Hy & Bé Di',
  guestBanner: ({ name, salutation, appellation }) =>
    `Kính mời${salutation ? ` ${salutation}` : ''} ${name} tới dự lễ cưới của chúng ${appellation}!`,
  footerTagline: '© 2026 - Hẹn bạn nha',

  heroAriaLabel: 'Thiệp cưới Bé Hy và Bé Di',
  heroSubheading: 'We are getting married',
  countdown: {
    days: 'Ngày',
    hours: 'Giờ',
    minutes: 'Phút',
    seconds: 'Giây',
    ariaLabel: (d, h, m, s) =>
      `Đếm ngược: ${d} ngày, ${h} giờ, ${m} phút, ${s} giây đến ngày cưới`,
  },

  storyImageAlt: (n) => `Kỷ niệm ${n}`,

  galleryTitle: 'Kỷ Niệm',
  galleryAriaLabel: 'Thư viện ảnh cưới',
  galleryImageAlt: (n) => `Ảnh cưới ${n}`,

  locationsTitle: 'Sự Kiện',
  eventType: 'Tiệc Cưới',
  hcmDate: 'Chủ Nhật, 27 tháng 12 năm 2026',
  hanoiDate: 'Thứ Ba, 05 tháng 01 năm 2027',
  mapButton: 'Xem Bản Đồ',
  hcmMapAriaLabel: 'Xem bản đồ tiệc cưới Hồ Chí Minh (mở trong tab mới)',
  hanoiMapAriaLabel: 'Xem bản đồ tiệc cưới Hà Nội (mở trong tab mới)',

  rsvpTitle: 'Xác Nhận Tham Dự',
  rsvpSubtitle: ({ salutation, appellation }) =>
    `Sự hiện diện của ${salutation || 'bạn'} là niềm vinh hạnh cho gia đình chúng ${appellation}`,
  rsvpThankYouTitle: 'Cảm ơn bạn!',
  rsvpThankYouMsg: 'Phản hồi của bạn đã được ghi nhận.',
  nameLabel: 'Họ và Tên',
  namePlaceholder: 'Nhập tên của bạn...',
  nameError: 'Vui lòng nhập tên của bạn.',
  nameTooLong: 'Tên quá dài (tối đa 100 ký tự).',
  attendanceLabel: 'Tham dự',
  attendanceYes: 'Chắc chắn rồi! 🎉',
  attendanceNo: 'Rất tiếc, mình không thể đến',
  attendanceMaybe: 'Chưa chắc, mình sẽ xác nhận sau',
  guestsLabel: 'Số lượng người',
  guestsError: 'Số người phải từ 1 đến 20.',
  cityLabel: 'Bạn sẽ tham dự tiệc ở thành phố nào?',
  cityHCM: 'Hồ Chí Minh – 27.12.2026 (6PM–9PM)',
  cityHanoi: 'Hà Nội – 05.01.2027 (5PM–8PM)',
  cityBoth: 'Cả hai!',
  confirmByLabel: 'Bạn sẽ xác nhận trước ngày…',
  confirmByError: 'Vui lòng chọn ngày bạn sẽ xác nhận.',
  submitBtn: 'Gửi Xác Nhận',
  submittingBtn: 'Đang gửi...',

  audioPlay: 'Bật nhạc nền',
  audioPause: 'Tắt nhạc nền',
}

export const en: Locale = {
  lang: 'en',
  skipLink: 'Skip to main content',
  pageTitle: 'Wedding Invitation — Bé Hy & Bé Di',
  guestBanner: ({ name }) =>
    `Welcome, ${name}! You are cordially invited to our wedding.`,
  footerTagline: '© 2026 · See you there',

  heroAriaLabel: 'Wedding invitation for Bé Hy and Bé Di',
  heroSubheading: 'We are getting married',
  countdown: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    ariaLabel: (d, h, m, s) =>
      `Countdown: ${d} days, ${h} hours, ${m} minutes, ${s} seconds until the wedding`,
  },

  storyImageAlt: (n) => `Memory ${n}`,

  galleryTitle: 'Memories',
  galleryAriaLabel: 'Wedding photo gallery',
  galleryImageAlt: (n) => `Wedding photo ${n}`,

  locationsTitle: 'Events',
  eventType: 'Wedding Reception',
  hcmDate: 'Sunday, December 27, 2026',
  hanoiDate: 'Tuesday, January 05, 2027',
  mapButton: 'View Map',
  hcmMapAriaLabel: 'View map for Ho Chi Minh City reception (opens in new tab)',
  hanoiMapAriaLabel: 'View map for Hanoi reception (opens in new tab)',

  rsvpTitle: 'RSVP',
  rsvpSubtitle: () => 'Your presence would be our greatest honor.',
  rsvpThankYouTitle: 'Thank you!',
  rsvpThankYouMsg: 'Your response has been recorded.',
  nameLabel: 'Full Name',
  namePlaceholder: 'Enter your name...',
  nameError: 'Please enter your name.',
  nameTooLong: 'Name is too long (max 100 characters).',
  attendanceLabel: 'Attendance',
  attendanceYes: 'Absolutely! 🎉',
  attendanceNo: "Sorry, I can't make it",
  attendanceMaybe: "Not sure yet, I'll confirm later",
  guestsLabel: 'Number of guests',
  guestsError: 'Number of guests must be between 1 and 20.',
  cityLabel: 'Which reception will you attend?',
  cityHCM: 'Ho Chi Minh City – Dec 27, 2026 (6PM–9PM)',
  cityHanoi: 'Hanoi – Jan 05, 2027 (5PM–8PM)',
  cityBoth: 'Both!',
  confirmByLabel: "I'll confirm by...",
  confirmByError: 'Please select a date by which you\'ll confirm.',
  submitBtn: 'Send RSVP',
  submittingBtn: 'Sending...',

  audioPlay: 'Play background music',
  audioPause: 'Pause background music',
}
```

- [ ] **Step 2: Verify TypeScript is satisfied**

Run: `npx tsc --noEmit`
Expected: no errors

---

### Task 2: Modify `src/App.svelte`

**Files:**
- Modify: `src/App.svelte`

- [ ] **Step 1: Replace the full file content**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import sanitizeHtml from 'sanitize-html';
  import Hero from './lib/Hero.svelte';
  import Story from './lib/Story.svelte';
  import Gallery from './lib/Gallery.svelte';
  import Locations from './lib/Locations.svelte';
  import RSVP from './lib/RSVP.svelte';
  import AudioPlayer from './lib/AudioPlayer.svelte';
  import { vi, en, type Locale } from './lib/locales';

  export let lang: 'vi' | 'en' = 'vi';
  const locale: Locale = lang === 'en' ? en : vi;

  const weddingDate = new Date('2026-12-27T18:00:00');
  let guestName = '';
  let appellation = 'tôi';
  let salutation = '';

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const rawName = params.get('slug') || params.get('name') || '';
    const rawAppellation = params.get('appellation') || '';
    const rawSalutation = params.get('salutation') || '';

    if (rawAppellation) {
      const clean = sanitizeHtml(rawAppellation, { allowedTags: [], allowedAttributes: {} });
      if (clean) appellation = clean;
    }

    if (rawSalutation) {
      const clean = sanitizeHtml(rawSalutation, { allowedTags: [], allowedAttributes: {} });
      if (clean) salutation = clean;
    }

    if (rawName) {
      const cleanName = sanitizeHtml(rawName, {
        allowedTags: [],
        allowedAttributes: {}
      });
      guestName = cleanName
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    setTimeout(() => {
      fetch('http://localhost:8000/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest: guestName, time: new Date().toISOString() })
      }).catch(err => console.error("Logging visit failed connecting to backend"));
      console.log(`[Insight Tracking] Visit recorded. Guest: ${guestName || 'Anonymous'}`);
    }, 1000);
  });
</script>

<main id="main-content" class="font-sans antialiased text-gray-800 scroll-smooth overflow-x-hidden">
  {#if guestName}
    <!-- bg-pastelBlue (#A7C7E7) + text-gray-800 (#1f2937) = 8.4:1 contrast — passes WCAG AA -->
    <div class="bg-pastelBlue text-gray-800 text-center py-2 px-4 shadow-md sticky top-0 z-50">
      <p class="text-sm font-viet">{locale.guestBanner({ name: guestName, salutation, appellation })}</p>
    </div>
  {/if}

  <Hero {weddingDate} {locale} />
  <Story {locale} />
  <Gallery {locale} />
  <Locations {locale} />
  <RSVP guestName={guestName} {appellation} {salutation} {locale} />
  <AudioPlayer autoplay={false} {locale} />

  <footer class="py-8 bg-gray-50 text-center border-t border-gray-200">
    <p class="font-script text-2xl text-gray-600">Bé Di & Bé Hy</p>
    <p class="text-xs text-gray-400 mt-2 uppercase tracking-widest">{locale.footerTagline}</p>
  </footer>
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: errors for Hero/Story/Gallery/Locations/RSVP/AudioPlayer not accepting `locale` prop yet — that is expected at this stage.

---

### Task 3: Modify `src/lib/Hero.svelte`

**Files:**
- Modify: `src/lib/Hero.svelte`

- [ ] **Step 1: Replace the full file content**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import heroBg from '../assets/hero_bg.jpg';
  import type { Locale } from './locales';

  export let weddingDate: Date;
  export let locale: Locale;

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();

    if (diff > 0) {
      days = Math.floor(diff / (1000 * 60 * 60 * 24));
      hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((diff / 1000 / 60) % 60);
      seconds = Math.floor((diff / 1000) % 60);
    }
  }

  onMount(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  });
</script>

<!--
  Hero: real <img> instead of CSS background so the browser can LCP-prioritise it.
  The image is decorative (alt="" aria-hidden) — the section text is the meaningful content.
-->
<section
  class="h-screen relative flex flex-col justify-center items-center text-center px-4 overflow-hidden"
  aria-label={locale.heroAriaLabel}
>
  <!-- LCP hero image: fetchpriority=high tells the browser this is the most important image -->
  <img
    src={heroBg}
    alt=""
    aria-hidden="true"
    fetchpriority="high"
    width="1920"
    height="1080"
    class="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
  />

  <!-- Content sits above the image -->
  <div class="relative z-10 max-w-3xl animate-fade-in-up">
    <h2 class="tracking-widest text-fluid-lg text-gray-500 mb-4">{locale.heroSubheading}</h2>
    <h1 class="text-fluid-hero font-script text-gray-800 mb-6 drop-shadow-sm">Bé Hy & Bé Di</h1>
    <div class="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 text-gray-600">
      <span class="text-fluid-lg">🇻🇳 Hồ Chí Minh · 27.12.2026</span>
      <span class="hidden sm:inline text-gray-400">·</span>
      <span class="text-fluid-lg">🇻🇳 Hà Nội · 05.01.2027</span>
    </div>

    <!--
      role="timer": tells screen readers this is a countdown clock.
      aria-label: provides the current value when focused — avoids
      aria-live announcements every second which would be disruptive.
    -->
    <div
      role="timer"
      aria-label={locale.countdown.ariaLabel(days, hours, minutes, seconds)}
      class="flex gap-4 md:gap-8 justify-center mt-8 text-gray-700"
    >
      <div class="flex flex-col items-center">
        <span class="text-fluid-count font-script" aria-hidden="true">{days}</span>
        <span class="text-xs uppercase tracking-wider mt-1">{locale.countdown.days}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-fluid-count font-script" aria-hidden="true">{hours}</span>
        <span class="text-xs uppercase tracking-wider mt-1">{locale.countdown.hours}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-fluid-count font-script" aria-hidden="true">{minutes}</span>
        <span class="text-xs uppercase tracking-wider mt-1">{locale.countdown.minutes}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-fluid-count font-script" aria-hidden="true">{seconds}</span>
        <span class="text-xs uppercase tracking-wider mt-1">{locale.countdown.seconds}</span>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fade-in-up 1.5s ease-out forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in-up {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
```

---

### Task 4: Modify `src/lib/Story.svelte`

**Files:**
- Modify: `src/lib/Story.svelte`

- [ ] **Step 1: Replace the full file content**

```svelte
<script lang="ts">
  import type { Locale } from './locales';

  export let locale: Locale;

  // ── Photos for the heart collage ─────────────────────────────────────────
  const storyModules = import.meta.glob('../assets/story/*.jpg', { eager: true }) as Record<string, { default: string }>;
  // Sort by the numeric filename so 1.jpg < 2.jpg < … < 18.jpg
  const photos: (string | null)[] = Array.from({ length: 18 }, (_, i) => {
    const key = `../assets/story/${i + 1}.jpg`;
    return storyModules[key]?.default ?? null;
  });

  // Heart shape: 18 cells in a 5 × 5 grid (col/row are 1-based CSS grid values)
  const heartPositions = [
    // Row 1 – two humps (4 cells, gap at col 3)
    { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 4, row: 1 }, { col: 5, row: 1 },
    // Row 2 – full width (5 cells)
    { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }, { col: 4, row: 2 }, { col: 5, row: 2 },
    // Row 3 – full width (5 cells)
    { col: 1, row: 3 }, { col: 2, row: 3 }, { col: 3, row: 3 }, { col: 4, row: 3 }, { col: 5, row: 3 },
    // Row 4 – narrowing (3 cells)
    { col: 2, row: 4 }, { col: 3, row: 4 }, { col: 4, row: 4 },
    // Row 5 – tip (1 cell)
    { col: 3, row: 5 },
  ]; // total: 18 positions
</script>

<section class="py-20 bg-white">
  <div class="max-w-4xl mx-auto px-4">
    <!-- 8-year intro -->
    <div class="text-center mb-16">
      <h2 class="text-fluid-title font-script text-gray-800 mb-4">Our Story</h2>
      <p class="text-fluid-sub font-light text-gray-600 leading-relaxed">
        8 years. Countless memories. One incredible journey…
      </p>
    </div>
    <!-- Heart photo collage -->
    <div class="flex justify-center mb-16">
      <div class="grid grid-cols-5 grid-rows-5 gap-2" style="width: min(400px, 90vw); height: min(400px, 90vw);">
        {#each heartPositions as pos, i}
          <div
            class="rounded-lg overflow-hidden bg-pastelLila/20"
            style="grid-column: {pos.col}; grid-row: {pos.row};"
          >
            {#if photos[i]}
              <img
                src={photos[i]}
                alt={locale.storyImageAlt(i + 1)}
                class="w-full h-full object-cover"
                loading="lazy"
                width="74"
                height="74"
              />
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Turning the page -->
    <div class="text-center mb-16">
      <p class="text-fluid-sub text-gray-700 leading-relaxed font-light italic">
        This year, we're turning the page to a special chapter — to become <span class="font-semibold not-italic text-gray-900">Husband &amp; Wife</span>
      </p>
    </div>

    <!-- Note to European friends -->
    <div class="bg-pastelBlue/10 border border-pastelBlue/30 rounded-2xl p-8 md:p-10 text-gray-700 leading-relaxed text-base md:text-lg">
      <p class="mb-0">
        To our dearest friends: you have been the heartbeat of our eight-year journey, and your support is the soundtrack to our story. We know that traveling to Vietnam is a long journey — especially during a season meant for rest and family here in Europe. Please know that while we would be overjoyed to celebrate with you at either (or both!) of our weddings, we truly understand if the distance is too great. Your love and well-wishes have already warmed our hearts more than words can say. 💛
      </p>
    </div>
  </div>
</section>
```

---

### Task 5: Modify `src/lib/Gallery.svelte`

**Files:**
- Modify: `src/lib/Gallery.svelte`

- [ ] **Step 1: Replace the full file content**

```svelte
<script lang="ts">
  import type { Locale } from './locales';

  export let locale: Locale;

  // Eagerly import all jpg images from the gallery folder.
  const modules = import.meta.glob('../assets/gallery/*.jpg', { eager: true }) as Record<string, { default: string }>;
  const photos = Object.values(modules).map(m => m.default);

  // Bento grid spans — cycles through for any number of images.
  const spans: string[] = [
    'col-span-1 row-span-1',
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
  ];
</script>

<section class="py-20 bg-pastelWhite">
  <div class="max-w-5xl mx-auto px-4">
    <h2 class="text-fluid-title font-script text-center text-gray-800 mb-12">{locale.galleryTitle}</h2>

    <div class="gallery-container" role="region" aria-label={locale.galleryAriaLabel}>
      {#each photos as src, i}
        <div class="gallery-item {spans[i % spans.length]} bg-gray-200 rounded-lg overflow-hidden relative group">
          <img
            {src}
            alt={locale.galleryImageAlt(i + 1)}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            width="400"
            height="200"
          />
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  /* ── Mobile (< 640px): horizontal scroll-snap carousel ─────────────────── */
  .gallery-container {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    padding-block: 0.5rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .gallery-container::-webkit-scrollbar {
    display: none;
  }

  .gallery-item {
    flex: 0 0 min(80vw, 320px);
    height: 240px;
    scroll-snap-align: start;
  }

  /* ── Tablet+ (≥ 640px): bento CSS grid ─────────────────────────────────── */
  @media (min-width: 640px) {
    .gallery-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 200px;
      gap: 1rem;
      overflow: visible;
      padding: 0;
      scrollbar-width: auto;
      -webkit-overflow-scrolling: auto;
      scroll-snap-type: none;
    }

    .gallery-item {
      flex: initial;
      width: auto;
      height: auto;
      scroll-snap-align: none;
    }
  }

  @media (min-width: 768px) {
    .gallery-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .gallery-container {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
```

---

### Task 6: Modify `src/lib/Locations.svelte`

**Files:**
- Modify: `src/lib/Locations.svelte`

- [ ] **Step 1: Replace the full file content**

```svelte
<script lang="ts">
  import type { Locale } from './locales';
  export let locale: Locale;
</script>

<section class="py-20 bg-gradient-to-t from-pastelBlue/10 to-transparent">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-fluid-title font-script text-center text-gray-800 mb-16">{locale.locationsTitle}</h2>

    <div class="flex flex-col md:flex-row gap-8 justify-center items-stretch">
      <!-- Card 1: Ho Chi Minh City -->
      <div class="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-pastelBlue/30 text-center flex flex-col items-center">
        <div class="w-16 h-16 bg-pastelBlue/20 rounded-full flex items-center justify-center mb-6 text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-1">Hồ Chí Minh</h3>
        <p class="text-sm font-semibold text-blue-700 uppercase tracking-widest mb-4">{locale.eventType}</p>
        <p class="text-gray-600 mb-1">{locale.hcmDate}</p>
        <p class="text-gray-800 font-bold mb-4">6:00 PM – 9:00 PM</p>
        <p class="text-gray-600 italic text-sm">360D Bến Vân Đồn, Phường Vĩnh Hội, Quận 4, TP. Hồ Chí Minh</p>
        <div class="mt-auto pt-6 w-full">
          <a
            href="https://www.google.com/maps/search/360D+B%E1%BA%BFn+V%C3%A2n+%C4%90%E1%BB%93n+V%C4%A9nh+H%E1%BB%99i+H%E1%BB%93+Ch%C3%AD+Minh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={locale.hcmMapAriaLabel}
            class="inline-block w-full py-3 bg-pastelBlue text-gray-800 rounded-lg hover:bg-pastelBlue/80 transition-colors font-medium"
          >{locale.mapButton}</a>
        </div>
      </div>

      <!-- Card 2: Hanoi -->
      <div class="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-pastelLila/30 text-center flex flex-col items-center">
        <div class="w-16 h-16 bg-pastelLila/20 rounded-full flex items-center justify-center mb-6 text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-1">Hà Nội</h3>
        <p class="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-4">{locale.eventType}</p>
        <p class="text-gray-600 mb-1">{locale.hanoiDate}</p>
        <p class="text-gray-800 font-bold mb-4">5:00 PM – 8:00 PM</p>
        <p class="text-gray-600 italic text-sm">Trống Đồng Palace, 65 P. Quán Sứ, Trần Hưng Đạo, Cửa Nam, Hà Nội</p>
        <div class="mt-auto pt-6 w-full">
          <a
            href="https://www.google.com/maps/search/Tr%E1%BB%91ng+%C4%90%E1%BB%93ng+Palace+65+Qu%C3%A1n+S%E1%BB%A9+H%C3%A0+N%E1%BB%99i"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={locale.hanoiMapAriaLabel}
            class="inline-block w-full py-3 bg-pastelLila text-gray-800 rounded-lg hover:bg-pastelLila/80 transition-colors font-medium"
          >{locale.mapButton}</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### Task 7: Modify `src/lib/RSVP.svelte`

**Files:**
- Modify: `src/lib/RSVP.svelte`

- [ ] **Step 1: Replace the full file content**

```svelte
<script lang="ts">
  import type { Locale } from './locales';

  export let guestName = '';
  export let appellation = 'tôi';
  export let salutation = '';
  export let locale: Locale;

  let name = '';
  $: if (!name && guestName) name = guestName;
  let guests = 1;
  let city = 'Ho Chi Minh';
  let attendance = 'yes';
  let confirmBy = '';
  let submitted = false;
  let loading = false;

  // --- Validation ---
  let errors = { name: '', guests: '', confirmBy: '' };

  function validate() {
    errors = { name: '', guests: '', confirmBy: '' };
    let valid = true;

    if (!name.trim()) {
      errors.name = locale.nameError;
      valid = false;
    } else if (name.trim().length > 100) {
      errors.name = locale.nameTooLong;
      valid = false;
    }

    if (attendance !== 'no') {
      if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
        errors.guests = locale.guestsError;
        valid = false;
      }
    }

    if (attendance === 'maybe' && !confirmBy) {
      errors.confirmBy = locale.confirmByError;
      valid = false;
    }

    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    loading = true;
    try {
      const res = await fetch('http://localhost:8000/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), guests, city, attendance, confirmBy }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = data?.detail;
        if (Array.isArray(detail)) {
          detail.forEach((d) => {
            const field = d.loc?.[d.loc.length - 1];
            if (field === 'name') errors.name = d.msg;
            else if (field === 'guests') errors.guests = d.msg;
            else if (field === 'confirmBy') errors.confirmBy = d.msg;
          });
        }
        loading = false;
        return;
      }
    } catch (e) {
      console.error('Error submitting RSVP:', e);
    }
    loading = false;
    submitted = true;
  }
</script>

<section class="py-24 bg-white relative overflow-hidden">
  <div class="absolute top-[-50px] right-[-50px] w-64 h-64 bg-pastelLila/10 rounded-full blur-3xl"></div>
  <div class="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-pastelBlue/10 rounded-full blur-3xl"></div>

  <div class="max-w-2xl mx-auto px-4 relative z-10">
    <div class="bg-white/70 backdrop-blur-md border border-gray-100 p-8 md:p-12 rounded-3xl shadow-xl">
      <h2 class="text-fluid-title font-script text-center text-gray-800 mb-4">{locale.rsvpTitle}</h2>
      <p class="text-center text-gray-500 mb-8">{locale.rsvpSubtitle({ salutation, appellation })}</p>

      {#if submitted}
        <div class="text-center py-10 animate-fade-in-up">
          <svg class="w-16 h-16 text-pastelLila mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <h3 class="text-2xl font-semibold mb-2">{locale.rsvpThankYouTitle}</h3>
          <p class="text-gray-600">{locale.rsvpThankYouMsg}</p>
        </div>
      {:else}
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{locale.nameLabel}</label>
            <input
              type="text"
              id="name"
              bind:value={name}
              class="w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-pastelBlue focus:border-transparent
                {errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}"
              placeholder={locale.namePlaceholder}
            />
            {#if errors.name}<p class="mt-1 text-xs text-red-500">{errors.name}</p>{/if}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="attendance" class="block text-sm font-medium text-gray-700 mb-1">{locale.attendanceLabel}</label>
              <select
                id="attendance"
                bind:value={attendance}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastelBlue focus:border-transparent outline-none transition-all"
              >
                <option value="yes">{locale.attendanceYes}</option>
                <option value="no">{locale.attendanceNo}</option>
                <option value="maybe">{locale.attendanceMaybe}</option>
              </select>
            </div>

            <div>
              <label for="guests" class="block text-sm font-medium text-gray-700 mb-1">{locale.guestsLabel}</label>
              <input
                type="number"
                id="guests"
                min="1"
                max="20"
                bind:value={guests}
                disabled={attendance === 'no'}
                class="w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-pastelBlue focus:border-transparent
                  disabled:bg-gray-100 disabled:text-gray-400
                  {errors.guests ? 'border-red-400 bg-red-50' : 'border-gray-300'}"
              />
              {#if errors.guests}<p class="mt-1 text-xs text-red-500">{errors.guests}</p>{/if}
            </div>

            <div class="md:col-span-2">
              <label for="city" class="block text-sm font-medium text-gray-700 mb-1">{locale.cityLabel}</label>
              <select
                id="city"
                bind:value={city}
                disabled={attendance === 'no'}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastelBlue focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="Ho Chi Minh">{locale.cityHCM}</option>
                <option value="Hanoi">{locale.cityHanoi}</option>
                <option value="Both">{locale.cityBoth}</option>
              </select>
            </div>

            {#if attendance === 'maybe'}
            <div class="md:col-span-2">
              <label for="confirmBy" class="block text-sm font-medium text-gray-700 mb-1">{locale.confirmByLabel}</label>
              <input
                type="date"
                id="confirmBy"
                bind:value={confirmBy}
                class="w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-pastelBlue focus:border-transparent
                  {errors.confirmBy ? 'border-red-400 bg-red-50' : 'border-gray-300'}"
              />
              {#if errors.confirmBy}<p class="mt-1 text-xs text-red-500">{errors.confirmBy}</p>{/if}
            </div>
            {/if}
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full py-4 mt-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition-colors focus:ring-4 focus:ring-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? locale.submittingBtn : locale.submitBtn}
          </button>
        </form>
      {/if}
    </div>
  </div>
</section>
```

---

### Task 8: Modify `src/lib/AudioPlayer.svelte`

**Files:**
- Modify: `src/lib/AudioPlayer.svelte`

- [ ] **Step 1: Replace the full file content**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import audioSrc from '../assets/maple.m4a';
  import type { Locale } from './locales';

  export let autoplay = false;
  export let locale: Locale;

  let isPlaying = false;
  let audioRef: HTMLAudioElement;

  onMount(() => {
    if (autoplay) {
      audioRef.play()
        .then(() => { isPlaying = true; })
        .catch(() => { /* browser blocked autoplay — user must click */ });
    }
  });

  function togglePlay() {
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play().catch(e => console.log('Audio autoplay prevented:', e));
    }
    isPlaying = !isPlaying;
  }
</script>

<div class="fixed bottom-6 right-6 z-50">
  <audio bind:this={audioRef} loop src={audioSrc}></audio>
  <button
    on:click={togglePlay}
    class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:scale-110 transition-transform duration-300 border border-pastelLila"
    aria-label={isPlaying ? locale.audioPause : locale.audioPlay}
  >
    {#if isPlaying}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="ml-0.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    {/if}
  </button>
</div>
```

---

### Task 9: Create second entry point

**Files:**
- Create: `en/index.html`
- Create: `src/main-en.ts`

- [ ] **Step 1: Create `en/index.html`** (place at project root, sibling to the existing `index.html`)

```html
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/favicon.svg" />
    <link rel="manifest" href="/manifest.json" />

    <!-- Preconnect to Google Fonts origins before stylesheet request -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Fleur+De+Leah&subset=vietnamese&display=swap"
      rel="stylesheet"
    />

    <title>Wedding Invitation — Bé Hy &amp; Bé Di</title>
  </head>
  <body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div id="app"></div>
    <script type="module" src="/src/main-en.ts"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `src/main-en.ts`**

```typescript
import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
  props: { lang: 'en' },
})

export default app
```

---

### Task 10: Update `vite.config.ts` for multi-entry build

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Replace the full file content**

```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte()],

  // Treat .m4a as a static asset so imports get content-hashed URLs (proper cache busting)
  assetsInclude: ['**/*.m4a'],

  build: {
    rollupOptions: {
      input: {
        // Vietnamese page (default)
        main: resolve(__dirname, 'index.html'),
        // English page at /en/
        en: resolve(__dirname, 'en/index.html'),
      },
      output: {
        // Split the Svelte runtime into its own chunk — browsers cache it across deployments
        manualChunks(id) {
          if (id.includes('node_modules/svelte')) {
            return 'vendor-svelte';
          }
        },
      },
    },
  },
})
```

---

### Task 11: Build and verify

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected output includes both entry points:
```
dist/index.html
dist/en/index.html
dist/assets/index-*.css
dist/assets/vendor-svelte-*.js
dist/assets/index-*.js
dist/assets/en-*.js       ← English page JS chunk
```
No TypeScript or Rollup errors.

- [ ] **Step 2: Verify both HTML files exist**

```bash
ls dist/en/
```

Expected: `index.html` is present.

- [ ] **Step 3: Spot-check English strings in the built output**

Search for "Skip to main content" in `dist/en/index.html` — should be in the skip-link.
Search for "Days" and "Hours" in the built JS — should appear in the `en` locale bundle.

- [ ] **Step 4: Commit**

```bash
git add src/lib/locales.ts src/App.svelte src/lib/Hero.svelte src/lib/Story.svelte src/lib/Gallery.svelte src/lib/Locations.svelte src/lib/RSVP.svelte src/lib/AudioPlayer.svelte en/index.html src/main-en.ts vite.config.ts docs/
git commit -m "feat: add English page at /en/ using locale object"
```
