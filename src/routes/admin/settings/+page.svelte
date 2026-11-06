<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { toasts } from '$lib/toast.svelte';
  import { Store, Truck, Phone, MapPin, Save } from 'lucide-svelte';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  $effect(() => {
    if (form?.success) {
      toasts.success('Settings saved successfully');
      window.location.reload();
    } else if (form?.error) {
      toasts.error(form.error);
    }
  });

  let phoneNumbersStr = (data.settings.phone_numbers || []).join(', ');
</script>

<svelte:head>
  <title>Store Settings — Admin — Butwal Candle Hub</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="font-serif text-2xl font-bold text-brown">Store Settings</h1>
    <p class="text-sm text-brown-light mt-1">Manage your store configuration, delivery, and contact information.</p>
  </div>

  <form method="POST" action="?/update" class="space-y-6">
    <!-- General -->
    <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
      <h2 class="font-semibold text-brown mb-4 flex items-center gap-2">
        <Store class="w-5 h-5 text-gold" />
        General Settings
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label for="store_name" class="block text-sm font-medium text-brown mb-1">Store Name</label>
          <input id="store_name" name="store_name" type="text" class="input-field" value={data.settings.store_name} />
        </div>
        <div class="sm:col-span-2">
          <label for="announcement" class="block text-sm font-medium text-brown mb-1">Announcement Bar Text</label>
          <input id="announcement" name="announcement" type="text" class="input-field" value={data.settings.announcement || ''} placeholder="e.g. Free delivery above Rs. 2000!" />
        </div>
        <div class="sm:col-span-2">
          <label for="promotional_banner" class="block text-sm font-medium text-brown mb-1">Promotional Banner Text</label>
          <input id="promotional_banner" name="promotional_banner" type="text" class="input-field" value={data.settings.promotional_banner || ''} placeholder="e.g. Light Up Your Tihar With Beautiful Candles" />
        </div>
        <div>
          <label for="store_email" class="block text-sm font-medium text-brown mb-1">Store Email <span class="text-brown-light/50">(optional)</span></label>
          <input id="store_email" name="store_email" type="email" class="input-field" value={data.settings.store_email || ''} placeholder="store@example.com" />
        </div>
      </div>
    </div>

    <!-- Delivery Settings -->
    <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
      <h2 class="font-semibold text-brown mb-4 flex items-center gap-2">
        <Truck class="w-5 h-5 text-gold" />
        Delivery Settings
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="delivery_charge" class="block text-sm font-medium text-brown mb-1">Delivery Charge (Rs.)</label>
          <input id="delivery_charge" name="delivery_charge" type="number" step="0.01" min="0" class="input-field" value={data.settings.delivery_charge} />
        </div>
        <div>
          <label for="free_delivery_threshold" class="block text-sm font-medium text-brown mb-1">Free Delivery Threshold (Rs.) <span class="text-brown-light/50">(optional)</span></label>
          <input id="free_delivery_threshold" name="free_delivery_threshold" type="number" step="0.01" min="0" class="input-field" value={data.settings.free_delivery_threshold || ''} placeholder="e.g. 2000" />
          <p class="text-xs text-brown-light/60 mt-1">Orders above this amount get free delivery. Leave empty to disable.</p>
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
      <h2 class="font-semibold text-brown mb-4 flex items-center gap-2">
        <Phone class="w-5 h-5 text-gold" />
        Contact Information
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="whatsapp_number" class="block text-sm font-medium text-brown mb-1">WhatsApp Number</label>
          <input id="whatsapp_number" name="whatsapp_number" type="text" class="input-field" value={data.settings.whatsapp_number} />
          <p class="text-xs text-brown-light/60 mt-1">This number will be used for WhatsApp chat links.</p>
        </div>
        <div>
          <label for="phone_numbers" class="block text-sm font-medium text-brown mb-1">Phone Numbers (comma-separated)</label>
          <input id="phone_numbers" name="phone_numbers" type="text" class="input-field" value={phoneNumbersStr} />
          <p class="text-xs text-brown-light/60 mt-1">These will be shown as click-to-call links.</p>
        </div>
      </div>
    </div>

    <!-- Store Locations -->
    <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
      <h2 class="font-semibold text-brown mb-4 flex items-center gap-2">
        <MapPin class="w-5 h-5 text-gold" />
        Store Locations
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="address_line_1" class="block text-sm font-medium text-brown mb-1">Location 1 Address</label>
          <input id="address_line_1" name="address_line_1" type="text" class="input-field" value={data.settings.address_line_1} />
        </div>
        <div>
          <label for="address_line_2" class="block text-sm font-medium text-brown mb-1">Location 2 Address</label>
          <input id="address_line_2" name="address_line_2" type="text" class="input-field" value={data.settings.address_line_2} />
        </div>
      </div>
    </div>

    <button type="submit" class="btn-primary flex items-center gap-2">
      <Save class="w-5 h-5" />
      Save Settings
    </button>
  </form>
</div>
