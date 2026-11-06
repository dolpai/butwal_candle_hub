<script lang="ts">
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { cart } from '$lib/cart.svelte';
  import { toasts } from '$lib/toast.svelte';
  import { formatNPR, getEffectivePrice, getDiscountPercentage, isOutOfStock } from '$lib/utils';
  import type { PageData } from './$types';
  import { ShoppingBag, Zap, Minus, Plus, ChevronLeft, Check } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();

  let selectedImage = $state(0);
  let quantity = $state(1);

  let effectivePrice = $derived(getEffectivePrice(data.product.price, data.product.discount_price));
  let discountPercent = $derived(
    data.product.discount_price ? getDiscountPercentage(data.product.price, data.product.discount_price) : 0
  );
  let outOfStock = $derived(isOutOfStock(data.product.stock));

  function increaseQty() {
    if (quantity < data.product.stock) {
      quantity++;
    }
  }

  function decreaseQty() {
    if (quantity > 1) {
      quantity--;
    }
  }

  function addToCart() {
    cart.add(
      {
        product_id: data.product.id,
        name: data.product.name,
        slug: data.product.slug,
        price: data.product.price,
        discount_price: data.product.discount_price,
        image: data.product.images?.[0] || null,
        stock: data.product.stock
      },
      quantity
    );
    toasts.success(`${data.product.name} added to cart`);
  }

  function buyNow() {
    addToCart();
    window.location.href = '/checkout';
  }
</script>

<svelte:head>
  <title>{data.product.name} — Butwal Candle Hub</title>
  <meta name="description" content={data.product.description.substring(0, 160)} />
  <meta property="og:title" content={data.product.name} />
  <meta property="og:description" content={data.product.description.substring(0, 160)} />
  {#if data.product.images?.[0]}
    <meta property="og:image" content={data.product.images[0]} />
  {/if}
</svelte:head>

<div class="section-padding py-6 sm:py-8">
  <a href="/shop" class="inline-flex items-center gap-1 text-sm text-brown-light hover:text-gold transition-colors mb-4">
    <ChevronLeft class="w-4 h-4" />
    Back to Shop
  </a>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
    <!-- Images -->
    <div>
      <div class="aspect-square rounded-xl overflow-hidden bg-beige border border-beige-dark/30 mb-3">
        {#if data.product.images && data.product.images.length > 0}
          <img
            src={data.product.images[selectedImage]}
            alt={data.product.name}
            class="w-full h-full object-cover"
          />
        {:else}
          <div class="w-full h-full flex items-center justify-center text-brown-light/30">
            <ShoppingBag class="w-20 h-20" />
          </div>
        {/if}
      </div>
      {#if data.product.images && data.product.images.length > 1}
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          {#each data.product.images as img, i}
            <button
              class="w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 {selectedImage === i ? 'border-gold' : 'border-beige-dark/30 opacity-60'}"
              onclick={() => (selectedImage = i)}
            >
              <img src={img} alt={`${data.product.name} ${i + 1}`} class="w-full h-full object-cover" />
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Details -->
    <div>
      {#if data.product.category}
        <a href="/shop?category={data.product.category.slug}" class="text-sm text-gold hover:text-gold-dark transition-colors">
          {data.product.category.name}
        </a>
      {/if}
      <h1 class="font-serif text-2xl sm:text-3xl font-bold text-brown mt-1 mb-3">{data.product.name}</h1>

      <div class="flex items-center gap-3 mb-4">
        <span class="font-serif text-2xl font-bold text-brown">{formatNPR(effectivePrice)}</span>
        {#if data.product.discount_price}
          <span class="text-lg text-brown-light/50 line-through">{formatNPR(data.product.price)}</span>
          <span class="badge bg-festive text-white">Save {discountPercent}%</span>
        {/if}
      </div>

      <div class="mb-4">
        {#if outOfStock}
          <span class="badge-danger">Out of Stock</span>
        {:else if data.product.stock <= 5}
          <span class="badge-warning">Only {data.product.stock} left in stock</span>
        {:else}
          <span class="badge-success"><Check class="w-3 h-3 mr-1" />In Stock ({data.product.stock} available)</span>
        {/if}
      </div>

      <p class="text-brown-light leading-relaxed mb-6 whitespace-pre-line">{data.product.description}</p>

      <!-- Quantity & Actions -->
      {#if !outOfStock}
        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center border border-beige-dark rounded-lg">
            <button onclick={decreaseQty} class="px-3 py-2.5 hover:bg-beige transition-colors" aria-label="Decrease quantity">
              <Minus class="w-4 h-4" />
            </button>
            <span class="px-4 py-2.5 font-medium min-w-[3rem] text-center">{quantity}</span>
            <button onclick={increaseQty} class="px-3 py-2.5 hover:bg-beige transition-colors" aria-label="Increase quantity">
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            onclick={addToCart}
            class="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <ShoppingBag class="w-5 h-5" />
            Add to Cart
          </button>
          <button
            onclick={buyNow}
            class="flex-1 btn-festive flex items-center justify-center gap-2"
          >
            <Zap class="w-5 h-5" />
            Buy Now
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Related Products -->
  {#if data.related.length > 0}
    <section class="mt-12 sm:mt-16">
      <h2 class="font-serif text-xl font-bold text-brown mb-4">You May Also Like</h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {#each data.related as product}
          <ProductCard {product} />
        {/each}
      </div>
    </section>
  {/if}
</div>
