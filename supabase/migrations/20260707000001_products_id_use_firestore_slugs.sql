-- Firestore used human-readable slug IDs for products (e.g. "36w-2x2-panel-light"),
-- not UUIDs. Preserve them exactly during migration for stable URLs and
-- continuity with the existing catalog.
alter table public.product_documents drop constraint product_documents_product_id_fkey;
alter table public.products alter column id drop default;
alter table public.products alter column id type text;
alter table public.product_documents alter column product_id type text;
alter table public.product_documents add constraint product_documents_product_id_fkey
  foreign key (product_id) references public.products(id) on delete cascade;
