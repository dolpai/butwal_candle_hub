<script lang="ts">
  import { page } from '$app/stores';
  import { cart } from '$lib/cart.svelte';
  import { getCartCount } from '$lib/cart.svelte';
  import type { Category, StoreSettings } from '$lib/types';
  import { getWhatsAppLink } from '$lib/config';
  import { Menu, X, ShoppingBag, Search, Phone } from 'lucide-svelte';

  let { categories, storeSettings, session }: { categories: Category[]; storeSettings: StoreSettings; session: any } = $props();

  let mobileMenuOpen = $state(false);
  let searchOpen = $state(false);
  let searchQuery = $state('');

  let cartCount = $derived(getCartCount($cart));

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function handleSearch(e: Event) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
      searchOpen = false;
      mobileMenuOpen = false;
    }
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
    searchOpen = false;
  }
</script>

<header class="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-beige-dark/40">
  <!-- Announcement Bar -->
  {#if storeSettings.announcement}
    <div class="bg-brown text-cream text-center text-xs sm:text-sm py-2 px-4">
      {storeSettings.announcement}
    </div>
  {/if}

  <div class="section-padding">
    <div class="flex items-center justify-between h-16">
      <!-- Mobile Menu Button -->
      <button
        class="lg:hidden btn-ghost p-2"
        onclick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {#if mobileMenuOpen}
          <X class="w-6 h-6" />
        {:else}
          <Menu class="w-6 h-6" />
        {/if}
      </button>

      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 lg:flex-1" onclick={closeMobileMenu}>
        <div class="flex flex-col">
          <span class="font-serif text-lg sm:text-xl font-bold text-brown leading-tight">
            Butwal Candle Hub
          </span>
          <span class="text-[10px] text-gold tracking-widest uppercase hidden sm:block">
            Light Up Your Celebrations
          </span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-1">
        <a href="/" class="btn-ghost text-sm">Home</a>
        <a href="/shop" class="btn-ghost text-sm">Shop</a>
        {#if categories.length > 0}
          <div class="relative group">
            <button class="btn-ghost text-sm flex items-center gap-1">
              Categories
            </button>
            <div class="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-beige-dark/40 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {#each categories as cat}
                <a
                  href="/shop?category={cat.slug}"
                  class="block px-4 py-2 text-sm text-brown hover:bg-beige hover:text-gold transition-colors"
                >
                  {cat.name}
                </a>
              {/each}
            </div>
          </div>
        {/if}
        <a href="/track-order" class="btn-ghost text-sm">Track Order</a>
        <a href="/contact" class="btn-ghost text-sm">Contact</a>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center gap-1 lg:flex-1 justify-end">
        <button
          class="btn-ghost p-2"
          onclick={() => (searchOpen = !searchOpen)}
          aria-label="Search"
        >
          <Search class="w-5 h-5" />
        </button>

        <a href="/cart" class="relative btn-ghost p-2" aria-label="Shopping cart">
          <ShoppingBag class="w-5 h-5" />
          {#if cartCount > 0}
            <span class="absolute -top-0.5 -right-0.5 bg-festive text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          {/if}
        </a>

        {#if session?.user}
          <a href="/admin" class="hidden lg:inline-flex btn-ghost text-sm">
            Admin
          </a>
        {/if}
      </div>
    </div>

    <!-- Search Bar -->
    {#if searchOpen}
      <form onsubmit={handleSearch} class="pb-3 animate-fade-in">
        <div class="relative">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search candles..."
            class="input-field pr-10"
            autofocus
          />
          <button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light">
            <Search class="w-5 h-5" />
          </button>
        </div>
      </form>
    {/if}
  </div>

  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div class="lg:hidden bg-cream border-t border-beige-dark/40 animate-slide-up">
      <nav class="section-padding py-4 flex flex-col gap-1">
        <a href="/" class="px-4 py-3 rounded-lg hover:bg-beige transition-colors font-medium" onclick={closeMobileMenu}>
          Home
        </a>
        <a href="/shop" class="px-4 py-3 rounded-lg hover:bg-beige transition-colors font-medium" onclick={closeMobileMenu}>
          Shop
        </a>
        {#if categories.length > 0}
          <div class="px-4 py-2">
            <span class="text-sm font-semibold text-brown-light uppercase tracking-wide">Categories</span>
          </div>
          {#each categories as cat}
            <a
              href="/shop?category={cat.slug}"
              class="pl-8 pr-4 py-2 rounded-lg hover:bg-beige transition-colors text-sm"
              onclick={closeMobileMenu}
            >
              {cat.name}
            </a>
          {/each}
        {/if}
        <a href="/track-order" class="px-4 py-3 rounded-lg hover:bg-beige transition-colors font-medium" onclick={closeMobileMenu}>
          Track Order
        </a>
        <a href="/contact" class="px-4 py-3 rounded-lg hover:bg-beige transition-colors font-medium" onclick={closeMobileMenu}>
          Contact
        </a>

        <div class="border-t border-beige-dark/40 mt-2 pt-2">
          <a
            href={getWhatsAppLink('Hello Butwal Candle Hub, I have a question about your candles.')}
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#25D366] text-white font-medium"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.94-5.335 11.943-11.893a11.821 11.821 0 00-3.479-8.413z"/></svg>
            WhatsApp Us
          </a>
          {#each storeSettings.phone_numbers || [] as phone}
            <a
              href="tel:+977{phone.replace(/^0/, '')}"
              class="flex items-center gap-2 px-4 py-3 rounded-lg bg-brown text-cream font-medium"
            >
              <Phone class="w-5 h-5" />
              Call {phone}
            </a>
          {/each}
        </div>
      </nav>
    </div>
  {/if}
</header>
