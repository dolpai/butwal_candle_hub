import { redirect, type Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { env as publicEnv } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
  const supabase = createServerClient(
    publicEnv.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    publicEnv.PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return event.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' });
          });
        }
      }
    }
  );

  event.locals.supabase = supabase;

  const {
    data: { session }
  } = await supabase.auth.getSession();
  event.locals.safeGetSession = async () => {
    return { session };
  };

  // Protect /admin routes
  if (event.url.pathname.startsWith('/admin') && event.url.pathname !== '/admin/login') {
    if (!session) {
      throw redirect(303, '/admin/login');
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('bch_profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_admin) {
      throw redirect(303, '/admin/login');
    }
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => {
      return html;
    }
  });
};
