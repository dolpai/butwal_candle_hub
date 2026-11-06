-- Enable manual QR payments while retaining COD. The uploaded QR is a static image;
-- no gateway credentials or API integration are used.
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders add constraint orders_payment_method_check
  check (payment_method in ('cod', 'qr', 'esewa'));

alter table public.payments drop constraint if exists payments_payment_method_check;
alter table public.payments add constraint payments_payment_method_check
  check (payment_method in ('cod', 'qr', 'esewa'));
