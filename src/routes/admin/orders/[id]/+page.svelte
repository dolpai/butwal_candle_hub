<script lang="ts">
  import type { PageData } from './$types';
  import { formatNPR, formatDate } from '$lib/utils';
  import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP, getPhoneLink, getWhatsAppLink, BUSINESS } from '$lib/config';
  import { toasts } from '$lib/toast.svelte';
  import { ChevronLeft, Phone, MessageCircle, MapPin, Package, Truck, CheckCircle } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();

  const statusOptions = Object.entries(ORDER_STATUS_MAP);
  const paymentOptions = Object.entries(PAYMENT_STATUS_MAP);

  async function handleStatusChange(status: string) {
    const formData = new FormData();
    formData.append('status', status);
    const response = await fetch('?/updateStatus', { method: 'POST', body: formData });
    if (response.ok) {
      toasts.success('Order status updated');
      window.location.reload();
    }
  }

  async function handlePaymentChange(status: string) {
    const formData = new FormData();
    formData.append('payment_status', status);
    const response = await fetch('?/updatePayment', { method: 'POST', body: formData });
    if (response.ok) {
      toasts.success('Payment status updated');
      window.location.reload();
    }
  }
</script>

<svelte:head>
  <title>Order {data.order.order_number} — Admin — Butwal Candle Hub</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <a href="/admin/orders" class="inline-flex items-center gap-1 text-sm text-brown-light hover:text-gold transition-colors mb-2">
      <ChevronLeft class="w-4 h-4" /> Back to Orders
    </a>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h1 class="font-serif text-2xl font-bold text-brown">Order Details</h1>
        <p class="font-mono text-sm text-gold-dark mt-1">{data.order.order_number}</p>
      </div>
      <p class="text-sm text-brown-light">{formatDate(data.order.created_at)}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left: Items & Address -->
    <div class="lg:col-span-2 space-y-4">
      <!-- Order Items -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
        <h2 class="font-semibold text-brown mb-3 flex items-center gap-2">
          <Package class="w-5 h-5 text-gold" />
          Order Items
        </h2>
        <div class="space-y-3">
          {#each data.order.order_items as item}
            <div class="flex items-center gap-3 pb-3 border-b border-beige-dark/20 last:border-0 last:pb-0">
              <div class="w-14 h-14 rounded-lg overflow-hidden bg-beige shrink-0">
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
      </div>

      <!-- Delivery Address -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
        <h2 class="font-semibold text-brown mb-3 flex items-center gap-2">
          <MapPin class="w-5 h-5 text-gold" />
          Delivery Address
        </h2>
        <div class="space-y-1 text-sm">
          <p class="text-brown font-medium">{data.order.customer_name}</p>
          <p class="text-brown-light">{data.order.street_address}, Ward {data.order.ward_number}</p>
          <p class="text-brown-light">{data.order.municipality}, {data.order.district}</p>
          <p class="text-brown-light">{data.order.province}</p>
          {#if data.order.landmark}
            <p class="text-brown-light">Landmark: {data.order.landmark}</p>
          {/if}
          <div class="flex items-center gap-2 pt-2">
            <a href={getPhoneLink(data.order.customer_phone)} class="btn-secondary text-sm py-2 flex items-center gap-1">
              <Phone class="w-4 h-4" /> Call {data.order.customer_phone}
            </a>
            <a
              href={getWhatsAppLink(`Hello ${data.order.customer_name}, regarding your order ${data.order.order_number}...`)}
              target="_blank"
              rel="noopener"
              class="btn-festive text-sm py-2 flex items-center gap-1"
            >
              <MessageCircle class="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
        {#if data.order.notes}
          <div class="mt-3 pt-3 border-t border-beige-dark/30">
            <p class="text-xs text-brown-light font-medium mb-1">Order Notes:</p>
            <p class="text-sm text-brown">{data.order.notes}</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Right: Status Controls -->
    <div class="space-y-4">
      <!-- Order Status -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
        <h2 class="font-semibold text-brown mb-3 flex items-center gap-2">
          <Truck class="w-5 h-5 text-gold" />
          Order Status
        </h2>
        <div class="space-y-2">
          {#each statusOptions as [value, info]}
            <button
              onclick={() => handleStatusChange(value)}
              class="w-full text-left px-4 py-2.5 rounded-lg border transition-all {data.order.order_status === value ? 'border-gold bg-gold/5' : 'border-beige-dark/30 hover:border-gold/50'}"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-brown">{info.label}</span>
                {#if data.order.order_status === value}
                  <CheckCircle class="w-4 h-4 text-gold" />
                {/if}
              </div>
              <p class="text-xs text-brown-light/60 mt-0.5">{info.description}</p>
            </button>
          {/each}
        </div>
      </div>

      <!-- Payment Status -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
        <h2 class="font-semibold text-brown mb-3">Payment</h2>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-brown-light">Method</span>
            <span class="font-medium text-brown">{data.order.payment_method === 'cod' ? 'Cash on Delivery' : data.order.payment_method === 'qr' ? 'Manual QR Payment' : 'eSewa'}</span>
          </div>
          {#if data.order.payment_method === 'qr'}
            <div class="rounded-lg bg-beige/50 p-3 text-sm">
              <p class="text-brown-light">Customer transaction reference</p>
              <p class="font-semibold text-brown break-all">{data.order.payments?.[0]?.transaction_uuid || 'Not provided'}</p>
              <p class="text-xs text-brown-light mt-1">Verify the payment manually before setting status to Paid.</p>
            </div>
          {/if}
          <div class="flex justify-between text-sm mb-3">
            <span class="text-brown-light">Status</span>
            <span class="badge-{PAYMENT_STATUS_MAP[data.order.payment_status].color}">{PAYMENT_STATUS_MAP[data.order.payment_status].label}</span>
          </div>

          <label class="block text-sm font-medium text-brown mb-1">Update Payment Status</label>
          <select
            value={data.order.payment_status}
            onchange={(e) => handlePaymentChange((e.currentTarget as HTMLSelectElement).value)}
            class="input-field cursor-pointer"
          >
            {#each paymentOptions as [value, info]}
              <option value={value} selected={data.order.payment_status === value}>{info.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>
</div>
