<script lang="ts">
  import { onMount } from 'svelte';
  import heroBg from '../assets/hero_bg.jpg';

  export let weddingDate: Date;

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
<section
  class="h-screen flex flex-col justify-center items-center text-center px-4 bg-cover bg-center bg-no-repeat"
  style="background-image: url({heroBg})"
>
  <div class="max-w-3xl animate-fade-in-up">
    <h2 class="tracking-widest md:text-lg text-gray-500 mb-4">We are getting married</h2>
    <h1 class="text-6xl md:text-8xl font-script text-gray-800 mb-6 drop-shadow-sm">Bé Hy & Bé Di</h1>
    <div class="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 text-gray-600">
      <span class="text-base md:text-lg">🇻🇳 Hồ Chí Minh · 27.12.2026</span>
      <span class="hidden sm:inline text-gray-400">·</span>
      <span class="text-base md:text-lg">🇻🇳 Hà Nội · 05.01.2027</span>
    </div>

    <div class="flex gap-4 md:gap-8 justify-center mt-8 text-gray-700">
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-5xl font-script">{days}</span>
        <span class="text-xs uppercase tracking-wider mt-1">Ngày</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-5xl font-script">{hours}</span>
        <span class="text-xs uppercase tracking-wider mt-1">Giờ</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-5xl font-script">{minutes}</span>
        <span class="text-xs uppercase tracking-wider mt-1">Phút</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-5xl font-script">{seconds}</span>
        <span class="text-xs uppercase tracking-wider mt-1">Giây</span>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fade-in-up 1.5s ease-out forwards;
  }
</style>