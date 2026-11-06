import type { PageServerLoad } from './$types';
import { getFeaturedProducts, getNewArrivals, getStoreSettings, getCategories } from '$lib/server/products';

export const load: PageServerLoad = async () => {
  const [featured, newArrivals, storeSettings, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getStoreSettings(),
    getCategories()
  ]);

  // Best sellers: products with discount (simulated as best sellers for display)
  const bestSellers = newArrivals.filter((p) => p.discount_price).slice(0, 4);
  const fallbackBestSellers = bestSellers.length > 0 ? bestSellers : newArrivals.slice(0, 4);

  return {
    featured: featured.slice(0, 8),
    newArrivals: newArrivals.slice(0, 4),
    bestSellers: fallbackBestSellers,
    storeSettings,
    categories
  };
};
