<script lang="ts">
  import type { PageData } from './$types';
  import { formatNPR, formatDate } from '$lib/utils';
  import { ORDER_STATUS_MAP, getPhoneLink } from '$lib/config';
  import { ShoppingBag, Package, DollarSign, Clock, AlertTriangle, TrendingUp, Phone } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();

  const cards = $derived([
    { label: 'Total Orders', value: data.stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: "Today's Orders", value: data.stats.todayOrders, icon: Clock, color: 'bg-festive/10 text-festive' },
    { label: 'Total Sales', value: formatNPR(data.stats.totalSales), icon: TrendingUp, color: 'bg-success/10 text-success' },
    { label: 'Total Products', value: data.stats.totalProducts, icon: Package, color: 'bg-gold/10 text-gold' },
    { label: 'Active Products', value: data.stats.activeProducts, icon: Package, color: 'bg-green-50 text-green-600' },
    { label: 'Low Stock', value: data.stats.lowStockProducts, icon: AlertTriangle, color: 'bg-warning/10 text-warning' },
    { label: 'Pending Orders', value: data.stats.pendingOrders, icon: Clock, color: 'bg-amber-50 text-amber-600' },
  ]);
</script>

<svelte:head>
  <title>Dashboard — Admin — Butwal Candle Hub</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="font-serif text-2xl font-bold text-brown">Dashboard Overview</h1>
    <p class="text-sm text-brown-light mt-1">Welcome back! Here's what's happening with your store.</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
    {#each cards as card}
      <div class="bg-white rounded-xl border border-beige-dark/30 p-4">
        <div class="w-10 h-10 rounded-lg {card.color} flex items-center justify-center mb-3">
          <card.icon class="w-5 h-5" />
        </div>
        <p class="text-xs text-brown-light">{card.label}</p>
        <p class="font-serif text-xl font-bold text-brown mt-0.5">{card.value}</p>
      </div>
    {/each}
  </div>

  <!-- Recent Orders -->
  <div class="bg-white rounded-xl border border-beige-dark/30 overflow-hidden">
    <div class="px-4 sm:px-6 py-4 border-b border-beige-dark/30 flex items-center justify-between">
      <h2 class="font-semibold text-brown">Recent Orders</h2>
      <a href="/admin/orders" class="text-sm text-gold hover:text-gold-dark transition-colors">View All</a>
    </div>

    {#if data.recentOrders.length === 0}
      <div class="p-8 text-center text-brown-light/50">
        <ShoppingBag class="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p class="text-sm">No orders yet</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-beige/50 text-brown-light">
            <tr>
              <th class="text-left px-4 sm:px-6 py-3 font-medium">Order #</th>
              <th class="text-left px-4 py-3 font-medium hidden sm:table-cell">Customer</th>
              <th class="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
              <th class="text-right px-4 py-3 font-medium">Total</th>
              <th class="text-center px-4 py-3 font-medium">Status</th>
              <th class="text-center px-4 sm:px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-beige-dark/20">
            {#each data.recentOrders as order}
              <tr class="hover:bg-beige/30 transition-colors">
                <td class="px-4 sm:px-6 py-3">
                  <span class="font-mono text-xs text-gold-dark font-medium">{order.order_number}</span>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  <p class="text-brown font-medium">{order.customer_name}</p>
                  <a href={getPhoneLink(order.customer_phone)} class="text-xs text-brown-light hover:text-gold flex items-center gap-1">
                    <Phone class="w-3 h-3" />
                    {order.customer_phone}
                  </a>
                </td>
                <td class="px-4 py-3 hidden md:table-cell text-brown-light text-xs">{formatDate(order.created_at)}</td>
                <td class="px-4 py-3 text-right font-medium text-brown">{formatNPR(order.total_amount)}</td>
                <td class="px-4 py-3 text-center">
                  <span class="badge-{ORDER_STATUS_MAP[order.order_status].color}">{ORDER_STATUS_MAP[order.order_status].label}</span>
                </td>
                <td class="px-4 sm:px-6 py-3 text-center">
                  <a href="/admin/orders/{order.id}" class="text-gold hover:text-gold-dark text-xs">View</a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
