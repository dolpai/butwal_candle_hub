<script lang="ts">
  import type { PageData } from './$types';
  import { formatNPR, formatDate } from '$lib/utils';
  import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP, getPhoneLink, getWhatsAppLink } from '$lib/config';
  import { toasts } from '$lib/toast.svelte';
  import { Search, Phone, MessageCircle, Eye, Filter } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();

  let localSearch = $state(data.searchQuery || '');

  function updateFilter(key: string, value: string) {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.location.href = url.pathname + (url.search ? `?${url.searchParams}` : '');
  }

  async function handleStatusChange(orderId: string, status: string) {
    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('status', status);

    const response = await fetch('?/updateStatus', { method: 'POST', body: formData });
    if (response.ok) {
      toasts.success(`Order status updated to ${ORDER_STATUS_MAP[status]?.label || status}`);
      window.location.reload();
    } else {
      toasts.error('Failed to update order status');
    }
  }

  const statusOptions = Object.entries(ORDER_STATUS_MAP);
</script>

<svelte:head>
  <title>Orders — Admin — Butwal Candle Hub</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="font-serif text-2xl font-bold text-brown">Order Management</h1>
    <p class="text-sm text-brown-light mt-1">{data.orders.length} orders found</p>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-xl border border-beige-dark/30 p-4 flex flex-col sm:flex-row gap-3">
    <form
      class="flex-1 relative"
      onsubmit={(e) => {
        e.preventDefault();
        updateFilter('q', localSearch);
      }}
    >
      <input type="text" bind:value={localSearch} placeholder="Search by order #, name, or phone..." class="input-field pr-10" />
      <button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light">
        <Search class="w-5 h-5" />
      </button>
    </form>

    <select
      value={data.statusFilter}
      onchange={(e) => updateFilter('status', (e.currentTarget as HTMLSelectElement).value)}
      class="input-field w-auto cursor-pointer"
    >
      <option value="">All Statuses</option>
      {#each statusOptions as [value, info]}
        <option value={value}>{info.label}</option>
      {/each}
    </select>

    <input
      type="date"
      value={data.dateFilter}
      onchange={(e) => updateFilter('date', (e.currentTarget as HTMLInputElement).value)}
      class="input-field w-auto cursor-pointer"
    />

    {#if data.statusFilter || data.dateFilter || data.searchQuery}
      <button onclick={() => { updateFilter('status', ''); updateFilter('date', ''); updateFilter('q', ''); }} class="btn-ghost text-sm whitespace-nowrap">
        Clear
      </button>
    {/if}
  </div>

  <!-- Orders Table -->
  <div class="bg-white rounded-xl border border-beige-dark/30 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-beige/50 text-brown-light">
          <tr>
            <th class="text-left px-4 py-3 font-medium">Order #</th>
            <th class="text-left px-4 py-3 font-medium">Customer</th>
            <th class="text-left px-4 py-3 font-medium hidden sm:table-cell">Date</th>
            <th class="text-right px-4 py-3 font-medium">Total</th>
            <th class="text-center px-4 py-3 font-medium">Payment</th>
            <th class="text-center px-4 py-3 font-medium">Status</th>
            <th class="text-center px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-beige-dark/20">
          {#each data.orders as order (order.id)}
            <tr class="hover:bg-beige/30 transition-colors">
              <td class="px-4 py-3">
                <a href="/admin/orders/{order.id}" class="font-mono text-xs text-gold-dark hover:underline font-medium">
                  {order.order_number}
                </a>
                <p class="text-xs text-brown-light/60 mt-0.5">{order.order_items.length} items</p>
              </td>
              <td class="px-4 py-3">
                <p class="text-brown font-medium">{order.customer_name}</p>
                <div class="flex items-center gap-2 mt-1">
                  <a href={getPhoneLink(order.customer_phone)} class="text-xs text-brown-light hover:text-gold flex items-center gap-1" title="Click to call">
                    <Phone class="w-3 h-3" />
                    {order.customer_phone}
                  </a>
                  <a
                    href={getWhatsAppLink(`Hello ${order.customer_name}, regarding your order ${order.order_number}...`)}
                    target="_blank"
                    rel="noopener"
                    class="text-[#25D366] hover:opacity-70"
                    title="WhatsApp customer"
                  >
                    <MessageCircle class="w-3.5 h-3.5" />
                  </a>
                </div>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell text-brown-light text-xs">{formatDate(order.created_at)}</td>
              <td class="px-4 py-3 text-right font-medium text-brown">{formatNPR(order.total_amount)}</td>
              <td class="px-4 py-3 text-center">
                <span class="badge-{PAYMENT_STATUS_MAP[order.payment_status].color}">{PAYMENT_STATUS_MAP[order.payment_status].label}</span>
                <p class="text-xs text-brown-light/60 mt-0.5">{order.payment_method === 'cod' ? 'COD' : order.payment_method === 'qr' ? 'QR Payment' : 'eSewa'}</p>
              </td>
              <td class="px-4 py-3 text-center">
                <select
                  value={order.order_status}
                  onchange={(e) => handleStatusChange(order.id, (e.currentTarget as HTMLSelectElement).value)}
                  class="text-xs border border-beige-dark rounded-md px-2 py-1 cursor-pointer bg-white"
                >
                  {#each statusOptions as [value, info]}
                    <option value={value} selected={order.order_status === value}>{info.label}</option>
                  {/each}
                </select>
              </td>
              <td class="px-4 py-3 text-center">
                <a href="/admin/orders/{order.id}" class="text-gold hover:text-gold-dark" title="View details">
                  <Eye class="w-4 h-4" />
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if data.orders.length === 0}
      <div class="p-8 text-center text-brown-light/50">
        <p class="text-sm">No orders found. Try adjusting your filters.</p>
      </div>
    {/if}
  </div>
</div>
