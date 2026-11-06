import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      safeGetSession: () => Promise<{
        session: import('@supabase/supabase-js').Session | null;
      }>;
    }
    interface PageData {
      session: import('@supabase/supabase-js').Session | null;
    }
  }
}

export {};
