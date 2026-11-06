import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  return {
    orderNumber: url.searchParams.get('transaction_uuid') || '',
    error: url.searchParams.get('error') || 'Payment was cancelled or failed.'
  };
};
