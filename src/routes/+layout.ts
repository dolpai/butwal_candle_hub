import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  return {
    storeSettings: data.storeSettings,
    categories: data.categories,
    session: data.session
  };
};
