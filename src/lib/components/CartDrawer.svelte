<script lang="ts">
  import { cart, getCartTotal, getEffectivePrice } from '$lib/cart.svelte';
  import { formatNPR } from '$lib/utils';
  import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-svelte';

  let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

  let total = $derived(getCartTotal($cart));
</script>

{#if isOpen}
  <div class="fixed inset-0 z-[60] bg-brown/60 backdrop-blur-sm animate-fade-in" onclick={onClose}></div>
  <aside
    class="fixed top-0 right-0 z-[70] h-full w-full max-w-sm bg-cream shadow-xl flex flex-col animate-slide-up"
  >
    <header class="flex items-center justify-between px-4 py-4 border-b border-beige-dark/40">
      <h2 class="font-serif text-lg font-bold text-brown">Shopping Cart</h2>
      <button onclick={onClose} class="btn-ghost p-2" aria-label="Close cart">
        <X class="w-5 h-5" />
      </button>
    </header>

    <div class="flex-1 overflow-y-auto p-4">
      {#if $cart.length === 0}
        <div class="flex flex-col items-center justify-center h-full text-brown-light/50">
          <ShoppingBag class="w-16 h-16 mb-3" />
          <p class="text-sm">Your cart is empty</p>
          <a href="/shop" class="btn-primary text-sm mt-4" onclick={onClose}>Browse Products</a>
        </div>
      {:else}
        <div class="space-y-3">
          {#each $cart as item (item.product_id)}
            <div class="flex gap-3 bg-white rounded-lg p-3 border border-beige-dark/30">
              <div class="w-16 h-16 rounded-md overflow-hidden bg-beige shrink-0">
                {#if item.image}
                  <img src={item.image} alt={item.name} class="w-full h-full object-cover" loading="lazy" />
                {/if}
              </div>
              <div class="flex-1 min-w-0">
                <a href="/product/{item.slug}" class="text-sm font-medium text-brown hover:text-gold line-clamp-1" onclick={onClose}>
                  {item.name}
                </a>
                <p class="text-sm text-brown-light mt-0.5">{formatNPR(getEffectivePrice(item))}</p>
                <div class="flex items-center gap-2 mt-2">
                  <button
                    class="p-1 rounded-md hover:bg-beige"
                    onclick={() => cart.updateQuantity(item.product_id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus class="w-3.5 h-3.5" />
                  </button>
                  <span class="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    class="p-1 rounded-md hover:bg-beige"
                    onclick={() => cart.updateQuantity(item.product_id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus class="w-3.5 h-3.5" />
                  </button>
                  <button
                    class="ml-auto p-1 text-danger hover:bg-danger/10 rounded-md"
                    onclick={() => cart.remove(item.product_id)}
                    aria-label="Remove item"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if $cart.length > 0}
      <footer class="border-t border-beige-dark/40 p-4 space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-brown-light">Subtotal</span>
          <span class="font-semibold text-brown">{formatNPR(total)}</span>
        </div>
        <div class="flex gap-2">
          <a href="/shop" class="flex-1 btn-outline text-sm text-center py-2.5" onclick={onClose}>
            Continue
          </a>
          <a href="/cart" class="flex-1 btn-primary text-sm py-2.5" onclick={onClose}>
            View Cart
          </a>
        </div>
        <a href="/checkout" class="block btn-festive text-sm text-center py-2.5" onclick={onClose}>
          Checkout
        </a>
      </footer>
    {/if}
  </aside>
{/if}
