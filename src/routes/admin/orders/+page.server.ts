import type { PageServerLoad, Actions } from './$types';
import { deleteOrderById, getAllOrders, updateOrderStatus } from '$lib/server/orders';
import type { Order } from '$lib/types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const statusFilter = url.searchParams.get('status') || '';
  const dateFilter = url.searchParams.get('date') || '';
  const searchQuery = url.searchParams.get('q') || '';

  let orders = await getAllOrders(200, 0);

  if (statusFilter) {
    orders = orders.filter((o) => o.order_status === statusFilter);
  }

  if (dateFilter) {
    const filterDate = new Date(dateFilter);
    orders = orders.filter((o) => {
      const orderDate = new Date(o.created_at);
      return orderDate.toDateString() === filterDate.toDateString();
    });
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
    );
  }

  return {
    orders,
    statusFilter,
    dateFilter,
    searchQuery
  };
};

export const actions: Actions = {
  updateStatus: async ({ request }) => {
    const formData = await request.formData();
    const orderId = formData.get('order_id') as string;
    const status = formData.get('status') as Order['order_status'];

    if (!orderId || !status) return fail(400, { error: 'Missing required fields' });

    const success = await updateOrderStatus(orderId, status);
    if (!success) return fail(500, { error: 'Failed to update order status' });

    return { success: true };
  },

  deleteOrder: async ({ request }) => {
    const formData = await request.formData();
    const orderId = formData.get('order_id');

    if (typeof orderId !== 'string' || !orderId) {
      return fail(400, { error: 'Missing order ID' });
    }

    const success = await deleteOrderById(orderId);
    if (!success) return fail(500, { error: 'Failed to delete order' });

    return { success: true };
  }
};
