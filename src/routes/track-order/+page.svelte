<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { formatNPR, formatDate } from '$lib/utils';
  import { ORDER_STATUS_MAP } from '$lib/config';
  import { Search, Package, MapPin, Phone, CheckCircle, Clock, Truck } from 'lucide-svelte';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let orderNumber = $state(data.prefilledOrderNumber || '');
  let phone = $state(data.prefilledPhone || '');

  let displayOrder = $derived(form?.order || data.order);
  let displayError = $derived(form?.error || data.error);
  let errors = $derived(form?.errors || {});

  const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
  let isCancelled = $derived(displayOrder?.order_status === 'cancelled');

  function getStatusIndex(status: string): number {
    return statusOrder.indexOf(status);
  }
</script>

<svelte:head>
  <title>Track Your Order — Butwal Candle Hub</title>
  <meta name="description" content="Track your order status with your order number and phone number." />
</svelte:head>

<div class="section-padding py-6 sm:py-8">
  <h1 class="font-serif text-2xl sm:text-3xl font-bold text-brown mb-2">Track Your Order</h1>
  <p class="text-brown-light text-sm mb-6">Enter your order reference number and phone number to check your order status.</p>

  <!-- Search Form -->
  <form method="POST" action="?/track" class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6 mb-6 max-w-2xl">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label for="order_number" class="block text-sm font-medium text-brown mb-1">Order Reference Number <span class="text-danger">*</span></label>
        <input
          id="order_number"
          name="order_number"
          type="text"
          bind:value={orderNumber}
          class="input-field"
          placeholder="e.g. BCH1234567890"
          required
        />
        {#if errors.order_number}<p class="text-xs text-danger mt-1">{errors.order_number}</p>{/if}
      </div>
      <div>
        <label for="phone" class="block text-sm font-medium text-brown mb-1">Phone Number <span class="text-danger">*</span></label>
        <input
          id="phone"
          name="phone"
          type="tel"
          bind:value={phone}
          class="input-field"
          placeholder="Your phone number"
          required
        />
        {#if errors.phone}<p class="text-xs text-danger mt-1">{errors.phone}</p>{/if}
      </div>
    </div>
    <button type="submit" class="btn-primary mt-4 flex items-center gap-2">
      <Search class="w-4 h-4" />
      Track Order
    </button>
  </form>

  {#if displayError}
    <div class="bg-danger/10 border border-danger/30 rounded-lg p-4 text-danger text-sm max-w-2xl">
      {displayError}
    </div>
  {/if}

  {#if displayOrder}
    <div class="max-w-2xl space-y-4">
      <!-- Order Info -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <p class="text-xs text-brown-light">Order Number</p>
            <p class="font-serif text-xl font-bold text-gold-dark tracking-wider">{displayOrder.order_number}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-brown-light">Order Date</p>
            <p class="text-sm font-medium text-brown">{formatDate(displayOrder.created_at)}</p>
          </div>
        </div>

        <!-- Status Timeline -->
        {#if isCancelled}
          <div class="bg-danger/10 border border-danger/30 rounded-lg p-4 text-center">
            <p class="font-medium text-danger">This order has been cancelled.</p>
            <p class="text-sm text-brown-light mt-1">{ORDER_STATUS_MAP[displayOrder.order_status].description}</p>
          </div>
        {:else}
          <div class="relative">
            <div class="flex justify-between mb-2">
              {#each statusOrder as status, i (status)}
                <div class="flex flex-col items-center flex-1 z-10">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all {i <= getStatusIndex(displayOrder.order_status) ? 'bg-success text-white' : 'bg-beige text-brown-light/40'}">
                    {#if i <= getStatusIndex(displayOrder.order_status)}
                      <CheckCircle class="w-5 h-5" />
                    {:else}
                      <Clock class="w-4 h-4" />
                    {/if}
                  </div>
                  <span class="text-[10px] sm:text-xs mt-1 text-center {i <= getStatusIndex(displayOrder.order_status) ? 'text-brown font-medium' : 'text-brown-light/50'}">
                    {ORDER_STATUS_MAP[status].label}
                  </span>
                </div>
              {/each}
            </div>
            <!-- Progress Line -->
            <div class="absolute top-4 sm:top-5 left-[8%] right-[8%] h-0.5 bg-beige -z-0">
              <div
                class="h-full bg-success transition-all duration-500"
                style="width: {(getStatusIndex(displayOrder.order_status) / (statusOrder.length - 1)) * 100}%"
              ></div>
            </div>
          </div>

          <div class="mt-4 bg-beige/50 rounded-lg p-3 text-sm text-brown-light">
            {ORDER_STATUS_MAP[displayOrder.order_status].description}
          </div>
        {/if}
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
        <h2 class="font-semibold text-brown mb-3 flex items-center gap-2">
          <Package class="w-5 h-5 text-gold" />
          Order Items
        </h2>
        <div class="space-y-2">
          {#each displayOrder.order_items as item}
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
            <span class="text-brown">{formatNPR(displayOrder.items_total)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-brown-light">Delivery Fee</span>
            <span class="text-brown">{displayOrder.delivery_fee === 0 ? 'FREE' : formatNPR(displayOrder.delivery_fee)}</span>
          </div>
          <div class="flex justify-between font-semibold text-base pt-1">
            <span class="text-brown">Total</span>
            <span class="text-brown">{formatNPR(displayOrder.total_amount)}</span>
          </div>
        </div>
      </div>

      <!-- Delivery Address -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
        <h2 class="font-semibold text-brown mb-3 flex items-center gap-2">
          <MapPin class="w-5 h-5 text-gold" />
          Delivery Address
        </h2>
        <div class="text-sm text-brown-light">
          <p class="text-brown font-medium">{displayOrder.customer_name}</p>
          <p>{displayOrder.street_address}, Ward {displayOrder.ward_number}</p>
          <p>{displayOrder.municipality}, {displayOrder.district}</p>
          <p>{displayOrder.province}</p>
          <p class="flex items-center gap-1 mt-1">
            <Phone class="w-3.5 h-3.5" />
            {displayOrder.customer_phone}
          </p>
        </div>
        <div class="mt-3 pt-3 border-t border-beige-dark/30 flex flex-col sm:flex-row gap-2 text-sm">
          <div class="flex-1">
            <span class="text-brown-light">Payment: </span>
            <span class="font-medium text-brown">{displayOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'eSewa'}</span>
          </div>
          <div class="flex-1">
            <span class="text-brown-light">Payment Status: </span>
            <span class="font-medium {displayOrder.payment_status === 'paid' ? 'text-success' : 'text-warning'}">
              {displayOrder.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
            </span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
