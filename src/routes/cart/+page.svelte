<script lang="ts">
  import { cart, getCartTotal, getEffectivePrice } from '$lib/cart.svelte';
  import { formatNPR } from '$lib/utils';
  import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-svelte';

  let total = $derived(getCartTotal($cart));
</script>

<svelte:head>
  <title>Shopping Cart — Butwal Candle Hub</title>
  <meta name="description" content="Review your cart and proceed to checkout." />
</svelte:head>

<div class="section-padding py-6 sm:py-8">
  <h1 class="font-serif text-2xl sm:text-3xl font-bold text-brown mb-6">Shopping Cart</h1>

  {#if $cart.length === 0}
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBag class="w-16 h-16 text-brown-light/30 mb-4" />
      <h3 class="font-semibold text-brown-light mb-1">Your cart is empty</h3>
      <p class="text-sm text-brown-light/60 mb-4">Browse our beautiful candle collections</p>
      <a href="/shop" class="btn-primary">Shop Now</a>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-3">
        {#each $cart as item (item.product_id)}
          <div class="bg-white rounded-xl border border-beige-dark/30 p-4 flex gap-4">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-beige shrink-0">
              {#if item.image}
                <img src={item.image} alt={item.name} class="w-full h-full object-cover" loading="lazy" />
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <a href="/product/{item.slug}" class="font-medium text-brown hover:text-gold transition-colors line-clamp-1">
                {item.name}
              </a>
              <p class="text-sm text-brown-light mt-1">{formatNPR(getEffectivePrice(item))}</p>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center border border-beige-dark rounded-lg">
                  <button
                    onclick={() => cart.updateQuantity(item.product_id, item.quantity - 1)}
                    class="px-2 py-1.5 hover:bg-beige transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus class="w-3.5 h-3.5" />
                  </button>
                  <span class="px-3 py-1.5 text-sm font-medium min-w-[2.5rem] text-center">{item.quantity}</span>
                  <button
                    onclick={() => cart.updateQuantity(item.product_id, item.quantity + 1)}
                    class="px-2 py-1.5 hover:bg-beige transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus class="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onclick={() => cart.remove(item.product_id)}
                  class="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="font-semibold text-brown">{formatNPR(getEffectivePrice(item) * item.quantity)}</p>
            </div>
          </div>
        {/each}

        <a href="/shop" class="inline-flex items-center gap-1 text-sm text-gold hover:text-gold-dark transition-colors">
          Continue Shopping
        </a>
      </div>

      <!-- Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl border border-beige-dark/30 p-4 lg:sticky lg:top-24">
          <h2 class="font-semibold text-brown mb-3">Order Summary</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-brown-light">Subtotal</span>
              <span class="font-medium text-brown">{formatNPR(total)}</span>
            </div>
            <div class="flex justify-between text-xs text-brown-light/60">
              <span>Delivery charge</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <hr class="border-beige-dark/30 my-3" />
          <div class="flex justify-between mb-4">
            <span class="font-semibold text-brown">Total</span>
            <span class="font-serif text-xl font-bold text-brown">{formatNPR(total)}</span>
          </div>
          <a href="/checkout" class="btn-festive w-full flex items-center justify-center gap-2">
            Proceed to Checkout
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>
