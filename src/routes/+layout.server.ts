import type { LayoutServerLoad } from './$types';
import { getStoreSettings, getCategories } from '$lib/server/products';

export const load: LayoutServerLoad = async ({ locals }) => {
  const [storeSettings, categories] = await Promise.all([
    getStoreSettings(),
    getCategories()
  ]);

  const { session } = await locals.safeGetSession();

  return {
    storeSettings,
    categories,
    session
  };
};
