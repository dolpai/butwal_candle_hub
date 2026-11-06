<script lang="ts">
  import type { PageData } from './$types';
  import { XCircle, ArrowRight } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Payment Failed — Butwal Candle Hub</title>
</svelte:head>

<div class="section-padding py-8 sm:py-12">
  <div class="max-w-md mx-auto text-center">
    <div class="w-16 h-16 mx-auto mb-4 bg-danger/10 rounded-full flex items-center justify-center">
      <XCircle class="w-10 h-10 text-danger" />
    </div>
    <h1 class="font-serif text-2xl font-bold text-brown mb-2">Payment Failed</h1>
    <p class="text-brown-light mb-4">{data.error}</p>
    <p class="text-sm text-brown-light mb-4">
      Your order has not been processed. You can try again or use Cash on Delivery.
    </p>
    {#if data.orderNumber}
      <p class="text-sm text-brown-light mb-4">Order Reference: <span class="font-mono font-medium text-brown">{data.orderNumber}</span></p>
    {/if}
    <div class="flex flex-col gap-2">
      <a href="/shop" class="btn-primary">Continue Shopping <ArrowRight class="w-4 h-4" /></a>
      <a href="/contact" class="btn-outline">Contact Us</a>
    </div>
  </div>
</div>
