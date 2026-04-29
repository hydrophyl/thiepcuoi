<script lang="ts">
  import { onMount } from 'svelte';
  import sanitizeHtml from 'sanitize-html';
  import Hero from './lib/Hero.svelte';
  import Story from './lib/Story.svelte';
  import Gallery from './lib/Gallery.svelte';
  import Locations from './lib/Locations.svelte';
  import RSVP from './lib/RSVP.svelte';
  import AudioPlayer from './lib/AudioPlayer.svelte';

  const weddingDate = new Date('2026-12-27T18:00:00');
  let guestName = '';
  let appellation = 'tôi'; // default self-reference; override via ?appellation=con|cháu|em|…

  onMount(() => {
    // 1. Check for slug in URL (e.g. ?slug=thanh or ?name=thanh)
    const params = new URLSearchParams(window.location.search);
    const rawName = params.get('slug') || params.get('name') || '';
    const rawAppellation = params.get('appellation') || '';

    if (rawAppellation) {
      const clean = sanitizeHtml(rawAppellation, { allowedTags: [], allowedAttributes: {} });
      if (clean) appellation = clean;
    }

    if (rawName) {
      // 2. Prevent XSS: Sanitize the input
      const cleanName = sanitizeHtml(rawName, {
        allowedTags: [],
        allowedAttributes: {}
      });
      
      // Use split/map instead of \b\w regex — the latter mishandles Vietnamese diacritics
      // (e.g. it capitalises the consonant after à/ê/ô as a new "word boundary").
      guestName = cleanName
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // 3. Track people visited using our backend API
    setTimeout(() => {
      fetch('http://localhost:8000/track-visit', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guest: guestName, time: new Date().toISOString() }) 
      }).catch(err => console.error("Logging visit failed connecting to backend"));
      
      console.log(`[Insight Tracking] Visit recorded. Guest: ${guestName || 'Anonymous'}`);
    }, 1000);
  });
</script>

<main class="font-sans antialiased text-gray-800 scroll-smooth overflow-x-hidden">
  {#if guestName}
    <div class="bg-pastelBlue text-white text-center py-2 px-4 shadow-md sticky top-0 z-50">
      <p class="text-sm font-viet">Kính mời <span class="font-bold text-slate-800 font-viet">{guestName}</span> tới dự lễ cưới của chúng {appellation}!</p>
    </div>
  {/if}

  <Hero {weddingDate} />
  <Story />
  <Gallery />
  <Locations />
  <RSVP guestName={guestName} {appellation} />
  <AudioPlayer autoplay={false} />
  
  <footer class="py-8 bg-gray-50 text-center border-t border-gray-200">
    <p class="font-script text-2xl text-gray-600">Bé Di & Bé Hy</p>
    <p class="text-xs text-gray-400 mt-2 uppercase tracking-widest">© 2026 - Hẹn bạn nha</p>
  </footer>
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>