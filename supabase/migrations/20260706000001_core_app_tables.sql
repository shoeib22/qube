-- Profiles: single source of truth for role, replaces Firebase custom claims + Firestore users.role split
create table public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  price numeric,
  is_active boolean not null default true,
  image_path text,
  serial_prefix text,
  updated_at timestamptz not null default now()
);

create table public.product_documents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  category text not null check (category in ('manual','installGuide','specSheet','software')),
  title text not null,
  storage_path text not null,
  file_type text,
  file_size bigint,
  uploaded_at timestamptz not null default now()
);

create table public.device_registry (
  id text primary key,
  friendly_name text,
  room text
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  transaction_id text unique,
  user_id uuid references auth.users(id) on delete set null,
  amount numeric,
  items jsonb,
  customer_info jsonb,
  status text not null default 'PENDING' check (status in ('PENDING','SUCCESS','FAILED')),
  payment_method text,
  payment_details jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.panel_configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  panel text not null default 'edge',
  name text,
  material text,
  size text,
  accessory text,
  technology text,
  slots jsonb,
  material_color text,
  frame_color text,
  qty integer,
  order_note text,
  device_id text references public.device_registry(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  saved_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  product text not null default 'general',
  subject text,
  message text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table public.erv_download_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  contact text,
  product text not null default 'ERV',
  created_at timestamptz not null default now()
);

create index on public.product_documents (product_id);
create index on public.orders (user_id);
create index on public.panel_configs (user_id);
create index on public.panel_configs (device_id);
