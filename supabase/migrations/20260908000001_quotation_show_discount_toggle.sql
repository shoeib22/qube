-- Lets an admin hide the discount % column/line from the customer-facing
-- document (QuoteDocument, used by both the admin detail page and the
-- public /quote/[id] link) while still applying it internally — the
-- displayed subtotal folds the discount in instead of showing it broken
-- out, so the numbers still add up cleanly for the customer.
alter table public.quotations add column show_discount boolean not null default true;
