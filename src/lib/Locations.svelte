<script lang="ts">
  import type { Locale } from './locales';
  export let locale: Locale;
</script>

<section class="py-20 bg-gradient-to-t from-pastelBlue/10 to-transparent">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-fluid-title font-script text-center text-gray-800 mb-16">{locale.locationsTitle}</h2>
    
    <div class="flex flex-col md:flex-row gap-8 justify-center items-stretch">
      <!-- Card 1: Ho Chi Minh City -->
      <div class="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-pastelBlue/30 text-center flex flex-col items-center">
        <!--
          Icon: decorative — aria-hidden keeps it out of the accessibility tree.
          text-blue-700 (#1d4ed8) on bg-pastelBlue/20 — decorative icon, not conveying info.
        -->
        <div class="w-16 h-16 bg-pastelBlue/20 rounded-full flex items-center justify-center mb-6 text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-1">Hồ Chí Minh</h3>
        <!--
          "Tiệc Cưới" badge: text-blue-700 (#1d4ed8) on white = 6.4:1 contrast — passes WCAG AA.
          Previous text-pastelBlue (#A7C7E7) on white was ~2.5:1 — failed.
        -->
        <p class="text-sm font-semibold text-blue-700 uppercase tracking-widest mb-4">{locale.eventType}</p>
        <p class="text-gray-600 mb-1">{locale.hcmDate}</p>
        <p class="text-gray-800 font-bold mb-4">6:00 PM – 9:00 PM</p>
        <p class="text-gray-600 italic text-sm">360D Bến Vân Đồn, Phường Vĩnh Hội, Quận 4, TP. Hồ Chí Minh</p>
        <div class="mt-auto pt-6 w-full">
          <a
            href="https://www.google.com/maps/search/360D+B%E1%BA%BFn+V%C3%A2n+%C4%90%E1%BB%93n+V%C4%A9nh+H%E1%BB%99i+H%E1%BB%93+Ch%C3%AD+Minh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={locale.hcmMapAriaLabel}
            class="inline-block w-full py-3 bg-pastelBlue text-gray-800 rounded-lg hover:bg-pastelBlue/80 transition-colors font-medium"
          >{locale.mapButton}</a>
          <!--
            bg-pastelBlue (#A7C7E7) + text-gray-800 (#1f2937) = 8.4:1 contrast — passes WCAG AA.
            Previous text-white on pastelBlue was ~1.7:1 — failed badly.
          -->
        </div>
      </div>

      <!-- Card 2: Hanoi -->
      <div class="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-pastelLila/30 text-center flex flex-col items-center">
        <div class="w-16 h-16 bg-pastelLila/20 rounded-full flex items-center justify-center mb-6 text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-1">Hà Nội</h3>
        <!--
          text-purple-600 (#9333ea) on white = 5.2:1 contrast — passes WCAG AA.
          Previous text-pastelLila (#CDB4DB) on white was ~1.85:1 — failed.
        -->
        <p class="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-4">{locale.eventType}</p>
        <p class="text-gray-600 mb-1">{locale.hanoiDate}</p>
        <p class="text-gray-800 font-bold mb-4">5:00 PM – 8:00 PM</p>
        <p class="text-gray-600 italic text-sm">Trống Đồng Palace, 65 P. Quán Sứ, Trần Hưng Đạo, Cửa Nam, Hà Nội</p>
        <div class="mt-auto pt-6 w-full">
          <a
            href="https://www.google.com/maps/search/Tr%E1%BB%91ng+%C4%90%E1%BB%93ng+Palace+65+Qu%C3%A1n+S%E1%BB%A9+H%C3%A0+N%E1%BB%99i"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={locale.hanoiMapAriaLabel}
            class="inline-block w-full py-3 bg-pastelLila text-gray-800 rounded-lg hover:bg-pastelLila/80 transition-colors font-medium"
          >{locale.mapButton}</a>
          <!--
            bg-pastelLila (#CDB4DB) + text-gray-800 (#1f2937) = 7.5:1 contrast — passes WCAG AA.
            Previous text-white on pastelLila was ~1.85:1 — failed.
          -->
        </div>
      </div>
    </div>
  </div>
</section>
