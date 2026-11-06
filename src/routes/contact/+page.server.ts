import type { PageServerLoad } from './$types';
import { getStoreSettings } from '$lib/server/products';

export const load: PageServerLoad = async () => {
  const storeSettings = await getStoreSettings();
  return { storeSettings };
};
