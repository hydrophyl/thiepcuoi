<script lang="ts">
  import { onMount } from 'svelte';
  // Import through Vite so the file gets a content-hash URL (proper cache busting).
  import audioSrc from '../assets/perfect.opus';
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
  <div class="relative">
    <span class="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 font-sans text-gray-600 text-sm whitespace-nowrap">
      Music here!
    </span>
    <button
      on:click={togglePlay}
      class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:scale-110 transition-transform duration-300 border border-pastelLila"
      aria-label={isPlaying ? locale.audioPause : locale.audioPlay}
    >
    {#if isPlaying}
      <!-- Pause Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
    {:else}
      <!-- Play Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="ml-0.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    {/if}
  </button>
  </div>
</div>
