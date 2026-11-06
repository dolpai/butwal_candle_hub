<script lang="ts">
  import type { Category, StoreSettings } from '$lib/types';
  import { getWhatsAppLink, getPhoneLink, getMapsLink, BUSINESS } from '$lib/config';
  import { MapPin, Phone, MessageCircle } from 'lucide-svelte';

  let { categories, storeSettings }: { categories: Category[]; storeSettings: StoreSettings } = $props();

  const year = new Date().getFullYear();
</script>

<footer class="bg-brown text-cream mt-16">
  <div class="section-padding py-12">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Brand -->
      <div>
        <h3 class="font-serif text-xl font-bold mb-3">{storeSettings.store_name || BUSINESS.name}</h3>
        <p class="text-cream/70 text-sm leading-relaxed">
          Beautiful candles for every celebration. Delivering across Nepal.
        </p>
      </div>

      <!-- Quick Links -->
      <div>
        <h4 class="font-semibold text-sm uppercase tracking-wide mb-3 text-gold">Shop</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/shop" class="text-cream/70 hover:text-gold transition-colors">All Products</a></li>
          {#each categories.slice(0, 4) as cat}
            <li><a href="/shop?category={cat.slug}" class="text-cream/70 hover:text-gold transition-colors">{cat.name}</a></li>
          {/each}
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h4 class="font-semibold text-sm uppercase tracking-wide mb-3 text-gold">Contact</h4>
        <ul class="space-y-3 text-sm">
          <li>
            <a
              href={getWhatsAppLink('Hello Butwal Candle Hub, I would like to know more about your candles.')}
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors"
            >
              <MessageCircle class="w-4 h-4 shrink-0" />
              WhatsApp: {storeSettings.whatsapp_number || BUSINESS.whatsapp}
            </a>
          </li>
          {#each (storeSettings.phone_numbers || BUSINESS.phones) as phone}
            <li>
              <a
                href={getPhoneLink(phone)}
                class="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors"
              >
                <Phone class="w-4 h-4 shrink-0" />
                {phone}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Locations -->
      <div>
        <h4 class="font-semibold text-sm uppercase tracking-wide mb-3 text-gold">Our Locations</h4>
        <ul class="space-y-3 text-sm">
          <li>
            <a
              href={getMapsLink(storeSettings.address_line_1 || BUSINESS.locations[0].address)}
              target="_blank"
              rel="noopener"
              class="flex items-start gap-2 text-cream/70 hover:text-gold transition-colors"
            >
              <MapPin class="w-4 h-4 shrink-0 mt-0.5" />
              {storeSettings.address_line_1 || BUSINESS.locations[0].address}
            </a>
          </li>
          <li>
            <a
              href={getMapsLink(storeSettings.address_line_2 || BUSINESS.locations[1].address)}
              target="_blank"
              rel="noopener"
              class="flex items-start gap-2 text-cream/70 hover:text-gold transition-colors"
            >
              <MapPin class="w-4 h-4 shrink-0 mt-0.5" />
              {storeSettings.address_line_2 || BUSINESS.locations[1].address}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-cream/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-cream/50">
      <p>&copy; {year} {storeSettings.store_name || BUSINESS.name}. All rights reserved.</p>
      <p>Nationwide delivery across Nepal</p>
    </div>
  </div>
</footer>
