<script lang="ts">
  import { page } from '$app/stores';
  import { BUSINESS, getWhatsAppLink } from '$lib/config';
  import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Menu, X, Store, MessageCircle } from 'lucide-svelte';

  let { children, data }: { children: any; data: any } = $props();

  let sidebarOpen = $state(false);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  function isActive(href: string): boolean {
    if (href === '/admin') {
      return $page.url.pathname === '/admin';
    }
    return $page.url.pathname.startsWith(href);
  }

  async function handleLogout() {
    // Use the form action from the logout route
    await fetch('/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }
</script>

<div class="min-h-screen bg-cream flex">
  <!-- Sidebar -->
  {#if sidebarOpen}
    <div class="fixed inset-0 bg-brown/60 z-40 lg:hidden" onclick={() => (sidebarOpen = false)}></div>
  {/if}

  <aside
    class="fixed lg:sticky top-0 left-0 h-screen w-64 bg-brown text-cream z-50 transform transition-transform {sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-serif text-lg font-bold">Butwal Candle Hub</h1>
          <p class="text-xs text-gold tracking-widest uppercase">Admin Panel</p>
        </div>
        <button class="lg:hidden" onclick={() => (sidebarOpen = false)}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="space-y-1">
        {#each navItems as item}
          {@const Icon = item.icon}
          <a
            href={item.href}
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive(item.href) ? 'bg-gold/20 text-gold' : 'text-cream/70 hover:bg-cream/10 hover:text-cream'}"
            onclick={() => (sidebarOpen = false)}
          >
            <Icon class="w-5 h-5" />
            <span class="text-sm font-medium">{item.label}</span>
          </a>
        {/each}
      </nav>

      <div class="mt-8 pt-8 border-t border-cream/10 space-y-1">
        <a
          href="/"
          target="_blank"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-cream/70 hover:bg-cream/10 hover:text-cream transition-colors"
        >
          <Store class="w-5 h-5" />
          <span class="text-sm">View Store</span>
        </a>
        <a
          href={getWhatsAppLink('Hello Butwal Candle Hub')}
          target="_blank"
          rel="noopener"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-cream/70 hover:bg-cream/10 hover:text-cream transition-colors"
        >
          <MessageCircle class="w-5 h-5" />
          <span class="text-sm">WhatsApp: {BUSINESS.whatsapp}</span>
        </a>
        <button
          onclick={handleLogout}
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-cream/70 hover:bg-danger/20 hover:text-danger transition-colors"
        >
          <LogOut class="w-5 h-5" />
          <span class="text-sm">Logout</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col min-h-screen">
    <!-- Top Bar (mobile) -->
    <header class="lg:hidden bg-white border-b border-beige-dark/30 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <button onclick={() => (sidebarOpen = true)} aria-label="Open menu">
        <Menu class="w-6 h-6 text-brown" />
      </button>
      <span class="font-serif font-bold text-brown">Admin Panel</span>
      <div class="w-6"></div>
    </header>

    <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      {@render children()}
    </main>
  </div>
</div>
