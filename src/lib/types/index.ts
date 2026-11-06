export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number | null;
  category_id: string | null;
  stock: number;
  is_featured: boolean;
  is_published: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed';
export type PaymentMethod = 'cod' | 'qr' | 'esewa';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  province: string;
  district: string;
  municipality: string;
  ward_number: string;
  street_address: string;
  landmark: string | null;
  items_total: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  payments?: Payment[];
}

export interface Payment {
  id: string;
  order_id: string;
  transaction_uuid: string | null;
  payment_method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  raw_response: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  id: string;
  announcement: string | null;
  delivery_charge: number;
  free_delivery_threshold: number | null;
  promotional_banner: string | null;
  whatsapp_number: string;
  phone_numbers: string[];
  address_line_1: string;
  address_line_2: string;
  store_name: string;
  store_email: string | null;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  image: string | null;
  stock: number;
  quantity: number;
}

export interface OrderStatusInfo {
  label: string;
  color: string;
  description: string;
}
