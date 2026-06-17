<script lang="ts">
  import { onMount } from 'svelte';
  import heroBg from '../assets/hero_bg.jpg';
  import type { Locale } from './locales';
  export let appellation = 'chúng mình';

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
    <h2 class="tracking-widest text-3xl md:text-5xl mb-4">{locale.heroSubheading({appellation})}</h2>
    <h1 class="text-5xl md:text-8xl font-script text-gray-800 mb-4 drop-shadow-sm">Duy & Thy</h1>

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
        <span class="flex justify-center items-center text-3xl md:text-5xl font-script bg-green-100 w-22 h-22 rounded-xl opacity-80" aria-hidden="true">{days}</span>
        <span class="text-xs uppercase tracking-wider mt-1">{locale.countdown.days}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="flex justify-center items-center text-3xl md:text-5xl font-script bg-green-100 w-22 h-22 rounded-xl opacity-80" aria-hidden="true">{hours}</span>
        <span class="text-xs uppercase tracking-wider mt-1">{locale.countdown.hours}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="flex justify-center items-center text-3xl md:text-5xl font-script bg-green-100 w-22 h-22 rounded-xl opacity-80" aria-hidden="true">{minutes}</span>
        <span class="text-xs uppercase tracking-wider mt-1">{locale.countdown.minutes}</span>
      </div>
    </div>
  </div>
</section>

