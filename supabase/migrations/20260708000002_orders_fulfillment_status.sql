-- Fulfillment tracking is separate from payment status: `status` reflects the
-- PhonePe transaction outcome (PENDING/SUCCESS/FAILED) while `fulfillment_status`
-- is admin-controlled shipping progress for the Order Management dashboard.
alter table public.orders
  add column fulfillment_status text not null default 'Processing'
    check (fulfillment_status in ('Processing', 'Shipped', 'Delivered'));
