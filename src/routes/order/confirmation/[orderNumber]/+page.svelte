<script lang="ts">
  import type { PageData } from './$types';
  import { formatNPR, formatDate } from '$lib/utils';
  import { ORDER_STATUS_MAP } from '$lib/config';
  import { cart } from '$lib/cart.svelte';
  import { CheckCircle, Package, MapPin, Phone, ArrowRight } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();

  // Clear cart on successful order
  $effect(() => {
    cart.clear();
  });
</script>

<svelte:head>
  <title>Order Confirmed — Butwal Candle Hub</title>
</svelte:head>

<div class="section-padding py-8 sm:py-12">
  <div class="max-w-2xl mx-auto text-center">
    <div class="w-16 h-16 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
      <CheckCircle class="w-10 h-10 text-success" />
    </div>

    <h1 class="font-serif text-2xl sm:text-3xl font-bold text-brown mb-2">
      Thank You for Shopping with Butwal Candle Hub!
    </h1>
    <p class="text-brown-light mb-6">
      {data.order.payment_method === 'qr'
        ? 'Your order and transaction reference have been received. Payment remains pending until our team verifies it manually.'
        : 'Your order has been received. Our team will contact you to confirm delivery.'}
    </p>

    <!-- Order Number -->
    <div class="bg-beige rounded-xl p-4 mb-6 inline-block">
      <p class="text-xs text-brown-light mb-1">Your Order Reference Number</p>
      <p class="font-serif text-2xl font-bold text-gold-dark tracking-wider">{data.order.order_number}</p>
    </div>

    <!-- Order Details -->
    <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6 text-left">
      <h2 class="font-semibold text-brown mb-3 flex items-center gap-2">
        <Package class="w-5 h-5 text-gold" />
        Order Summary
      </h2>

      <div class="space-y-2 mb-4">
        {#each data.order.order_items as item}
          <div class="flex items-center gap-3 text-sm">
            <div class="w-12 h-12 rounded-md overflow-hidden bg-beige shrink-0">
              {#if item.product_image}
                <img src={item.product_image} alt={item.product_name} class="w-full h-full object-cover" />
              {/if}
            </div>
            <div class="flex-1">
              <p class="text-brown font-medium">{item.product_name}</p>
              <p class="text-xs text-brown-light">{item.quantity} × {formatNPR(item.unit_price)}</p>
            </div>
            <span class="font-medium text-brown">{formatNPR(item.subtotal)}</span>
          </div>
        {/each}
      </div>

      <hr class="border-beige-dark/30 my-3" />

      <div class="space-y-1 text-sm">
        <div class="flex justify-between">
          <span class="text-brown-light">Items Total</span>
          <span class="text-brown">{formatNPR(data.order.items_total)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-brown-light">Delivery Fee</span>
          <span class="text-brown">{data.order.delivery_fee === 0 ? 'FREE' : formatNPR(data.order.delivery_fee)}</span>
        </div>
        <div class="flex justify-between font-semibold text-base pt-1">
          <span class="text-brown">Total Amount</span>
          <span class="text-brown">{formatNPR(data.order.total_amount)}</span>
        </div>
      </div>

      <hr class="border-beige-dark/30 my-3" />

      <!-- Delivery Info -->
      <div class="text-sm">
        <h3 class="font-semibold text-brown mb-2 flex items-center gap-2">
          <MapPin class="w-4 h-4 text-gold" />
          Delivery Address
        </h3>
        <p class="text-brown-light">{data.order.customer_name}</p>
        <p class="text-brown-light">{data.order.street_address}, Ward {data.order.ward_number}</p>
        <p class="text-brown-light">{data.order.municipality}, {data.order.district}</p>
        <p class="text-brown-light">{data.order.province}</p>
        <p class="text-brown-light flex items-center gap-1 mt-1">
          <Phone class="w-3.5 h-3.5" />
          {data.order.customer_phone}
        </p>
      </div>

      <hr class="border-beige-dark/30 my-3" />

      <div class="flex flex-col sm:flex-row gap-2 text-sm">
        <div class="flex-1">
          <span class="text-brown-light">Payment Method: </span>
          <span class="font-medium text-brown">
            {data.order.payment_method === 'cod' ? 'Cash on Delivery' : 'eSewa'}
          </span>
        </div>
        <div class="flex-1">
          <span class="text-brown-light">Order Status: </span>
          <span class="font-medium text-warning">Pending</span>
        </div>
      </div>

      <p class="text-xs text-brown-light/60 mt-3">Order placed on {formatDate(data.order.created_at)}</p>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
      <a href="/track-order?order={data.order.order_number}&phone={data.order.customer_phone}" class="btn-primary">
        Track This Order
      </a>
      <a href="/shop" class="btn-outline">
        Continue Shopping
        <ArrowRight class="w-4 h-4" />
      </a>
    </div>
  </div>
</div>
