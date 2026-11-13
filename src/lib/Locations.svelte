<script lang="ts">
  import type { Locale } from './locales'
  import { venueCards, type Venue } from './venue'

  export let locale: Locale
  // Which reception(s) to show: 'all' on the main pages, one city on /hn, /sg
  export let venue: Venue = 'all'

  $: cards = venueCards(venue)
  // One card would stretch to the full 6xl grid width, so cap it
  $: single = venue !== 'all'
</script>

<section
  class="py-10 md:py-20 bg-linear-to-t from-pastelBlue/10 to-transparent"
>
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-4xl md:text-6xl font-script text-center text-gray-800">
      {locale.locationsTitle}
    </h2>

    <div
      class="flex flex-col md:flex-row gap-8 justify-center items-stretch {single
        ? 'max-w-md mx-auto'
        : ''}"
    >
      {#each cards as card (card.id)}
        <!--
          Icon: decorative — aria-hidden keeps it out of the accessibility tree.
          Icon colours: text-blue-700 (#1d4ed8) / text-purple-600 (#9333ea) on a
          20% pastel circle — decorative icon, not conveying info.
        -->
        <div
          class="flex-1 bg-white p-8 rounded-2xl shadow-sm border text-center flex flex-col items-center {card.accent ===
          'blue'
            ? 'border-pastelBlue/30'
            : 'border-pastelLila/30'}"
        >
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mb-6 {card.accent ===
            'blue'
              ? 'bg-pastelBlue/20 text-blue-700'
              : 'bg-pastelLila/20 text-purple-600'}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
              ><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
              ></path><circle cx="12" cy="10" r="3"></circle></svg
            >
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-1">{card.city}</h3>
          <p class="text-gray-600 mb-1">{card.dateLabel(locale)}</p>
          <p class="text-gray-800 font-bold mb-4">{card.time}</p>
          <p class="text-gray-600 italic text-sm">
            {card.address}
          </p>
          <div class="mt-auto pt-6 w-full">
            <!--
              bg-pastelBlue (#A7C7E7) / bg-pastelLila (#CDB4DB) + text-gray-800 (#1f2937)
              = 8.4:1 / 7.5:1 contrast — passes WCAG AA.
            -->
            <a
              href={card.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={card.mapAriaLabel(locale)}
              class="inline-block w-full py-3 text-gray-800 rounded-lg transition-colors font-medium {card.accent ===
              'blue'
                ? 'bg-pastelBlue hover:bg-pastelBlue/80'
                : 'bg-pastelLila hover:bg-pastelLila/80'}"
              >{locale.mapButton}</a
            >
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
