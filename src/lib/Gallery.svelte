<script lang="ts">
  import type { Locale } from './locales';

  export let locale: Locale;

  // Eagerly import all jpg images from the gallery folder.
  // Vite resolves these at build time and returns hashed asset URLs.
  const modules = import.meta.glob('../assets/gallery/*.jpg', { eager: true }) as Record<string, { default: string }>;
  const photos = Object.values(modules).map(m => m.default);

  // Bento grid spans — cycles through for any number of images.
  // On mobile these are ignored (flex layout), on tablet+ they apply to the CSS grid.
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

    <!--
      Single element, CSS switches layout:
        < 640px  → horizontal scroll-snap carousel (one card at a time, iPhone-native feel)
        ≥ 640px  → bento CSS grid (col-span / row-span Tailwind classes apply only in grid mode)

      The col-span-* / row-span-* classes are ignored by flexbox, so they're safe
      to leave on items — they only activate when the container is a grid.
    -->
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
    /* Smooth momentum scrolling on iOS Safari */
    -webkit-overflow-scrolling: touch;
    /* Hide scrollbar visually while keeping it functional */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .gallery-container::-webkit-scrollbar {
    display: none;
  }

  .gallery-item {
    /* Fixed-width card that snaps into place */
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
