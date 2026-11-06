import type { PageServerLoad, Actions } from './$types';
import { getAdminClient } from '$lib/server/supabase';
import { getStoreSettings } from '$lib/server/products';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const settings = await getStoreSettings();
  return { settings };
};

export const actions: Actions = {
  update: async ({ request, locals }) => {
    const { session } = await locals.safeGetSession();
    if (!session) return fail(401, { error: 'Unauthorized' });

    const formData = await request.formData();

    const announcement = formData.get('announcement') as string;
    const deliveryCharge = parseFloat(formData.get('delivery_charge') as string);
    const freeDeliveryThreshold = formData.get('free_delivery_threshold') as string;
    const promotionalBanner = formData.get('promotional_banner') as string;
    const whatsappNumber = formData.get('whatsapp_number') as string;
    const phoneNumbersRaw = formData.get('phone_numbers') as string;
    const addressLine1 = formData.get('address_line_1') as string;
    const addressLine2 = formData.get('address_line_2') as string;
    const storeName = formData.get('store_name') as string;
    const storeEmail = formData.get('store_email') as string;

    const phoneNumbers = phoneNumbersRaw
      ? phoneNumbersRaw.split(',').map((p) => p.trim()).filter(Boolean)
      : [];

    const updateData = {
      announcement: announcement || null,
      delivery_charge: isNaN(deliveryCharge) ? 150 : deliveryCharge,
      free_delivery_threshold: freeDeliveryThreshold ? parseFloat(freeDeliveryThreshold) : null,
      promotional_banner: promotionalBanner || null,
      whatsapp_number: whatsappNumber || '9766796959',
      phone_numbers: phoneNumbers.length > 0 ? phoneNumbers : ['9768345387', '9847366946'],
      address_line_1: addressLine1 || '',
      address_line_2: addressLine2 || '',
      store_name: storeName || 'Butwal Candle Hub',
      store_email: storeEmail || null,
      updated_at: new Date().toISOString()
    };

    const client = getAdminClient();

    // Check if settings row exists
    const { data: existing } = await client.from('bch_store_settings').select('id').limit(1).single();

    if (existing?.id) {
      const { error } = await client.from('bch_store_settings').update(updateData).eq('id', existing.id);
      if (error) return fail(500, { error: error.message });
    } else {
      const { error } = await client.from('bch_store_settings').insert(updateData);
      if (error) return fail(500, { error: error.message });
    }

    return { success: true };
  }
};
