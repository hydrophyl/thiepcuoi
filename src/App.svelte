<script lang="ts">
  import { onMount } from 'svelte'
  import Hero from './lib/Hero.svelte'
  import Gallery from './lib/Gallery.svelte'
  import Locations from './lib/Locations.svelte'
  import RSVP from './lib/RSVP.svelte'
  import AudioPlayer from './lib/AudioPlayer.svelte'
  import { vi, en, type Locale } from './lib/locales'

  export let lang: 'vi' | 'en' = 'vi'
  const locale: Locale = lang === 'en' ? en : vi

  const weddingDate = new Date('2026-12-27T18:00:00')
  let guestName = ''
  let appellation = ' chúng tôi' // default self-reference; override via ?appellation=con|cháu|em|…
  let salutation = '' // how to address the guest; override via ?salutation=ông|bà|anh|chị|em|cháu|…

  /** Strip all HTML tags from a string — browser-native, no Node.js deps. */
  function stripHtml(raw: string): string {
    const el = document.createElement('div')
    el.innerHTML = raw
    return el.textContent ?? ''
  }

  onMount(() => {
    // 1. Check for slug in URL (e.g. ?slug=thanh or ?name=thanh)
    const params = new URLSearchParams(window.location.search)
    const rawName = params.get('slug') || params.get('name') || ''
    const rawAppellation = params.get('appellation') || ''
    const rawSalutation = params.get('salutation') || ''

    if (rawAppellation) {
      const clean = stripHtml(rawAppellation)
      if (clean) appellation = clean
    }

    if (rawSalutation) {
      const clean = stripHtml(rawSalutation)
      if (clean) salutation = clean
    }

    if (rawName) {
      // 2. Prevent XSS: strip any HTML tags from the URL param
      const cleanName = stripHtml(rawName)

      // Use split/map instead of \b\w regex — the latter mishandles Vietnamese diacritics
      guestName = cleanName
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
  })
</script>

<main
  id="main-content"
  class="font-sans antialiased text-gray-800 scroll-smooth overflow-x-hidden"
>
  {#if guestName}
    <!-- bg-pastelBlue (#A7C7E7) + text-gray-800 (#1f2937) = 8.4:1 contrast — passes WCAG AA -->
    <div
      class="bg-pastelBlue text-gray-800 text-center py-2 px-4 shadow-md sticky top-0 z-50"
    >
      <p class="text-sm font-viet">
        {locale.guestBanner({ name: guestName, salutation, appellation })}
      </p>
    </div>
  {/if}

  <Hero
    {weddingDate}
    {locale} {appellation}
  />
  <Locations {locale} />
  <Gallery {locale} {appellation} {salutation} />
  <RSVP
    {guestName}
    {appellation}
    {salutation}
    {locale}
  />
  <AudioPlayer
    autoplay={false}
    {locale}
  />

  <footer class="py-8 bg-gray-50 text-center border-t border-gray-200">
    <p class="font-script text-2xl text-gray-600">Đức Duy & Xuân Thy</p>
    <p class="text-xs text-gray-400 mt-2 uppercase tracking-widest">
      {locale.footerTagline({salutation})}
    </p>
  </footer>
</main>

