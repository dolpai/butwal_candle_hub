import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const PUBLIC_SUPABASE_URL = publicEnv.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = privateEnv.SUPABASE_SERVICE_ROLE_KEY;
const PUBLIC_SUPABASE_ANON_KEY = publicEnv.PUBLIC_SUPABASE_ANON_KEY;

// Admin client with service role key — NEVER expose to frontend
export function getAdminClient(): SupabaseClient {
  if (!PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase server credentials. Check environment variables.');
  }
  return createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY && PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co');
}
