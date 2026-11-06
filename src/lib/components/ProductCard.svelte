<script lang="ts">
  import type { Product } from '$lib/types';
  import { formatNPR, getEffectivePrice, getDiscountPercentage, isOutOfStock } from '$lib/utils';
  import { cart } from '$lib/cart.svelte';
  import { toasts } from '$lib/toast.svelte';
  import { ShoppingBag, Eye } from 'lucide-svelte';

  let { product }: { product: Product } = $props();

  let showQuickView = $state(false);

  let effectivePrice = $derived(getEffectivePrice(product.price, product.discount_price));
  let discountPercent = $derived(
    product.discount_price ? getDiscountPercentage(product.price, product.discount_price) : 0
  );
  let outOfStock = $derived(isOutOfStock(product.stock));

  function addToCart(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    cart.add({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discount_price: product.discount_price,
      image: product.images?.[0] || null,
      stock: product.stock
    });
    toasts.success(`${product.name} added to cart`);
  }
</script>

<div class="card group hover:shadow-md">
  <a href="/product/{product.slug}" class="block relative overflow-hidden aspect-square bg-beige">
    {#if product.images && product.images.length > 0}
      <img
        src={product.images[0]}
        alt={product.name}
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
        loading="lazy"
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center text-brown-light/40">
        <ShoppingBag class="w-12 h-12" />
      </div>
    {/if}

    <!-- Badges -->
    <div class="absolute top-2 left-2 flex flex-col gap-1">
      {#if discountPercent > 0}
        <span class="badge bg-festive text-white">-{discountPercent}%</span>
      {/if}
      {#if product.is_featured}
        <span class="badge bg-gold text-white">Featured</span>
      {/if}
      {#if outOfStock}
        <span class="badge bg-brown text-cream">Out of Stock</span>
      {/if}
    </div>

    <!-- Quick View Button -->
    <button
      class="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
      onclick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        showQuickView = true;
      }}
      aria-label="Quick view"
    >
      <Eye class="w-5 h-5 text-brown" />
    </button>
  </a>

  <div class="p-3 sm:p-4">
    <a href="/product/{product.slug}">
      <h3 class="font-medium text-sm sm:text-base text-brown line-clamp-2 mb-1 hover:text-gold transition-colors">
        {product.name}
      </h3>
    </a>
    {#if product.category}
      <p class="text-xs text-brown-light/60 mb-2">{product.category.name}</p>
    {/if}

    <div class="flex items-center gap-2 mb-3">
      <span class="font-semibold text-brown text-sm sm:text-base">{formatNPR(effectivePrice)}</span>
      {#if product.discount_price}
        <span class="text-xs text-brown-light/50 line-through">{formatNPR(product.price)}</span>
      {/if}
    </div>

    <div class="flex items-center gap-2">
      {#if !outOfStock}
        <button
          onclick={addToCart}
          class="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1.5"
        >
          <ShoppingBag class="w-4 h-4" />
          Add to Cart
        </button>
      {:else}
        <button disabled class="flex-1 btn-primary text-sm py-2 opacity-50 cursor-not-allowed">
          Out of Stock
        </button>
      {/if}
    </div>
  </div>
</div>

<!-- Quick View Modal -->
{#if showQuickView}
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brown/60 backdrop-blur-sm animate-fade-in"
    onclick={() => (showQuickView = false)}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-slide-up"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-0">
        <div class="aspect-square bg-beige overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
          {#if product.images && product.images.length > 0}
            <img src={product.images[0]} alt={product.name} class="w-full h-full object-cover" />
          {/if}
        </div>
        <div class="p-6 flex flex-col">
          <h2 class="font-serif text-xl font-bold text-brown mb-2">{product.name}</h2>
          <div class="flex items-center gap-2 mb-4">
            <span class="font-semibold text-lg text-brown">{formatNPR(effectivePrice)}</span>
            {#if product.discount_price}
              <span class="text-sm text-brown-light/50 line-through">{formatNPR(product.price)}</span>
            {/if}
          </div>
          <p class="text-sm text-brown-light mb-4 line-clamp-4">{product.description}</p>
          <div class="flex gap-2 mt-auto">
            <button
              onclick={() => {
                addToCart(new Event('click'));
                showQuickView = false;
              }}
              class="flex-1 btn-primary text-sm"
              disabled={outOfStock}
            >
              Add to Cart
            </button>
            <a href="/product/{product.slug}" class="flex-1 btn-outline text-sm text-center">
              View Details
            </a>
          </div>
        </div>
      </div>
      <button
        onclick={() => (showQuickView = false)}
        class="absolute top-2 right-2 bg-white/80 p-2 rounded-full"
        aria-label="Close"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
{/if}
