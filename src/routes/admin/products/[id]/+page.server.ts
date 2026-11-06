import type { PageServerLoad, Actions } from './$types';
import { getAdminClient } from '$lib/server/supabase';
import { getCategories } from '$lib/server/products';
import { slugify } from '$lib/utils';
import { fail, redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const client = getAdminClient();
  const [productResult, categories] = await Promise.all([
    client.from('bch_products').select('*, category:bch_categories(*)').eq('id', params.id).single(),
    getCategories()
  ]);

  if (productResult.error || !productResult.data) {
    throw error(404, 'Product not found');
  }

  return {
    product: productResult.data,
    categories
  };
};

export const actions: Actions = {
  update: async ({ request, params, locals }) => {
    const { session } = await locals.safeGetSession();
    if (!session) return fail(401, { error: 'Unauthorized' });

    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const discountPrice = formData.get('discount_price') as string;
    const categoryId = formData.get('category_id') as string;
    const stock = parseInt(formData.get('stock') as string);
    const isFeatured = formData.get('is_featured') === 'on';
    const isPublished = formData.get('is_published') === 'on';

    let images: string[] = [];
    const imagesRaw = formData.get('images') as string;
    if (imagesRaw) {
      try {
        images = JSON.parse(imagesRaw);
      } catch {
        images = [];
      }
    }

    if (!name || name.trim().length < 2) return fail(400, { error: 'Product name is required' });
    if (!description || description.trim().length < 10) return fail(400, { error: 'Description must be at least 10 characters' });
    if (!price || price <= 0) return fail(400, { error: 'Price must be greater than 0' });
    if (isNaN(stock) || stock < 0) return fail(400, { error: 'Stock must be 0 or more' });
    if (images.length === 0) return fail(400, { error: 'At least one product image is required' });

    const client = getAdminClient();
    const { error } = await client.from('bch_products').update({
      name: name.trim(),
      description: description.trim(),
      price,
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      category_id: categoryId || null,
      stock,
      is_featured: isFeatured,
      is_published: isPublished,
      images,
      updated_at: new Date().toISOString()
    }).eq('id', params.id);

    if (error) return fail(500, { error: error.message });

    throw redirect(303, '/admin/products');
  },

  delete: async ({ params, locals }) => {
    const { session } = await locals.safeGetSession();
    if (!session) return fail(401, { error: 'Unauthorized' });

    const client = getAdminClient();
    const { error } = await client.from('bch_products').delete().eq('id', params.id);

    if (error) return fail(500, { error: error.message });

    throw redirect(303, '/admin/products');
  }
};
