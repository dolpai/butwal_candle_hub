<script lang="ts">
  import { enhance } from '$app/forms';
  import { cart, getCartTotal, getEffectivePrice } from '$lib/cart.svelte';
  import { formatNPR } from '$lib/utils';
  import { NEPAL_PROVINCES } from '$lib/config';
  import { toasts } from '$lib/toast.svelte';
  import type { PageData, ActionData } from './$types';
  import { ChevronLeft, Truck, Banknote, QrCode, Check, Download, Expand } from 'lucide-svelte';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let cartItems = $derived($cart);
  let subtotal = $derived(getCartTotal(cartItems));
  let deliveryFee = $derived(
    data.storeSettings.free_delivery_threshold && subtotal >= data.storeSettings.free_delivery_threshold
      ? 0
      : data.storeSettings.delivery_charge || 150
  );
  let total = $derived(subtotal + deliveryFee);

  let selectedPayment = $state<'cod' | 'qr'>('cod');
  let submitting = $state(false);

  let formValues = $state({
    customer_name: form?.values?.customer_name || '',
    customer_phone: form?.values?.customer_phone || '',
    province: form?.values?.province || '',
    district: form?.values?.district || '',
    municipality: form?.values?.municipality || '',
    ward_number: form?.values?.ward_number || '',
    street_address: form?.values?.street_address || '',
    landmark: form?.values?.landmark || '',
    notes: form?.values?.notes || ''
  });

  let errors = $state<Record<string, string>>(form?.errors || {});

  let isFreeDelivery = $derived(deliveryFee === 0);
</script>

<svelte:head>
  <title>Checkout — Butwal Candle Hub</title>
  <meta name="description" content="Complete your order with Cash on Delivery or manual QR payment." />
</svelte:head>

<div class="section-padding py-6 sm:py-8">
  <a href="/cart" class="inline-flex items-center gap-1 text-sm text-brown-light hover:text-gold transition-colors mb-4">
    <ChevronLeft class="w-4 h-4" />
    Back to Cart
  </a>

  <h1 class="font-serif text-2xl sm:text-3xl font-bold text-brown mb-6">Checkout</h1>

  {#if cartItems.length === 0}
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <p class="text-brown-light mb-4">Your cart is empty</p>
      <a href="/shop" class="btn-primary">Shop Now</a>
    </div>
  {:else}
    <form
      method="POST"
      action="?/placeOrder"
      use:enhance={({ cancel }) => {
        if (cartItems.length === 0) {
          cancel();
          toasts.error('Your cart is empty');
          return;
        }

        submitting = true;
        return async ({ update }) => {
          try {
            await update();
          } finally {
            submitting = false;
          }
        };
      }}
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <!-- Left: Form -->
      <div class="lg:col-span-2 space-y-6">
        {#if form?.error}
          <div class="bg-danger/10 border border-danger/30 rounded-lg p-4 text-danger text-sm">
            {form.error}
          </div>
        {/if}

        <!-- Delivery Information -->
        <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
          <h2 class="font-semibold text-brown mb-4 flex items-center gap-2">
            <Truck class="w-5 h-5 text-gold" />
            Delivery Information
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="sm:col-span-2">
              <label for="customer_name" class="block text-sm font-medium text-brown mb-1">Full Name <span class="text-danger">*</span></label>
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                bind:value={formValues.customer_name}
                class="input-field"
                placeholder="Enter your full name"
                required
              />
              {#if errors.customer_name}<p class="text-xs text-danger mt-1">{errors.customer_name}</p>{/if}
            </div>

            <div class="sm:col-span-2">
              <label for="customer_phone" class="block text-sm font-medium text-brown mb-1">Mobile Number <span class="text-danger">*</span></label>
              <input
                id="customer_phone"
                name="customer_phone"
                type="tel"
                bind:value={formValues.customer_phone}
                class="input-field"
                placeholder="Enter your mobile number"
                required
              />
              {#if errors.customer_phone}<p class="text-xs text-danger mt-1">{errors.customer_phone}</p>{/if}
            </div>

            <div>
              <label for="province" class="block text-sm font-medium text-brown mb-1">Province <span class="text-danger">*</span></label>
              <select
                id="province"
                name="province"
                bind:value={formValues.province}
                class="input-field cursor-pointer"
                required
              >
                <option value="">Select Province</option>
                {#each NEPAL_PROVINCES as province}
                    <option value={province}>{province}</option>
                {/each}
              </select>
              {#if errors.province}<p class="text-xs text-danger mt-1">{errors.province}</p>{/if}
            </div>

            <div>
              <label for="district" class="block text-sm font-medium text-brown mb-1">District <span class="text-danger">*</span></label>
              <input
                id="district"
                name="district"
                type="text"
                bind:value={formValues.district}
                class="input-field"
                placeholder="e.g. Rupandehi"
                required
              />
              {#if errors.district}<p class="text-xs text-danger mt-1">{errors.district}</p>{/if}
            </div>

            <div>
              <label for="municipality" class="block text-sm font-medium text-brown mb-1">Municipality / City <span class="text-danger">*</span></label>
              <input
                id="municipality"
                name="municipality"
                type="text"
                bind:value={formValues.municipality}
                class="input-field"
                placeholder="e.g. Butwal Sub-Metropolitan"
                required
              />
              {#if errors.municipality}<p class="text-xs text-danger mt-1">{errors.municipality}</p>{/if}
            </div>

            <div>
              <label for="ward_number" class="block text-sm font-medium text-brown mb-1">Ward Number <span class="text-danger">*</span></label>
              <input
                id="ward_number"
                name="ward_number"
                type="text"
                bind:value={formValues.ward_number}
                class="input-field"
                placeholder="e.g. 7"
                required
              />
              {#if errors.ward_number}<p class="text-xs text-danger mt-1">{errors.ward_number}</p>{/if}
            </div>

            <div class="sm:col-span-2">
              <label for="street_address" class="block text-sm font-medium text-brown mb-1">Complete Street / House Address <span class="text-danger">*</span></label>
              <input
                id="street_address"
                name="street_address"
                type="text"
                bind:value={formValues.street_address}
                class="input-field"
                placeholder="e.g. Near Traffic Chowk, House No. 123"
                required
              />
              {#if errors.street_address}<p class="text-xs text-danger mt-1">{errors.street_address}</p>{/if}
            </div>

            <div class="sm:col-span-2">
              <label for="landmark" class="block text-sm font-medium text-brown mb-1">Nearby Landmark <span class="text-brown-light/50">(optional)</span></label>
              <input
                id="landmark"
                name="landmark"
                type="text"
                bind:value={formValues.landmark}
                class="input-field"
                placeholder="e.g. Near City Mall"
              />
            </div>

            <div class="sm:col-span-2">
              <label for="notes" class="block text-sm font-medium text-brown mb-1">Order Notes <span class="text-brown-light/50">(optional)</span></label>
              <textarea
                id="notes"
                name="notes"
                bind:value={formValues.notes}
                rows="2"
                class="input-field"
                placeholder="Any special instructions for delivery"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-xl border border-beige-dark/30 p-4 sm:p-6">
          <h2 class="font-semibold text-brown mb-4">Payment Method</h2>

          <div class="space-y-3">
            <!-- Cash on Delivery -->
            <label
              class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all {selectedPayment === 'cod' ? 'border-gold bg-gold/5' : 'border-beige-dark/30 hover:border-gold/50'}"
            >
              <input
                type="radio"
                name="payment_method"
                value="cod"
                bind:group={selectedPayment}
                class="w-4 h-4 accent-gold"
              />
              <Banknote class="w-6 h-6 text-success" />
              <div class="flex-1">
                <p class="font-medium text-brown">Cash on Delivery</p>
                <p class="text-xs text-brown-light">Pay with cash when your order is delivered</p>
              </div>
            </label>

            <!-- Manual QR Payment -->
            <label
              class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all {selectedPayment === 'qr' ? 'border-gold bg-gold/5' : 'border-beige-dark/30 hover:border-gold/50'}"
            >
              <input
                type="radio"
                name="payment_method"
                value="qr"
                bind:group={selectedPayment}
                class="w-4 h-4 accent-gold"
              />
              <QrCode class="w-6 h-6 text-gold-dark" />
              <div class="flex-1">
                <p class="font-medium text-brown">QR Payment (Fonepay / eSewa)</p>
                <p class="text-xs text-brown-light">Scan and pay manually, then enter your transaction reference</p>
              </div>
            </label>
          </div>

          {#if selectedPayment === 'qr'}
            <div class="mt-4 rounded-xl border border-beige-dark/40 bg-beige/30 p-4 sm:p-5">
              <div class="mb-3 text-center">
                <p class="font-semibold text-brown">Pay {formatNPR(total)}</p>
                <p class="text-sm text-brown-light mt-1">Scan this Fonepay / eSewa QR using your payment app.</p>
              </div>
              <a href="/images/payment-qr.jpg" target="_blank" rel="noopener" aria-label="Open payment QR image at full size" class="block w-full max-w-sm mx-auto rounded-lg bg-white p-2">
                <img src="/images/payment-qr.jpg" alt="Fonepay and eSewa payment QR for AAKASH SAPKOTA, eSewa ID 9765244850" class="mx-auto block w-full max-h-[min(65vh,560px)] object-contain" />
              </a>
              <p class="text-center font-semibold text-brown mt-3">AAKASH SAPKOTA</p>
              <p class="text-center text-sm text-brown-light">eSewa ID: 9765244850</p>
              <div class="flex justify-center gap-3 mt-3">
                <a href="/images/payment-qr.jpg" download="butwal-candle-hub-payment-qr.png" class="inline-flex items-center gap-2 rounded-lg border border-beige-dark/50 bg-white px-3 py-2 text-sm font-medium text-brown hover:border-gold">
                  <Download class="w-4 h-4" /> Download QR
                </a>
                <a href="/images/payment-qr.jpg" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-lg border border-beige-dark/50 bg-white px-3 py-2 text-sm font-medium text-brown hover:border-gold">
                  <Expand class="w-4 h-4" /> Enlarge
                </a>
              </div>
              <div class="mt-4">
                <label for="transaction_reference" class="block text-sm font-medium text-brown mb-1">Transaction reference <span class="text-danger">*</span></label>
                <input id="transaction_reference" name="transaction_reference" type="text" class="input-field" placeholder="Enter the reference shown in your payment app" required={selectedPayment === 'qr'} value={form?.values?.transaction_reference || ''} />
                <p class="text-xs text-brown-light mt-1">Your order will remain unpaid until an admin verifies the payment.</p>
              </div>
            </div>
          {/if}

          <!-- Hidden cart items -->
          <input type="hidden" name="cart_items" value={JSON.stringify(cartItems.map((item) => ({ product_id: item.product_id, quantity: item.quantity })))} />
        </div>
      </div>

      <!-- Right: Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl border border-beige-dark/30 p-4 lg:sticky lg:top-24">
          <h2 class="font-semibold text-brown mb-3">Order Summary</h2>

          <!-- Items -->
          <div class="space-y-2 mb-3 max-h-48 overflow-y-auto">
            {#each cartItems as item (item.product_id)}
              <div class="flex items-center gap-2 text-sm">
                <div class="w-10 h-10 rounded-md overflow-hidden bg-beige shrink-0">
                  {#if item.image}
                    <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
                  {/if}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-brown line-clamp-1">{item.name}</p>
                  <p class="text-xs text-brown-light">{item.quantity} × {formatNPR(getEffectivePrice(item))}</p>
                </div>
                <span class="font-medium text-brown">{formatNPR(getEffectivePrice(item) * item.quantity)}</span>
              </div>
            {/each}
          </div>

          <hr class="border-beige-dark/30 my-3" />

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-brown-light">Subtotal</span>
              <span class="font-medium text-brown">{formatNPR(subtotal)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-brown-light">Delivery</span>
              {#if isFreeDelivery}
                <span class="text-success font-medium">FREE</span>
              {:else}
                <span class="font-medium text-brown">{formatNPR(deliveryFee)}</span>
              {/if}
            </div>
            {#if data.storeSettings.free_delivery_threshold && !isFreeDelivery}
              <p class="text-xs text-gold-dark">
                Add {formatNPR(data.storeSettings.free_delivery_threshold - subtotal)} more for free delivery
              </p>
            {/if}
          </div>

          <hr class="border-beige-dark/30 my-3" />

          <div class="flex justify-between items-baseline mb-4">
            <span class="font-semibold text-brown">Total</span>
            <span class="font-serif text-2xl font-bold text-brown">{formatNPR(total)}</span>
          </div>

          <!-- Delivery Address Preview -->
          <div class="bg-beige/50 rounded-lg p-3 text-xs text-brown-light mb-4">
            <p class="font-medium text-brown mb-1">Delivery to:</p>
            <p>{formValues.customer_name || '—'}</p>
            <p>{formValues.street_address || '—'}, Ward {formValues.ward_number || '—'}</p>
            <p>{formValues.municipality || '—'}, {formValues.district || '—'}</p>
            <p>{formValues.province || '—'}</p>
            <p>Phone: {formValues.customer_phone || '—'}</p>
          </div>

          <button
            type="submit"
            class="btn-festive w-full flex items-center justify-center gap-2"
            disabled={submitting}
          >
            {#if submitting}
              <span>Processing...</span>
            {:else}
              <Check class="w-5 h-5" />
              {selectedPayment === 'cod' ? 'Place Order (COD)' : 'Submit QR Payment Reference'}
            {/if}
          </button>

          <p class="text-xs text-brown-light/60 text-center mt-3">
            By placing your order, you agree to our terms of service.
          </p>
        </div>
      </div>
    </form>
  {/if}
</div>
