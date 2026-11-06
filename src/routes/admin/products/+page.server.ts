import type { PageServerLoad, Actions } from './$types';
import { getAdminClient } from '$lib/server/supabase';
import { getCategories } from '$lib/server/products';
import { slugify } from '$lib/utils';

export const load: PageServerLoad = async () => {
  const client = getAdminClient();
  const [productsResult, categories] = await Promise.all([
    client.from('bch_products').select('*, category:bch_categories(*)').order('created_at', { ascending: false }),
    getCategories()
  ]);

  return {
    products: productsResult.data || [],
    categories
  };
};

export const actions: Actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) return { error: 'Product ID is required' };

    const client = getAdminClient();
    const { error } = await client.from('bch_products').delete().eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
  },

  togglePublish: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const current = formData.get('is_published') === 'true';

    const client = getAdminClient();
    const { error } = await client
      .from('bch_products')
      .update({ is_published: !current, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
  },

  toggleFeatured: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const current = formData.get('is_featured') === 'true';

    const client = getAdminClient();
    const { error } = await client
      .from('bch_products')
      .update({ is_featured: !current, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
  },

  createCategory: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('category_name') as string;

    if (!name) return { error: 'Category name is required' };

    const client = getAdminClient();
    const { error } = await client
      .from('bch_categories')
      .insert({ name, slug: slugify(name) });

    if (error) return { error: error.message };
    return { success: true };
  }
};
