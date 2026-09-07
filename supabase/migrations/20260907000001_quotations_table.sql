-- Admin-only client quotation generator. Not tied to the storefront's
-- orders/checkout flow — used for sales quotes sent to prospective clients
-- before a deal is placed.
create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  status text not null default 'draft',
  issue_date date not null default current_date,
  valid_until date,
  client_name text not null,
  client_company text,
  client_email text,
  client_phone text,
  client_address text,
  items jsonb not null default '[]',
  notes text,
  terms text,
  subtotal numeric(12,2) not null default 0,
  discount_total numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index quotations_created_at_idx on public.quotations (created_at desc);

alter table public.quotations enable row level security;

create policy "quotations_admin_all" on public.quotations for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

grant select, insert, update, delete on public.quotations to anon, authenticated, service_role;
