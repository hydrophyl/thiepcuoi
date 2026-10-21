<script lang="ts">
  export let groom: { title: string; names: string[]; address: string }
  export let bride: { title: string; names: string[]; address: string }
</script>

<section
  class="mx-auto grid w-3/5 grid-cols-2 gap-6 bg-pastelWhite pt-12 text-center font-['Lora',serif] max-[600px]:w-full max-[600px]:px-4 max-[600px]:pt-8"
>
  {#each [groom, bride] as f}
    <div>
      <h3 class="mb-3 text-xl font-semibold tracking-widest text-stone-700">{f.title}</h3>
      {#each f.names as n}
        <p class="text-[1.05rem] font-medium leading-[1.8] text-stone-800">{n}</p>
      {/each}
      <p class="mt-3 text-[0.95rem] leading-[1.7] text-stone-700">{f.address}</p>
    </div>
  {/each}
</section>
