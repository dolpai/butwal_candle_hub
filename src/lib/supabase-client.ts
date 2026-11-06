import { createClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import type { Database } from '$lib/types/database';

export function getSupabaseClient() {
  if (!publicEnv.PUBLIC_SUPABASE_URL || !publicEnv.PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are not configured.');
  }
  return createClient<Database>(publicEnv.PUBLIC_SUPABASE_URL, publicEnv.PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false
    }
  });
}

export function isSupabaseConfigured(): boolean {
  return !!(publicEnv.PUBLIC_SUPABASE_URL && publicEnv.PUBLIC_SUPABASE_ANON_KEY && publicEnv.PUBLIC_SUPABASE_URL !== 'placeholder');
}
