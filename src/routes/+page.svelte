<script lang="ts">
  import ProductCard from '$lib/components/ProductCard.svelte';
  import type { PageData } from './$types';
  import { getWhatsAppLink } from '$lib/config';
  import { Truck, ShieldCheck, Sparkles, MapPin, MessageCircle, Phone, ArrowRight } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Butwal Candle Hub — Light Up Your Tihar With Beautiful Candles</title>
  <meta name="description" content="Make every celebration brighter with beautiful candles from Butwal Candle Hub. Explore our collections and order from anywhere in Nepal." />
  <meta property="og:title" content="Butwal Candle Hub — Light Up Your Tihar With Beautiful Candles" />
  <meta property="og:description" content="Make every celebration brighter with beautiful candles from Butwal Candle Hub. Order from anywhere in Nepal." />
  <meta property="og:type" content="website" />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-gradient-to-b from-beige to-cream overflow-hidden">
  <div class="section-padding py-12 sm:py-16 lg:py-20">
    <div class="max-w-3xl mx-auto text-center">
      <div class="inline-flex items-center gap-2 badge-gold mb-4">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Tihar Special Collection</span>
      </div>
      <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-4 text-balance leading-tight">
        Light Up Your Tihar With Beautiful Candles
      </h1>
      <p class="text-base sm:text-lg text-brown-light mb-8 max-w-2xl mx-auto leading-relaxed">
        Make every celebration brighter with beautiful candles from Butwal Candle Hub. Explore our collections and order from anywhere in Nepal.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/shop" class="btn-festive inline-flex items-center justify-center gap-2">
          Explore Collection
          <ArrowRight class="w-4 h-4" />
        </a>
        <a href="/contact" class="btn-outline inline-flex items-center justify-center">
          Contact Us
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Featured Collections -->
{#if data.featured.length > 0}
  <section class="section-padding py-12">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-serif text-2xl font-bold text-brown">Featured Collections</h2>
        <p class="text-sm text-brown-light mt-1">Handpicked candles for your celebrations</p>
      </div>
      <a href="/shop" class="text-sm text-gold hover:text-gold-dark transition-colors flex items-center gap-1">
        View All <ArrowRight class="w-4 h-4" />
      </a>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {#each data.featured as product}
        <ProductCard {product} />
      {/each}
    </div>
  </section>
{/if}

<!-- Categories -->
{#if data.categories.length > 0}
  <section class="bg-beige py-12">
    <div class="section-padding">
      <h2 class="font-serif text-2xl font-bold text-brown text-center mb-6">Shop by Category</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {#each data.categories as cat}
          <a
            href="/shop?category={cat.slug}"
            class="bg-white rounded-xl p-4 text-center hover:shadow-md transition-all border border-beige-dark/30 hover:border-gold"
          >
            <div class="w-12 h-12 mx-auto mb-2 bg-gold/10 rounded-full flex items-center justify-center">
              <Sparkles class="w-6 h-6 text-gold" />
            </div>
            <p class="text-sm font-medium text-brown">{cat.name}</p>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- Best Sellers -->
{#if data.bestSellers.length > 0}
  <section class="section-padding py-12">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-serif text-2xl font-bold text-brown">Best Sellers</h2>
        <p class="text-sm text-brown-light mt-1">Our most popular candles</p>
      </div>
      <a href="/shop" class="text-sm text-gold hover:text-gold-dark transition-colors flex items-center gap-1">
        View All <ArrowRight class="w-4 h-4" />
      </a>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {#each data.bestSellers as product}
        <ProductCard {product} />
      {/each}
    </div>
  </section>
{/if}

<!-- New Arrivals -->
{#if data.newArrivals.length > 0}
  <section class="bg-beige py-12">
    <div class="section-padding">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-serif text-2xl font-bold text-brown">New Arrivals</h2>
          <p class="text-sm text-brown-light mt-1">Latest additions to our collection</p>
        </div>
        <a href="/shop" class="text-sm text-gold hover:text-gold-dark transition-colors flex items-center gap-1">
          View All <ArrowRight class="w-4 h-4" />
        </a>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {#each data.newArrivals as product}
          <ProductCard {product} />
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- Why Shop With Us -->
<section class="section-padding py-12">
  <h2 class="font-serif text-2xl font-bold text-brown text-center mb-8">Why Shop With Us</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="text-center p-4">
      <div class="w-14 h-14 mx-auto mb-3 bg-gold/10 rounded-full flex items-center justify-center">
        <Truck class="w-7 h-7 text-gold" />
      </div>
      <h3 class="font-semibold text-brown mb-1">Nationwide Delivery</h3>
      <p class="text-sm text-brown-light">We deliver across all of Nepal with reliable shipping</p>
    </div>
    <div class="text-center p-4">
      <div class="w-14 h-14 mx-auto mb-3 bg-gold/10 rounded-full flex items-center justify-center">
        <ShieldCheck class="w-7 h-7 text-gold" />
      </div>
      <h3 class="font-semibold text-brown mb-1">Quality Candles</h3>
      <p class="text-sm text-brown-light">Carefully crafted candles for every occasion</p>
    </div>
    <div class="text-center p-4">
      <div class="w-14 h-14 mx-auto mb-3 bg-gold/10 rounded-full flex items-center justify-center">
        <Sparkles class="w-7 h-7 text-gold" />
      </div>
      <h3 class="font-semibold text-brown mb-1">Festival Special</h3>
      <p class="text-sm text-brown-light">Beautiful Tihar and Diwali collection available</p>
    </div>
    <div class="text-center p-4">
      <div class="w-14 h-14 mx-auto mb-3 bg-gold/10 rounded-full flex items-center justify-center">
        <MapPin class="w-7 h-7 text-gold" />
      </div>
      <h3 class="font-semibold text-brown mb-1">Based in Butwal</h3>
      <p class="text-sm text-brown-light">Serving customers throughout Nepal</p>
    </div>
  </div>
</section>

<!-- Contact Section -->
<section class="bg-brown text-cream py-12">
  <div class="section-padding text-center">
    <h2 class="font-serif text-2xl font-bold mb-3">Get In Touch</h2>
    <p class="text-cream/70 mb-6 max-w-xl mx-auto">
      Have questions about our candles? We're here to help. Reach out via WhatsApp or phone.
    </p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a
        href={getWhatsAppLink('Hello Butwal Candle Hub, I have a question about your candles.')}
        target="_blank"
        rel="noopener"
        class="btn-festive inline-flex items-center justify-center gap-2"
      >
        <MessageCircle class="w-5 h-5" />
        WhatsApp Us
      </a>
      <a href="/contact" class="btn-outline inline-flex items-center justify-center border-cream text-cream hover:bg-cream hover:text-brown">
        Contact Page
      </a>
    </div>
  </div>
</section>
