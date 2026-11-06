export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          discount_price?: number | null;
          category_id?: string | null;
          stock: number;
          is_featured?: boolean;
          is_published?: boolean;
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          discount_price?: number | null;
          category_id?: string | null;
          stock?: number;
          is_featured?: boolean;
          is_published?: boolean;
          images?: string[];
          updated_at?: string;
        };
      };
      orders: {
        Row: {
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
          payment_method: 'cod' | 'esewa';
          payment_status: 'unpaid' | 'paid' | 'refunded' | 'failed';
          order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          province: string;
          district: string;
          municipality: string;
          ward_number: string;
          street_address: string;
          landmark?: string | null;
          items_total: number;
          delivery_fee: number;
          total_amount: number;
          payment_method: 'cod' | 'esewa';
          payment_status?: 'unpaid' | 'paid' | 'refunded' | 'failed';
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          customer_name?: string;
          customer_phone?: string;
          province?: string;
          district?: string;
          municipality?: string;
          ward_number?: string;
          street_address?: string;
          landmark?: string | null;
          items_total?: number;
          delivery_fee?: number;
          total_amount?: number;
          payment_method?: 'cod' | 'esewa';
          payment_status?: 'unpaid' | 'paid' | 'refunded' | 'failed';
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
          notes?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string | null;
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string | null;
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
        Update: {
          product_name?: string;
          product_image?: string | null;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          transaction_uuid: string | null;
          payment_method: 'cod' | 'esewa';
          amount: number;
          status: 'unpaid' | 'paid' | 'refunded' | 'failed';
          raw_response: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          transaction_uuid?: string | null;
          payment_method: 'cod' | 'esewa';
          amount: number;
          status?: 'unpaid' | 'paid' | 'refabased' | 'failed';
          raw_response?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          transaction_uuid?: string | null;
          status?: 'unpaid' | 'paid' | 'refunded' | 'failed';
          raw_response?: Record<string, unknown> | null;
          updated_at?: string;
        };
      };
      store_settings: {
        Row: {
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
        };
        Insert: {
          id?: string;
          announcement?: string | null;
          delivery_charge: number;
          free_delivery_threshold?: number | null;
          promotional_banner?: string | null;
          whatsapp_number?: string;
          phone_numbers?: string[];
          address_line_1?: string;
          address_line_2?: string;
          store_name?: string;
          store_email?: string | null;
          updated_at?: string;
        };
        Update: {
          announcement?: string | null;
          delivery_charge?: number;
          free_delivery_threshold?: number | null;
          promotional_banner?: string | null;
          whatsapp_number?: string;
          phone_numbers?: string[];
          address_line_1?: string;
          address_line_2?: string;
          store_name?: string;
          store_email?: string | null;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          is_admin?: boolean;
        };
      };
    };
    Functions: {
      create_order: {
        Args: {
          p_customer_name: string;
          p_customer_phone: string;
          p_province: string;
          p_district: string;
          p_municipality: string;
          p_ward_number: string;
          p_street_address: string;
          p_landmark: string | null;
          p_payment_method: string;
          p_items: { product_id: string; quantity: number }[];
          p_delivery_fee: number;
          p_notes: string | null;
        };
        Returns: { order_id: string; order_number: string };
      };
    };
  };
}
