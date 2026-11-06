import type { PageServerLoad, Actions } from './$types';
import { getOrderById, updateOrderStatus, updatePaymentStatus } from '$lib/server/orders';
import { error, fail } from '@sveltejs/kit';
import type { Order } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
  const order = await getOrderById(params.id);
  if (!order) throw error(404, 'Order not found');
  return { order };
};

export const actions: Actions = {
  updateStatus: async ({ request, params }) => {
    const formData = await request.formData();
    const status = formData.get('status') as Order['order_status'];
    const success = await updateOrderStatus(params.id, status);
    if (!success) return fail(500, { error: 'Failed to update status' });
    return { success: true };
  },

  updatePayment: async ({ request, params }) => {
    const formData = await request.formData();
    const status = formData.get('payment_status') as Order['payment_status'];
    const success = await updatePaymentStatus(params.id, status);
    if (!success) return fail(500, { error: 'Failed to update payment status' });
    return { success: true };
  }
};
