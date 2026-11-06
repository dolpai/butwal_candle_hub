// Business configuration for Butwal Candle Hub
export const BUSINESS = {
  name: 'Butwal Candle Hub',
  locations: [
    {
      label: 'Location 1',
      address: 'MFM8+99F, H10, Butwal, Lumbini Province 32907, Nepal'
    },
    {
      label: 'Location 2',
      address: 'Shrawan Path, Butwal, Lumbini Province 32900, Nepal'
    }
  ],
  whatsapp: '9766796959',
  phones: ['9768345387', '9847366946'],
  email: null as string | null
} as const;

export function getWhatsAppLink(message?: string): string {
  const phone = BUSINESS.whatsapp;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  // Nepal country code is 977, but WhatsApp uses 977 prefix without leading 0
  const waNumber = cleanPhone.startsWith('977')
    ? cleanPhone
    : `977${cleanPhone.replace(/^0/, '')}`;
  const encodedMsg = message
    ? `?text=${encodeURIComponent(message)}`
    : '';
  return `https://wa.me/${waNumber}${encodedMsg}`;
}

export function getPhoneLink(phone: string): string {
  const clean = phone.replace(/[^0-9+]/g, '');
  return `tel:+977${clean.replace(/^0/, '')}`;
}

export function getMapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string; description: string }> = {
  pending: { label: 'Pending', color: 'warning', description: 'Your order has been received and is awaiting confirmation.' },
  confirmed: { label: 'Confirmed', color: 'gold', description: 'Your order has been confirmed and is being prepared.' },
  processing: { label: 'Processing', color: 'gold', description: 'Your order is being processed and packaged.' },
  shipped: { label: 'Shipped', color: 'gold', description: 'Your order has been shipped and is on its way.' },
  out_for_delivery: { label: 'Out for Delivery', color: 'gold', description: 'Your order is out for delivery today.' },
  delivered: { label: 'Delivered', color: 'success', description: 'Your order has been delivered. Thank you for shopping with us!' },
  cancelled: { label: 'Cancelled', color: 'danger', description: 'Your order has been cancelled.' }
};

export const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  unpaid: { label: 'Unpaid', color: 'warning' },
  paid: { label: 'Paid', color: 'success' },
  refunded: { label: 'Refunded', color: 'danger' },
  failed: { label: 'Failed', color: 'danger' }
};

export const NEPAL_PROVINCES = [
  'Koshi Province',
  'Madhesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province'
] as const;

// Default store settings used when database has no settings row yet
export const DEFAULT_STORE_SETTINGS = {
  announcement: 'Free delivery across Nepal on orders above Rs. 2000!',
  delivery_charge: 150,
  free_delivery_threshold: 2000,
  promotional_banner: 'Light Up Your Tihar With Beautiful Candles',
  whatsapp_number: BUSINESS.whatsapp,
  phone_numbers: BUSINESS.phones,
  address_line_1: BUSINESS.locations[0].address,
  address_line_2: BUSINESS.locations[1].address,
  store_name: BUSINESS.name,
  store_email: null
};
