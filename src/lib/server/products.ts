import { getAdminClient } from '$lib/server/supabase';
import type { Product, Category, StoreSettings } from '$lib/types';
import { DEFAULT_STORE_SETTINGS } from '$lib/config';

export async function getPublishedProducts(): Promise<Product[]> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as Product[];
  } catch (e) {
    console.error('Failed to load products:', e);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as Product[];
  } catch (e) {
    console.error('Failed to load featured products:', e);
    return [];
  }
}

export async function getNewArrivals(): Promise<Product[]> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) throw error;
    return (data || []) as unknown as Product[];
  } catch (e) {
    console.error('Failed to load new arrivals:', e);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return data as unknown as Product;
  } catch (e) {
    console.error('Failed to load product:', e);
    return null;
  }
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4
): Promise<Product[]> {
  try {
    const client = getAdminClient();
    let query = client
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_published', true)
      .neq('id', productId)
      .limit(limit);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as unknown as Product[];
  } catch (e) {
    console.error('Failed to load related products:', e);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as unknown as Category[];
  } catch (e) {
    console.error('Failed to load categories:', e);
    return [];
  }
}

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from('store_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return DEFAULT_STORE_SETTINGS as unknown as StoreSettings;
    }
    return data as unknown as StoreSettings;
  } catch (e) {
    console.error('Failed to load store settings:', e);
    return DEFAULT_STORE_SETTINGS as unknown as StoreSettings;
  }
}
