import type { PageServerLoad, Actions } from './$types';
import { getOrderByNumberOnly } from '$lib/server/orders';
import { updatePaymentStatus } from '$lib/server/orders';
import { verifyEsewaPayment } from '$lib/server/esewa';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  // eSewa redirects back with query params
  const transactionUuid = url.searchParams.get('transaction_uuid') || '';
  const amount = url.searchParams.get('total_amount') || '';
  const productCode = url.searchParams.get('product_code') || '';
  const referenceId = url.searchParams.get('reference_id') || '';
  const signature = url.searchParams.get('signature') || '';
  const signedFieldNames = url.searchParams.get('signed_field_names') || '';

  let verified = false;
  let order = null;
  let error = '';

  if (transactionUuid) {
    order = await getOrderByNumberOnly(transactionUuid);

    if (!order) {
      error = 'Order not found for this transaction.';
    } else {
      // Verify the payment server-side
      const result = await verifyEsewaPayment({
        transactionUuid,
        amount: parseFloat(amount),
        productCode,
        referenceId,
        signature,
        signedFieldNames
      });

      if (result.verified) {
        verified = true;
        await updatePaymentStatus(order.id, 'paid');
      } else {
        error = result.error || 'Payment verification failed.';
      }
    }
  } else {
    error = 'No transaction information received.';
  }

  return { verified, order, error };
};
