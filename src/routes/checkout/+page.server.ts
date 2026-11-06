import type { PageServerLoad, Actions } from './$types';
import { getStoreSettings } from '$lib/server/products';
import { createOrder } from '$lib/server/orders';
import { fail, redirect } from '@sveltejs/kit';
import { checkoutSchema } from '$lib/validation';

export const load: PageServerLoad = async () => {
  const storeSettings = await getStoreSettings();
  return {
    storeSettings,
    esewaConfigured: false
  };
};

export const actions: Actions = {
  placeOrder: async ({ request }) => {
    const formData = await request.formData();
    const raw = Object.fromEntries(formData.entries());

    // Parse cart items from hidden JSON field
    let cartItems: { product_id: string; quantity: number }[] = [];
    try {
      cartItems = JSON.parse(raw.cart_items as string);
    } catch {
      return fail(400, { error: 'Your cart appears to be empty. Please add products before checking out.' });
    }

    if (!cartItems || cartItems.length === 0) {
      return fail(400, { error: 'Your cart is empty. Please add products before checking out.' });
    }

    // Parse and validate form data
    const formDataObj = {
      customer_name: raw.customer_name,
      customer_phone: raw.customer_phone,
      province: raw.province,
      district: raw.district,
      municipality: raw.municipality,
      ward_number: raw.ward_number,
      street_address: raw.street_address,
      landmark: raw.landmark || null,
      payment_method: raw.payment_method,
      transaction_reference: raw.transaction_reference || null,
      notes: raw.notes || null
    };

    const parsed = checkoutSchema.safeParse(formDataObj);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      return fail(400, { errors, values: formDataObj });
    }

    if (parsed.data.payment_method === 'qr' && !parsed.data.transaction_reference?.trim()) {
      return fail(400, { error: 'Enter the transaction reference after paying by QR.' });
    }

    // Get delivery fee
    const storeSettings = await getStoreSettings();
    let deliveryFee = storeSettings.delivery_charge || 150;

    // Calculate items total to check free delivery threshold
    const { getAdminClient } = await import('$lib/server/supabase');
    try {
      const client = getAdminClient();
      const productIds = cartItems.map((i) => i.product_id);
      const { data: products } = await client
        .from('bch_products')
        .select('*')
        .in('id', productIds);

      let itemsTotal = 0;
      for (const item of cartItems) {
        const product = products?.find((p) => p.id === item.product_id);
        if (product) {
          itemsTotal += (product.discount_price ?? product.price) * item.quantity;
        }
      }

      if (storeSettings.free_delivery_threshold && itemsTotal >= storeSettings.free_delivery_threshold) {
        deliveryFee = 0;
      }
    } catch {
      // Continue with default delivery fee
    }

    // Create order
    const order = await createOrder({
      customer_name: parsed.data.customer_name,
      customer_phone: parsed.data.customer_phone,
      province: parsed.data.province,
      district: parsed.data.district,
      municipality: parsed.data.municipality,
      ward_number: parsed.data.ward_number,
      street_address: parsed.data.street_address,
      landmark: parsed.data.landmark ?? null,
      payment_method: parsed.data.payment_method,
      transaction_reference: parsed.data.transaction_reference,
      items: cartItems,
      delivery_fee: deliveryFee,
      notes: parsed.data.notes ?? null
    });

    if (!order) {
      return fail(500, { error: 'Failed to create order. Please try again or contact us.' });
    }

    // COD success — redirect to confirmation page
    throw redirect(303, `/order/confirmation/${order.order_number}`);
  }
};
