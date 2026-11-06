-- Enable manual QR payments while retaining COD. The uploaded QR is a static image;
-- no gateway credentials or API integration are used.
alter table public.bch_orders drop constraint if exists bch_orders_payment_method_check;
alter table public.bch_orders add constraint bch_orders_payment_method_check
  check (payment_method in ('cod', 'qr', 'esewa'));

alter table public.bch_payments drop constraint if exists bch_payments_payment_method_check;
alter table public.bch_payments add constraint bch_payments_payment_method_check
  check (payment_method in ('cod', 'qr', 'esewa'));
