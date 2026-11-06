import type { PageServerLoad, Actions } from './$types';
import { getAdminClient } from '$lib/server/supabase';
import { getCategories } from '$lib/server/products';
import { slugify } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const categories = await getCategories();
  return { categories };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
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

    // Get image URLs from hidden field
    let images: string[] = [];
    const imagesRaw = formData.get('images') as string;
    if (imagesRaw) {
      try {
        images = JSON.parse(imagesRaw);
      } catch {
        images = [];
      }
    }

    // Validation
    if (!name || name.trim().length < 2) return fail(400, { error: 'Product name is required' });
    if (!description || description.trim().length < 10) return fail(400, { error: 'Description must be at least 10 characters' });
    if (!price || price <= 0) return fail(400, { error: 'Price must be greater than 0' });
    if (isNaN(stock) || stock < 0) return fail(400, { error: 'Stock must be 0 or more' });
    if (images.length === 0) return fail(400, { error: 'At least one product image is required' });

    const client = getAdminClient();
    const { data, error } = await client.from('products').insert({
      name: name.trim(),
      slug: slugify(name.trim()) + '-' + Date.now().toString(36),
      description: description.trim(),
      price,
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      category_id: categoryId || null,
      stock,
      is_featured: isFeatured,
      is_published: isPublished,
      images
    }).select().single();

    if (error) return fail(500, { error: error.message });

    throw redirect(303, '/admin/products');
  }
};
