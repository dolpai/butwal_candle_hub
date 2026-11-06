import { getAdminClient } from '$lib/server/supabase';
import type { Order } from '$lib/types';
import { generateOrderNumber } from '$lib/utils';

interface ProductRow {
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
}

export async function createOrder(params: {
  customer_name: string;
  customer_phone: string;
  province: string;
  district: string;
  municipality: string;
  ward_number: string;
  street_address: string;
  landmark: string | null;
  payment_method: 'cod' | 'qr';
  transaction_reference?: string | null;
  items: { product_id: string; quantity: number }[];
  delivery_fee: number;
  notes: string | null;
}): Promise<{ order_id: string; order_number: string } | null> {
  try {
    const client = getAdminClient();

    // Fetch products and validate stock
    const productIds = params.items.map((i) => i.product_id);
    const { data: productsData, error: productsError } = await client
      .from('bch_products')
      .select('*')
      .in('id', productIds);

    if (productsError || !productsData || productsData.length === 0) {
      throw new Error('Products not found');
    }

    const products = productsData as ProductRow[];

    // Validate stock and build order items
    let itemsTotal = 0;
    const orderItems = params.items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      const unitPrice = product.discount_price ?? product.price;
      const subtotal = unitPrice * item.quantity;
      itemsTotal += subtotal;
      return {
        product_id: product.id,
        product_name: product.name,
        product_image: product.images?.[0] || null,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal
      };
    });

    const totalAmount = itemsTotal + params.delivery_fee;
    const orderNumber = generateOrderNumber();

    // Insert order
    const { data: order, error: orderError } = await client
      .from('bch_orders')
      .insert({
        order_number: orderNumber,
        customer_name: params.customer_name,
        customer_phone: params.customer_phone,
        province: params.province,
        district: params.district,
        municipality: params.municipality,
        ward_number: params.ward_number,
        street_address: params.street_address,
        landmark: params.landmark,
        items_total: itemsTotal,
        delivery_fee: params.delivery_fee,
        total_amount: totalAmount,
        payment_method: params.payment_method,
        payment_status: 'unpaid',
        order_status: 'pending',
        notes: params.notes
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }

    const orderId = (order as any).id;

    // Insert order items
    const itemsToInsert = orderItems.map((item) => ({
      ...item,
      order_id: orderId
    }));

    const { error: itemsError } = await client
      .from('bch_order_items')
      .insert(itemsToInsert as any);

    if (itemsError) {
      // Rollback order
      await client.from('bch_orders').delete().eq('id', orderId);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Create initial payment record
    await client.from('bch_payments').insert({
      order_id: orderId,
      payment_method: params.payment_method,
      amount: totalAmount,
      status: 'unpaid',
      transaction_uuid: params.transaction_reference || null
    } as any);

    // Decrement stock
    for (const item of params.items) {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        await client
          .from('bch_products')
          .update({ stock: product.stock - item.quantity, updated_at: new Date().toISOString() } as any)
          .eq('id', item.product_id);
      }
    }

    return { order_id: orderId, order_number: orderNumber };
  } catch (e) {
    console.error('Failed to create order:', e);
    return null;
  }
}

export async function getOrderByNumber(
  orderNumber: string,
  phone: string
): Promise<Order | null> {
  try {
    const client = getAdminClient();
    let query = client
      .from('bch_orders')
      .select('*, order_items:bch_order_items(*), payments:bch_payments(*)')
      .eq('order_number', orderNumber);

    if (phone) {
      query = query.eq('customer_phone', phone);
    }

    const { data, error } = await query.single();

    if (error || !data) return null;
    return data as unknown as Order;
  } catch (e) {
    console.error('Failed to load order:', e);
    return null;
  }
}

export async function getOrderByNumberOnly(orderNumber: string): Promise<Order | null> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from('bch_orders')
      .select('*, order_items:bch_order_items(*)')
      .eq('order_number', orderNumber)
      .single();

    if (error || !data) return null;
    return data as unknown as Order;
  } catch (e) {
    console.error('Failed to load order:', e);
    return null;
  }
}

export async function getAllOrders(limit = 100, offset = 0): Promise<Order[]> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from('bch_orders')
      .select('*, order_items:bch_order_items(*)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data || []) as unknown as Order[];
  } catch (e) {
    console.error('Failed to load orders:', e);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['order_status']
): Promise<boolean> {
  try {
    const client = getAdminClient();
    const { error } = await client
      .from('bch_orders')
      .update({ order_status: status, updated_at: new Date().toISOString() } as any)
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to update order status:', e);
    return false;
  }
}

export async function updatePaymentStatus(
  orderId: string,
  status: Order['payment_status']
): Promise<boolean> {
  try {
    const client = getAdminClient();
    const { error } = await client
      .from('bch_orders')
      .update({ payment_status: status, updated_at: new Date().toISOString() } as any)
      .eq('id', orderId);

    if (error) throw error;
    await client.from('bch_payments').update({ status, updated_at: new Date().toISOString() } as any).eq('order_id', orderId);
    return true;
  } catch (e) {
    console.error('Failed to update payment status:', e);
    return false;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const client = getAdminClient();
    const { data, error } = await client
      .from('bch_orders')
      .select('*, order_items:bch_order_items(*), payments:bch_payments(*)')
      .eq('id', orderId)
      .single();

    if (error || !data) return null;
    return data as unknown as Order;
  } catch (e) {
    console.error('Failed to load order:', e);
    return null;
  }
}

export async function getDashboardStats() {
  try {
    const client = getAdminClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [allOrders, todayOrders, products, pendingOrders] = await Promise.all([
      client.from('bch_orders').select('total_amount, order_status, payment_status, created_at'),
      client.from('bch_orders').select('*').gte('created_at', today.toISOString()),
      client.from('bch_products').select('stock, is_published'),
      client.from('bch_orders').select('*').eq('order_status', 'pending')
    ]);

    const totalOrders = allOrders.data?.length || 0;
    const totalSales = (allOrders.data as any[])?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
    const totalProducts = products.data?.length || 0;
    const activeProducts = (products.data as any[])?.filter((p) => p.is_published).length || 0;
    const lowStockProducts = (products.data as any[])?.filter((p) => p.stock > 0 && p.stock <= 5).length || 0;
    const pendingCount = pendingOrders.data?.length || 0;
    const todayCount = todayOrders.data?.length || 0;

    return {
      totalOrders,
      todayOrders: todayCount,
      totalProducts,
      activeProducts,
      lowStockProducts,
      pendingOrders: pendingCount,
      totalSales
    };
  } catch (e) {
    console.error('Failed to load dashboard stats:', e);
    return {
      totalOrders: 0,
      todayOrders: 0,
      totalProducts: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      pendingOrders: 0,
      totalSales: 0
    };
  }
}
