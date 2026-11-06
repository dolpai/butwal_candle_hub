-- Butwal Candle Hub — Initial Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- PROFILES TABLE
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_categories_slug on public.categories(slug);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10, 2) not null check(price > 0),
  discount_price numeric(10, 2) check(discount_price is null or discount_price > 0),
  category_id uuid references public.categories(id) on delete set null,
  stock integer not null default 0 check(stock >= 0),
  is_featured boolean not null default false,
  is_published boolean not null default false,
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_published on public.products(is_published);
create index if not exists idx_products_featured on public.products(is_featured) where is_featured = true;
create index if not exists idx_products_created on public.products(created_at desc);

-- ============================================
-- ORDERS TABLE
-- ============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  province text not null,
  district text not null,
  municipality text not null,
  ward_number text not null,
  street_address text not null,
  landmark text,
  items_total numeric(10, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  total_amount numeric(10, 2) not null default 0,
  payment_method text not null check(payment_method in ('cod', 'esewa')),
  payment_status text not null default 'unpaid' check(payment_status in ('unpaid', 'paid', 'refunded', 'failed')),
  order_status text not null default 'pending' check(order_status in ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_customer_phone on public.orders(customer_phone);
create index if not exists idx_orders_status on public.orders(order_status);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_created on public.orders(created_at desc);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  quantity integer not null check(quantity > 0),
  unit_price numeric(10, 2) not null check(unit_price >= 0),
  subtotal numeric(10, 2) not null check(subtotal >= 0)
);

create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_product on public.order_items(product_id);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  transaction_uuid text,
  payment_method text not null check(payment_method in ('cod', 'esewa')),
  amount numeric(10, 2) not null default 0,
  status text not null default 'unpaid' check(status in ('unpaid', 'paid', 'refunded', 'failed')),
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_order on public.payments(order_id);
create index if not exists idx_payments_transaction on public.payments(transaction_uuid);
create index if not exists idx_payments_status on public.payments(status);

-- ============================================
-- STORE SETTINGS TABLE
-- ============================================
create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  announcement text,
  delivery_charge numeric(10, 2) not null default 150,
  free_delivery_threshold numeric(10, 2),
  promotional_banner text,
  whatsapp_number text not null default '9766796959',
  phone_numbers text[] not null default '{"9768345387","9847366946"}',
  address_line_1 text not null default 'MFM8+99F, H10, Butwal, Lumbini Province 32907, Nepal',
  address_line_2 text not null default 'Shrawan Path, Butwal, Lumbini Province 32900, Nepal',
  store_name text not null default 'Butwal Candle Hub',
  store_email text,
  updated_at timestamptz not null default now()
);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trigger_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

create trigger trigger_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

create trigger trigger_orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

create trigger trigger_payments_updated_at
  before update on public.payments
  for each row execute function public.handle_updated_at();

create trigger trigger_store_settings_updated_at
  before update on public.store_settings
  for each row execute function public.handle_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, is_admin)
  values (new.id, false)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.store_settings enable row level security;

-- Helper function: check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- PROFILES policies
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- CATEGORIES policies
create policy "Public can read categories"
  on public.categories for select
  using (true);

create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- PRODUCTS policies
create policy "Public can read published products"
  on public.products for select
  using (is_published = true);

create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ORDERS policies — public can insert (checkout), but cannot read via API
create policy "Public can create orders"
  on public.orders for insert
  with check (true);

create policy "Admins can read all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin());

-- ORDER_ITEMS policies
create policy "Public can create order items"
  on public.order_items for insert
  with check (true);

create policy "Admins can read order items"
  on public.order_items for select
  using (public.is_admin());

-- PAYMENTS policies
create policy "Public can create payments"
  on public.payments for insert
  with check (true);

create policy "Admins can read payments"
  on public.payments for select
  using (public.is_admin());

create policy "Admins can update payments"
  on public.payments for update
  using (public.is_admin());

-- STORE_SETTINGS policies
create policy "Public can read store settings"
  on public.store_settings for select
  using (true);

create policy "Admins can update store settings"
  on public.store_settings for update
  using (public.is_admin());

create policy "Admins can insert store settings"
  on public.store_settings for insert
  with check (public.is_admin());

-- ============================================
-- STORAGE BUCKET
-- ============================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies for product images
create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images' and public.is_admin()
  );

create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images' and public.is_admin()
  );

create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images' and public.is_admin()
  );

create policy "Public can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- ============================================
-- INSERT DEFAULT STORE SETTINGS
-- ============================================
insert into public.store_settings (
  announcement,
  delivery_charge,
  free_delivery_threshold,
  promotional_banner,
  whatsapp_number,
  phone_numbers,
  address_line_1,
  address_line_2,
  store_name,
  store_email
) values (
  'Free delivery across Nepal on orders above Rs. 2000!',
  150,
  2000,
  'Light Up Your Tihar With Beautiful Candles',
  '9766796959',
  '{"9768345387","9847366946"}',
  'MFM8+99F, H10, Butwal, Lumbini Province 32907, Nepal',
  'Shrawan Path, Butwal, Lumbini Province 32900, Nepal',
  'Butwal Candle Hub',
  null
) on conflict do nothing;

-- ============================================
-- INSERT DEFAULT CATEGORIES
-- ============================================
insert into public.categories (name, slug, description) values
  ('Decorative Candles', 'decorative-candles', 'Beautiful decorative candles for home decoration'),
  ('Festival Candles', 'festival-candles', 'Special candles for festivals and celebrations'),
  ('Tihar Products', 'tihar-products', 'Traditional Tihar and Diwali items'),
  ('Candle Gift Boxes', 'candle-gift-boxes', 'Beautifully packaged candle gift sets'),
  ('Handmade Candles', 'handmade-candles', 'Handcrafted candles made with care')
on conflict (slug) do nothing;
