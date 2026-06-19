<script lang="ts">
  import type { Locale } from './locales'
  import { onMount } from 'svelte'

  export let locale: Locale
  export let appellation = 'chúng mình'
  export let salutation = 'bạn'

  // Optional overrides for parent-invite page — when provided, replaces default quotes entirely
  export let quotesOverride: string[] | undefined = undefined
  export let viQuotesOverride: string[] | undefined = undefined

  // ── Load numbered images from src/assets/gallery/ ─────────────────────
  const modules = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp}', {
    eager: false,
  }) as Record<string, () => Promise<{ default: string }>>

  const keys = Object.keys(modules).sort((a, b) => {
    const n = (s: string) => parseInt(s.match(/(\d+)\.[^.]+$/)?.[1] ?? '0', 10)
    return n(a) - n(b)
  })
  const total = keys.length

  let urls: (string | null)[] = Array(total).fill(null)

  async function loadImage(idx: number) {
    if (idx < 0 || idx >= total || urls[idx] !== null) return
    const mod = await modules[keys[idx]]()
    urls[idx] = mod.default
    urls = [...urls]
  }

  // ── Quotes ────────────────────────────────────────────────────────────
  const enQuotes = [
    '9 years together. Countless memories. One meaningful journey.',
    "We're turning the page to a new chapter as we become husband and wife.",
    "You've been part of our story over the years, and your presence and support have meant more to us than we can fully express.",
    "We know that traveling to Vietnam for our wedding is a long journey, especially during a time often reserved for rest and family in Europe. While we would be truly happy to celebrate with you—at either or both of our weddings—we completely understand if it's not possible.\n\nYour kind thoughts and well wishes already mean a great deal to us.",
  ]

  function weTerm(app: string): string {
    if (app) return app
    return 'chúng mình'
  }

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  $: we = locale.lang === 'vi' ? weTerm(appellation) : ''
  $: viQuotes = viQuotesOverride ?? [
    '9 năm bên nhau là một hành trình đầy ý nghĩa.',
    `${capitalize(we)} sắp đánh dấu một cột mốc mới trên hành trình tình yêu để trở thành vợ chồng.`,
    `Cảm ơn vì ${(salutation || 'bạn')} đã luôn đồng hành cùng ${we} trong suốt những năm qua. Sự hiện diện và ủng hộ của ${salutation || 'bạn'} dành cho ${we} thực sự quý giá hơn những gì ${we} có thể diễn tả.`,
    `Mong ${(salutation || 'bạn')} có thể dành chút thời gian tham dự lễ cưới của ${we}`
  ]

  $: enQuotesResolved = quotesOverride ?? enQuotes
  $: quotes = locale.lang === 'en' ? enQuotesResolved : viQuotes

  // ── Carousel state ────────────────────────────────────────────────────
  let container: HTMLDivElement
  let currentIndex = 0

  function scrollTo(index: number) {
    if (!container) return
    const clamped = Math.max(0, Math.min(index, total - 1))
    const slide = container.children[clamped] as HTMLElement
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      currentIndex = clamped
    }
  }

  function prev() {
    scrollTo(currentIndex - 1)
  }

  function next() {
    scrollTo(currentIndex + 1)
  }

  function updateCurrentIndex() {
    if (!container) return
    const scrollLeft = container.scrollLeft
    const slideWidth = container.clientWidth
    currentIndex = Math.round(scrollLeft / slideWidth)
  }

  // ── Lazy loading ───────────────────────────────────────────────────────
  onMount(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.lazyIndex)
            loadImage(idx)
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '400px' }
    )
    document.querySelectorAll('[data-lazy-index]').forEach((el) => io.observe(el))

    return () => io.disconnect()
  })
</script>

{#if total === 0}
  <section class="gallery-empty">
    <p>
      Add images named <strong>1.jpg, 2.jpg, 3.jpg …</strong> to
      <code>src/assets/gallery/</code>
    </p>
  </section>
{:else}
  <!-- ── Quotes Section ──────────────────────────────────────────────── -->
  <section class="quotes-section">
    <div class="quotes-frame">
      {#each quotes as quote, i}
        <p class="quote-text">{quote}</p>
        {#if i < quotes.length - 1}
          <span class="quote-divider">✦</span>
        {/if}
      {/each}
    </div>
  </section>
  <!-- ── Image Carousel ──────────────────────────────────────────────── -->
  <section class="gallery-carousel" aria-label={locale.galleryAriaLabel}>
    <div class="carousel-wrapper">
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        role="region"
        class="carousel-track"
        bind:this={container}
        on:scroll={updateCurrentIndex}
      >
        {#each Array(total) as _, i}
          <div class="carousel-slide" data-lazy-index={i}>
            {#if urls[i]}
              <img
                src={urls[i]}
                alt={locale.galleryImageAlt(i + 1)}
                class="slide-img"
                draggable="false"
              />
            {:else}
              <div class="slide-placeholder"></div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Prev / Next arrows -->
      {#if currentIndex > 0}
        <button class="arrow arrow-left" aria-label="Previous image" on:click={prev}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      {/if}
      {#if currentIndex < total - 1}
        <button class="arrow arrow-right" aria-label="Next image" on:click={next}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      {/if}
    </div>
  </section>
{/if}

<style>
  /* ── Carousel container ──────────────────────────────────────────────── */
  .gallery-carousel {
    width: 60%;
    margin: 0 auto;
    background: #F8F9FA;
    overflow: hidden;
    padding: 0;
  }

  .gallery-empty {
    width: 60%;
    margin: 0 auto;
    background: #F8F9FA;
    text-align: center;
    color: #aaa;
    padding: 4rem 2rem;
    font-size: 0.9rem;
    line-height: 1.8;
  }

  .gallery-empty code {
    font-family: monospace;
    background: #f5f2ee;
    padding: 0.1em 0.4em;
    border-radius: 3px;
  }

  /* ── Carousel wrapper (relative for arrow positioning) ──────────────── */
  .carousel-wrapper {
    position: relative;
  }

  /* ── Horizontal scroll track ─────────────────────────────────────────── */
  .carousel-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    gap: 0;
  }

  .carousel-track::-webkit-scrollbar {
    display: none;
  }

  .carousel-track {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* ── Each slide ──────────────────────────────────────────────────────── */
  .carousel-slide {
    flex: 0 0 100%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    position: relative;
    overflow: hidden;
    background: #F8F9FA;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  /* ── Image ───────────────────────────────────────────────────────────── */
  .slide-img {
    width: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    opacity: 0;
    transform: scale(0.98);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .slide-img[src] {
    opacity: 1;
    transform: scale(1);
  }

  .slide-placeholder {
    width: 32px;
    height: 32px;
    border: 2px solid #e2ddd7;
    border-top-color: #a09890;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Arrow buttons ──────────────────────────────────────────────────── */
  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, box-shadow 0.2s ease;
    z-index: 10;
    color: #5a5046;
    padding: 0;
  }

  .arrow:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .arrow:active {
    transform: translateY(-50%) scale(0.95);
  }

  .arrow-left {
    left: 2rem;
  }

  .arrow-right {
    right: 2rem;
  }

  /* ── Quotes section ─────────────────────────────────────────────────── */
  .quotes-section {
    width: 60%;
    margin: 0 auto;
    background: #F8F9FA;
    padding: 2rem 0 3rem;
    display: flex;
    justify-content: center;
  }

  .quotes-frame {
    max-width: 680px;
    width: 100%;
    border: 1px solid #e2ddd7;
    border-radius: 6px;
    padding: 3rem 2.5rem;
    background: #ffffff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .quotes-frame::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 0.5px solid rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    pointer-events: none;
  }

  .quote-text {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: clamp(0.85rem, 2vw, 1.1rem);
    color: #6b6560;
    text-align: center;
    font-style: italic;
    font-weight: 300;
    line-height: 1.9;
    letter-spacing: 0.02em;
    word-break: break-word;
    margin: 0;
  }

  .quote-divider {
    color: #d1ccc5;
    font-size: 0.65rem;
  }

  /* ── Mobile ──────────────────────────────────────────────────────────── */
  @media (max-width: 600px) {
    .gallery-carousel {
      width: 100%;
    }

    .quotes-section {
      width: 100%;
      padding: 2rem 1rem 3rem;
    }

    .slide-img {
      width: 80%;
      max-height: 80vw;
    }

    .arrow {
      width: 38px;
      height: 38px;
    }

    .arrow-left {
      left: 8px;
    }

    .arrow-right {
      right: 8px;
    }

    .quotes-frame {
      padding: 2rem 1.5rem;
    }
  }
</style>
