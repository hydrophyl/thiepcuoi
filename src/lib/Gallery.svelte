<script lang="ts">
  // Eagerly import all jpg images from the gallery folder.
  // Vite resolves these at build time and returns hashed asset URLs.
  const modules = import.meta.glob('../assets/gallery/*.jpg', { eager: true }) as Record<string, { default: string }>;
  const photos = Object.values(modules).map(m => m.default);

  // Bento grid spans — cycles through for any number of images.
  // Pattern: small, tall-wide, small, wide, small, small, small, small, …
  const spans: string[] = [
    'col-span-1 row-span-1',
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
  ];
</script>

<section class="py-20 bg-pastelWhite">
  <div class="max-w-5xl mx-auto px-4">
    <h2 class="text-5xl font-script text-center text-gray-800 mb-12">Kỷ Niệm</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
      {#each photos as src, i}
        <div class="{spans[i % spans.length]} bg-gray-200 rounded-lg overflow-hidden relative group">
          <img
            {src}
            alt="Ảnh cưới {i + 1}"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      {/each}
    </div>
  </div>
</section>