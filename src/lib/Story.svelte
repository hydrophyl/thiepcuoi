<script lang="ts">

  // ── Photos for the heart collage ─────────────────────────────────────────
  const storyModules = import.meta.glob('../assets/story/*.jpg', { eager: true }) as Record<string, { default: string }>;
  // Sort by the numeric filename so 1.jpg < 2.jpg < … < 18.jpg
  const photos: (string | null)[] = Array.from({ length: 18 }, (_, i) => {
    const key = `../assets/story/${i + 1}.jpg`;
    return storyModules[key]?.default ?? null;
  });

  // Heart shape: 18 cells in a 5 × 5 grid (col/row are 1-based CSS grid values)
  const heartPositions = [
    // Row 1 – two humps (4 cells, gap at col 3)
    { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 4, row: 1 }, { col: 5, row: 1 },
    // Row 2 – full width (5 cells)
    { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }, { col: 4, row: 2 }, { col: 5, row: 2 },
    // Row 3 – full width (5 cells)
    { col: 1, row: 3 }, { col: 2, row: 3 }, { col: 3, row: 3 }, { col: 4, row: 3 }, { col: 5, row: 3 },
    // Row 4 – narrowing (3 cells)
    { col: 2, row: 4 }, { col: 3, row: 4 }, { col: 4, row: 4 },
    // Row 5 – tip (1 cell)
    { col: 3, row: 5 },
  ]; // total: 18 positions
</script>

<section class="py-20 bg-white">
  <div class="max-w-4xl mx-auto px-4">
    <!-- 8-year intro -->
    <div class="text-center mb-16">
      <h2 class="text-5xl font-script text-gray-800 mb-4">Our Story</h2>
      <p class="text-2xl md:text-3xl font-light text-gray-600 leading-relaxed">
        8 years. Countless memories. One incredible journey…
      </p>
    </div>
    <!-- Heart photo collage -->
    <div class="flex justify-center mb-16">
      <div class="grid grid-cols-5 grid-rows-5 gap-2" style="width: min(400px, 90vw); height: min(400px, 90vw);">
        {#each heartPositions as pos, i}
          <div
            class="rounded-lg overflow-hidden bg-pastelLila/20"
            style="grid-column: {pos.col}; grid-row: {pos.row};"
          >
            {#if photos[i]}
              <img src={photos[i]} alt="Memory {i + 1}" class="w-full h-full object-cover" />
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Turning the page -->
    <div class="text-center mb-16">
      <p class="text-xl md:text-2xl text-gray-700 leading-relaxed font-light italic">
        This year, we're turning the page to a special chapter — to become <span class="font-semibold not-italic text-gray-900">Husband &amp; Wife</span>
      </p>
    </div>

    <!-- Note to European friends -->
    <div class="bg-pastelBlue/10 border border-pastelBlue/30 rounded-2xl p-8 md:p-10 text-gray-700 leading-relaxed text-base md:text-lg">
      <p class="mb-0">
        To our dearest friends: you have been the heartbeat of our eight-year journey, and your support is the soundtrack to our story. We know that traveling to Vietnam is a long journey — especially during a season meant for rest and family here in Europe. Please know that while we would be overjoyed to celebrate with you at either (or both!) of our weddings, we truly understand if the distance is too great. Your love and well-wishes have already warmed our hearts more than words can say. 💛
      </p>
    </div>
  </div>
</section>