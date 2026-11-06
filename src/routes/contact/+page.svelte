<script lang="ts">
  import type { PageData } from './$types';
  import { getWhatsAppLink, getPhoneLink, getMapsLink, BUSINESS } from '$lib/config';
  import { MapPin, Phone, MessageCircle, Mail, Truck, Clock } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();

  const settings = $derived(data.storeSettings);
  const whatsappNumber = $derived(settings.whatsapp_number || BUSINESS.whatsapp);
  const phoneNumbers = $derived(settings.phone_numbers || BUSINESS.phones);
  const location1 = $derived(settings.address_line_1 || BUSINESS.locations[0].address);
  const location2 = $derived(settings.address_line_2 || BUSINESS.locations[1].address);
</script>

<svelte:head>
  <title>Contact Us — Butwal Candle Hub</title>
  <meta name="description" content="Contact Butwal Candle Hub via WhatsApp or phone. We deliver across Nepal. Two locations in Butwal." />
</svelte:head>

<div class="section-padding py-6 sm:py-8">
  <h1 class="font-serif text-2xl sm:text-3xl font-bold text-brown mb-2">Contact Us</h1>
  <p class="text-brown-light text-sm mb-6">Get in touch with us for any questions about candles, orders, or delivery.</p>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Contact Options -->
    <div class="space-y-4">
      <!-- WhatsApp -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-5">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center shrink-0">
            <MessageCircle class="w-6 h-6 text-[#25D366]" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-brown mb-1">WhatsApp</h3>
            <p class="text-sm text-brown-light mb-3">Chat with us directly on WhatsApp for quick responses.</p>
            <a
              href={getWhatsAppLink('Hello Butwal Candle Hub, I have a question about your candles.')}
              target="_blank"
              rel="noopener"
              class="btn-festive text-sm py-2.5 inline-flex items-center gap-2"
            >
              <MessageCircle class="w-4 h-4" />
              Chat on WhatsApp: {whatsappNumber}
            </a>
          </div>
        </div>
      </div>

      <!-- Phone -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-5">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 bg-brown/10 rounded-full flex items-center justify-center shrink-0">
            <Phone class="w-6 h-6 text-brown" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-brown mb-1">Phone</h3>
            <p class="text-sm text-brown-light mb-3">Call us directly for inquiries.</p>
            <div class="flex flex-col sm:flex-row gap-2">
              {#each phoneNumbers as phone}
                <a
                  href={getPhoneLink(phone)}
                  class="btn-secondary text-sm py-2.5 inline-flex items-center gap-2"
                >
                  <Phone class="w-4 h-4" />
                  {phone}
                </a>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Email -->
      {#if settings.store_email}
        <div class="bg-white rounded-xl border border-beige-dark/30 p-5">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
              <Mail class="w-6 h-6 text-gold" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-brown mb-1">Email</h3>
              <a href="mailto:{settings.store_email}" class="text-sm text-gold hover:text-gold-dark transition-colors">
                {settings.store_email}
              </a>
            </div>
          </div>
        </div>
      {/if}

      <!-- Delivery Info -->
      <div class="bg-beige rounded-xl p-5">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 bg-festive/10 rounded-full flex items-center justify-center shrink-0">
            <Truck class="w-6 h-6 text-festive" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-brown mb-1">Nationwide Delivery</h3>
            <p class="text-sm text-brown-light">
              We deliver across all of Nepal. Delivery charges apply based on your location.
              {#if settings.free_delivery_threshold}
                Free delivery on orders above {settings.free_delivery_threshold > 0 ? `Rs. ${settings.free_delivery_threshold.toLocaleString()}` : ''}.
              {/if}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Locations -->
    <div class="space-y-4">
      <div class="bg-white rounded-xl border border-beige-dark/30 p-5">
        <h3 class="font-semibold text-brown mb-3 flex items-center gap-2">
          <MapPin class="w-5 h-5 text-gold" />
          Our Locations
        </h3>

        <!-- Location 1 -->
        <div class="mb-4">
          <p class="text-sm font-medium text-brown mb-1">Location 1</p>
          <p class="text-sm text-brown-light mb-2">{location1}</p>
          <a
            href={getMapsLink(location1)}
            target="_blank"
            rel="noopener"
            class="text-sm text-gold hover:text-gold-dark transition-colors inline-flex items-center gap-1"
          >
            Get Directions
            <MapPin class="w-3.5 h-3.5" />
          </a>
        </div>

        <hr class="border-beige-dark/30 my-3" />

        <!-- Location 2 -->
        <div>
          <p class="text-sm font-medium text-brown mb-1">Location 2</p>
          <p class="text-sm text-brown-light mb-2">{location2}</p>
          <a
            href={getMapsLink(location2)}
            target="_blank"
            rel="noopener"
            class="text-sm text-gold hover:text-gold-dark transition-colors inline-flex items-center gap-1"
          >
            Get Directions
            <MapPin class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <!-- Business Hours -->
      <div class="bg-white rounded-xl border border-beige-dark/30 p-5">
        <h3 class="font-semibold text-brown mb-3 flex items-center gap-2">
          <Clock class="w-5 h-5 text-gold" />
          Business Hours
        </h3>
        <div class="space-y-1 text-sm text-brown-light">
          <div class="flex justify-between">
            <span>Sunday - Friday</span>
            <span>8:00 AM - 8:00 PM</span>
          </div>
          <div class="flex justify-between">
            <span>Saturday</span>
            <span>9:00 AM - 6:00 PM</span>
          </div>
        </div>
        <p class="text-xs text-brown-light/60 mt-3">
          WhatsApp messages are checked regularly during business hours.
        </p>
      </div>
    </div>
  </div>
</div>
