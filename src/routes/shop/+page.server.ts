import type { PageServerLoad } from './$types';
import { getPublishedProducts, getCategories } from '$lib/server/products';
import type { Product } from '$lib/types';

export const load: PageServerLoad = async ({ url }) => {
  const searchQuery = url.searchParams.get('q') || '';
  const categorySlug = url.searchParams.get('category') || '';
  const sort = url.searchParams.get('sort') || 'latest';
  const availability = url.searchParams.get('availability') || '';

  const [allProducts, categories] = await Promise.all([
    getPublishedProducts(),
    getCategories()
  ]);

  let products = [...allProducts];

  // Filter by category
  if (categorySlug) {
    products = products.filter((p) => p.category?.slug === categorySlug);
  }

  // Filter by search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Filter by availability
  if (availability === 'in-stock') {
    products = products.filter((p) => p.stock > 0);
  } else if (availability === 'out-of-stock') {
    products = products.filter((p) => p.stock <= 0);
  }

  // Sort
  switch (sort) {
    case 'price-low':
      products.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
      break;
    case 'price-high':
      products.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
      break;
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return {
    products,
    categories,
    searchQuery,
    categorySlug,
    activeCategory,
    sort,
    availability
  };
};
