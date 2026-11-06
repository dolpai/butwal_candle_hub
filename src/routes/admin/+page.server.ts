import type { PageServerLoad } from './$types';
import { getDashboardStats, getAllOrders } from '$lib/server/orders';

export const load: PageServerLoad = async () => {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getAllOrders(5, 0)
  ]);

  return { stats, recentOrders };
};
