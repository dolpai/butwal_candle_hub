import type { PageServerLoad, Actions } from './$types';
import { getOrderByNumber } from '$lib/server/orders';
import { orderTrackingSchema } from '$lib/validation';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const orderNumber = url.searchParams.get('order') || '';
  const phone = url.searchParams.get('phone') || '';

  let order = null;
  let error = '';

  if (orderNumber && phone) {
    order = await getOrderByNumber(orderNumber, phone);
    if (!order) {
      error = 'No order found with the provided details. Please check your order number and phone number.';
    }
  }

  return { order, error, prefilledOrderNumber: orderNumber, prefilledPhone: phone };
};

export const actions: Actions = {
  track: async ({ request }) => {
    const formData = await request.formData();
    const raw = Object.fromEntries(formData.entries());

    const parsed = orderTrackingSchema.safeParse({
      order_number: raw.order_number,
      phone: raw.phone
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      return fail(400, { errors });
    }

    const order = await getOrderByNumber(parsed.data.order_number, parsed.data.phone);
    if (!order) {
      return fail(404, { error: 'No order found. Please check your details.' });
    }

    return { order };
  }
};
