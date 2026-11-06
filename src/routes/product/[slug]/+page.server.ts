import type { PageServerLoad } from './$types';
import { getProductBySlug, getRelatedProducts } from '$lib/server/products';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const product = await getProductBySlug(params.slug);

  if (!product || !product.is_published) {
    throw error(404, 'Product not found');
  }

  const related = await getRelatedProducts(product.id, product.category_id, 4);

  return {
    product,
    related
  };
};
