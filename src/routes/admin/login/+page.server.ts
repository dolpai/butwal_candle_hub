import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { session } = await locals.safeGetSession();

  if (session) {
    // Check if already admin
    const { data: profile } = await locals.supabase
      .from('bch_profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (profile?.is_admin) {
      throw redirect(303, '/admin');
    }
  }

  return { session };
};

export const actions: Actions = {
  login: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Please enter both email and password.' };
    }

    const { data, error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      return { error: 'Invalid email or password.' };
    }

    // Check if user is admin
    const { data: profile } = await locals.supabase
      .from('bch_profiles')
      .select('is_admin')
      .eq('id', data.user.id)
      .single();

    if (!profile?.is_admin) {
      await locals.supabase.auth.signOut();
      return { error: 'You do not have admin access. Please contact the store administrator.' };
    }

    throw redirect(303, '/admin');
  }
};
