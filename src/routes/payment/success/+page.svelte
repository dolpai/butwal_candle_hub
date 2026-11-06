<script lang="ts">
  import type { PageData } from './$types';
  import { CheckCircle, XCircle, ArrowRight } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Payment {data.verified ? 'Successful' : 'Failed'} — Butwal Candle Hub</title>
</svelte:head>

<div class="section-padding py-8 sm:py-12">
  <div class="max-w-md mx-auto text-center">
    {#if data.verified && data.order}
      <div class="w-16 h-16 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
        <CheckCircle class="w-10 h-10 text-success" />
      </div>
      <h1 class="font-serif text-2xl font-bold text-brown mb-2">Payment Successful!</h1>
      <p class="text-brown-light mb-4">Your eSewa payment has been verified.</p>

      <div class="bg-beige rounded-xl p-4 mb-4">
        <p class="text-xs text-brown-light mb-1">Order Reference</p>
        <p class="font-serif text-xl font-bold text-gold-dark tracking-wider">{data.order.order_number}</p>
      </div>

      <a href="/track-order?order={data.order.order_number}&phone={data.order.customer_phone}" class="btn-primary">
        Track Your Order
      </a>
    {:else}
      <div class="w-16 h-16 mx-auto mb-4 bg-danger/10 rounded-full flex items-center justify-center">
        <XCircle class="w-10 h-10 text-danger" />
      </div>
      <h1 class="font-serif text-2xl font-bold text-brown mb-2">Payment Verification Failed</h1>
      <p class="text-brown-light mb-4">{data.error || 'We could not verify your payment.'}</p>
      <p class="text-sm text-brown-light mb-4">
        If you believe this is an error, please contact us with your order number.
      </p>
      <div class="flex flex-col gap-2">
        <a href="/contact" class="btn-primary">Contact Us</a>
        <a href="/shop" class="btn-outline">Continue Shopping <ArrowRight class="w-4 h-4" /></a>
      </div>
    {/if}
  </div>
</div>
