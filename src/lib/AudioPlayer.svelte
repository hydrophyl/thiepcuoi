<script lang="ts">
  import { onMount } from 'svelte';

  export let autoplay = false;

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
  <audio bind:this={audioRef} loop src="/src/assets/maple.m4a"></audio>
  <button 
    on:click={togglePlay}
    class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:scale-110 transition-transform duration-300 border border-pastelLila"
    aria-label="Toggle music"
  >
    {#if isPlaying}
      <!-- Pause Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
    {:else}
      <!-- Play Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    {/if}
  </button>
</div>