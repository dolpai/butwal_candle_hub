<script lang="ts">
  import ProductCard from '$lib/components/ProductCard.svelte';
  import type { PageData } from './$types';
  import { Search, SlidersHorizontal, X } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();

  let showFilters = $state(false);

  let localSearch = $state(data.searchQuery || '');

  function updateFilter(key: string, value: string) {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.location.href = url.pathname + (url.search ? `?${url.searchParams}` : '');
  }
</script>

<svelte:head>
  <title>{data.activeCategory ? `${data.activeCategory.name} — ` : ''}Shop — Butwal Candle Hub</title>
  <meta name="description" content="Browse our collection of beautiful candles. {data.activeCategory ? data.activeCategory.name + ' available.' : ''} Order from anywhere in Nepal." />
</svelte:head>

<div class="section-padding py-6 sm:py-8">
  <!-- Page Header -->
  <div class="mb-6">
    <h1 class="font-serif text-2xl sm:text-3xl font-bold text-brown">
      {data.activeCategory ? data.activeCategory.name : 'All Candles'}
    </h1>
    <p class="text-sm text-brown-light mt-1">
      {data.products.length} product{data.products.length !== 1 ? 's' : ''} found
    </p>
  </div>

  <!-- Search & Sort Bar -->
  <div class="flex items-center gap-2 mb-4">
    <form
      class="flex-1 relative"
      onsubmit={(e) => {
        e.preventDefault();
        updateFilter('q', localSearch);
      }}
    >
      <input
        type="text"
        bind:value={localSearch}
        placeholder="Search candles..."
        class="input-field pr-10"
      />
      <button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light">
        <Search class="w-5 h-5" />
      </button>
    </form>

    <select
      value={data.sort}
      onchange={(e) => updateFilter('sort', (e.currentTarget as HTMLSelectElement).value)}
      class="input-field w-auto max-w-[140px] cursor-pointer"
    >
      <option value="latest">Latest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="name">Name: A to Z</option>
    </select>

    <button
      class="btn-ghost p-2 lg:hidden"
      onclick={() => (showFilters = !showFilters)}
      aria-label="Filters"
    >
      <SlidersHorizontal class="w-5 h-5" />
    </button>
  </div>

  <div class="flex gap-6">
    <!-- Sidebar Filters -->
    <aside class="hidden lg:block w-56 shrink-0">
      <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sticky top-24">
        <h3 class="font-semibold text-brown mb-3 text-sm">Categories</h3>
        <div class="space-y-1">
          <button
            class="block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors {!data.categorySlug ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
            onclick={() => updateFilter('category', '')}
          >
            All Products
          </button>
          {#each data.categories as cat}
            <button
              class="block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors {data.categorySlug === cat.slug ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
              onclick={() => updateFilter('category', cat.slug)}
            >
              {cat.name}
            </button>
          {/each}
        </div>

        <h3 class="font-semibold text-brown mt-4 mb-3 text-sm">Availability</h3>
        <div class="space-y-1">
          <button
            class="block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors {!data.availability || data.availability === '' ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
            onclick={() => updateFilter('availability', '')}
          >
            All
          </button>
          <button
            class="block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors {data.availability === 'in-stock' ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
            onclick={() => updateFilter('availability', 'in-stock')}
          >
            In Stock
          </button>
          <button
            class="block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors {data.availability === 'out-of-stock' ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
            onclick={() => updateFilter('availability', 'out-of-stock')}
          >
            Out of Stock
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Filters -->
    {#if showFilters}
      <div class="fixed inset-0 z-[60] bg-brown/60 backdrop-blur-sm lg:hidden" onclick={() => (showFilters = false)}>
        <div
          class="absolute right-0 top-0 h-full w-72 bg-cream p-4 overflow-y-auto animate-slide-up"
          onclick={(e) => e.stopPropagation()}
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-brown">Filters</h3>
            <button onclick={() => (showFilters = false)} class="btn-ghost p-2">
              <X class="w-5 h-5" />
            </button>
          </div>

          <h4 class="font-semibold text-brown mb-2 text-sm">Categories</h4>
          <div class="space-y-1 mb-4">
            <button
              class="block w-full text-left px-3 py-2 rounded-lg text-sm {!data.categorySlug ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
              onclick={() => { updateFilter('category', ''); showFilters = false; }}
            >
              All Products
            </button>
            {#each data.categories as cat}
              <button
                class="block w-full text-left px-3 py-2 rounded-lg text-sm {data.categorySlug === cat.slug ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
                onclick={() => { updateFilter('category', cat.slug); showFilters = false; }}
              >
                {cat.name}
              </button>
            {/each}
          </div>

          <h4 class="font-semibold text-brown mb-2 text-sm">Availability</h4>
          <div class="space-y-1">
            <button
              class="block w-full text-left px-3 py-2 rounded-lg text-sm {!data.availability ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
              onclick={() => { updateFilter('availability', ''); showFilters = false; }}
            >
              All
            </button>
            <button
              class="block w-full text-left px-3 py-2 rounded-lg text-sm {data.availability === 'in-stock' ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
              onclick={() => { updateFilter('availability', 'in-stock'); showFilters = false; }}
            >
              In Stock
            </button>
            <button
              class="block w-full text-left px-3 py-2 rounded-lg text-sm {data.availability === 'out-of-stock' ? 'bg-gold/10 text-gold-dark font-medium' : 'text-brown-light hover:bg-beige'}"
              onclick={() => { updateFilter('availability', 'out-of-stock'); showFilters = false; }}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Product Grid -->
    <div class="flex-1">
      {#if data.products.length === 0}
        <div class="flex flex-col items-center justify-center py-20 text-center">
          <Search class="w-16 h-16 text-brown-light/30 mb-4" />
          <h3 class="font-semibold text-brown-light mb-1">No products found</h3>
          <p class="text-sm text-brown-light/60">Try adjusting your search or filters</p>
          <a href="/shop" class="btn-primary text-sm mt-4">View All Products</a>
        </div>
      {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {#each data.products as product (product.id)}
            <ProductCard {product} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
