import type { PageServerLoad } from './$types';
import { getStoreSettings } from '$lib/server/products';
import { getOrderByNumberOnly } from '$lib/server/orders';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const order = await getOrderByNumberOnly(params.orderNumber);
  const storeSettings = await getStoreSettings();

  if (!order) {
    throw error(404, 'Order not found');
  }

  return {
    order,
    storeSettings
  };
};
