import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    return { isAdminPage: true, session: null };
  }

  const { data: profile } = await locals.supabase
    .from('bch_profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single();

  if (!profile?.is_admin) {
    return { isAdminPage: true, session };
  }

  return { isAdminPage: true, session };
};
