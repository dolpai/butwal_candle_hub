import { z } from 'zod';

export const checkoutSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Full name is required')
    .max(100, 'Name is too long'),
  customer_phone: z
    .string()
    .min(7, 'Valid mobile number is required')
    .max(20, 'Phone number is too long')
    .regex(/^[0-9+\-\s]+$/, 'Please enter a valid phone number'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  municipality: z.string().min(1, 'Municipality/City is required'),
  ward_number: z.string().min(1, 'Ward number is required'),
  street_address: z.string().min(5, 'Complete street address is required'),
  landmark: z.string().optional().nullable(),
  payment_method: z.enum(['cod', 'qr']),
  transaction_reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(200),
  description: z.string().min(10, 'Description is required').max(5000),
  price: z.number().positive('Price must be greater than 0'),
  discount_price: z.number().positive().optional().nullable(),
  category_id: z.string().optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  images: z.array(z.string()).min(1, 'At least one product image is required')
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(100),
  description: z.string().optional().nullable()
});

export const storeSettingsSchema = z.object({
  announcement: z.string().optional().nullable(),
  delivery_charge: z.number().min(0),
  free_delivery_threshold: z.number().optional().nullable(),
  promotional_banner: z.string().optional().nullable(),
  whatsapp_number: z.string().optional(),
  phone_numbers: z.array(z.string()).optional(),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  store_name: z.string().optional(),
  store_email: z.string().email().optional().nullable()
});

export const orderTrackingSchema = z.object({
  order_number: z.string().min(1, 'Order number is required'),
  phone: z.string().min(7, 'Phone number is required')
});
