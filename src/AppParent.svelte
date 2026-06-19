<script lang="ts">
  import { onMount } from 'svelte'
  import Hero from './lib/Hero.svelte'
  import Gallery from './lib/Gallery.svelte'
  import Locations from './lib/Locations.svelte'
  import RSVP from './lib/RSVP.svelte'
  import AudioPlayer from './lib/AudioPlayer.svelte'
  import { vi, type Locale } from './lib/locales'

  const locale: Locale = vi

  const weddingDate = new Date('2026-12-27T18:00:00')
  let guestName = ''
  let appellation = ' chúng tôi'
  let salutation = ''

  let parentQuotes: string[] = []
  $: parentQuotes = (salutation || appellation)
    ? [
        `Trân trọng thân mời ${salutation || 'quý vị'} tới dự lễ cưới của ${appellation}!`,
        `Sự hiện diện của ${salutation || 'quý vị'} là niềm vinh dự lớn lao cho gia đình.`,
        `Gia đình rất mong được đón tiếp ${salutation || 'quý vị'} tại hai buổi tiệc cưới thân mật này.`,
        `Xin cảm ơn ${salutation || 'quý vị'} vì tình cảm và sự ủng hộ dành cho ${appellation}.`,
      ]
    : [
        'Trân trọng thân mời quý vị tới dự lễ cưới của chúng tôi!',
        'Sự hiện diện của quý vị là niềm vinh dự lớn lao cho gia đình chúng tôi.',
        'Gia đình chúng tôi mong được đón tiếp quý vị tại hai buổi tiệc cưới thân mật này.',
        'Xin cảm ơn quý vị vì tình cảm và sự ủng hộ dành cho chúng tôi.',
      ]

  const parentEnQuotes = [
    'We cordially invite you to celebrate the wedding of our beloved children!',
    'Your presence would be a tremendous honor for our family.',
    'We look forward to welcoming you at these two intimate receptions.',
    'Thank you for your love and support for our children.',
  ]

  function stripHtml(raw: string): string {
    const el = document.createElement('div')
    el.innerHTML = raw
    return el.textContent ?? ''
  }

  onMount(() => {
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
      const cleanName = stripHtml(rawName)
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
    <div
      class="bg-pastelBlue text-gray-800 text-center py-2 px-4 shadow-md sticky top-0 z-50"
    >
      <p class="text-sm font-viet">
        {locale.guestBanner({ name: guestName, salutation, appellation })}
      </p>
    </div>
  {/if}

  <Hero {weddingDate} {locale} {appellation} />
  <Locations {locale} />
  <Gallery
    {locale}
    {appellation}
    {salutation}
    quotesOverride={parentEnQuotes}
    viQuotesOverride={parentQuotes}
  />
  <RSVP {guestName} {appellation} {salutation} {locale} />
  <AudioPlayer autoplay={false} {locale} />

  <footer class="py-8 bg-gray-50 text-center border-t border-gray-200">
    <p class="font-script text-2xl text-gray-600">Đức Duy & Xuân Thy</p>
    <p class="text-xs text-gray-400 mt-2 uppercase tracking-widest">
      {locale.footerTagline({ salutation })}
    </p>
  </footer>
</main>
