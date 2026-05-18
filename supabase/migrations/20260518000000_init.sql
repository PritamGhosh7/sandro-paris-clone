-- Sandro Paris clone — initial schema
-- Apply with: supabase link --project-ref <REF>; supabase db push

create extension if not exists "pgcrypto";

-- ---------- categories ----------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null,
  name        text not null,
  gender      text not null check (gender in ('women','men')),
  parent_slug text,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  unique (slug, gender)
);

-- ---------- products ----------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  sku               text not null unique,
  slug              text not null,
  name              text not null,
  description       text,
  gender            text not null check (gender in ('women','men')),
  category_slug     text not null,
  base_price_paise  bigint not null,
  sale_price_paise  bigint not null,
  currency          text not null default 'INR',
  composition       jsonb not null default '[]'::jsonb,
  care              text[] not null default '{}',
  model_note        text,
  badges            text[] not null default '{}',
  is_sustainable    boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (gender, category_slug);
create index if not exists products_sale_idx on public.products (sale_price_paise) where sale_price_paise < base_price_paise;

-- ---------- product_images ----------
create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  cdn_url     text not null,
  position    int not null default 0,
  alt         text
);

create index if not exists product_images_product_idx on public.product_images (product_id, position);

-- ---------- product_colors ----------
create table if not exists public.product_colors (
  id                 uuid primary key default gen_random_uuid(),
  product_id         uuid not null references public.products(id) on delete cascade,
  name               text not null,
  swatch_hex         text not null,
  primary_image_url  text
);

-- ---------- product_sizes ----------
create table if not exists public.product_sizes (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  label         text not null,
  stock_status  text not null check (stock_status in ('in_stock','limited','out')),
  position      int not null default 0
);

create index if not exists product_sizes_product_idx on public.product_sizes (product_id, position);

-- ---------- homepage_blocks ----------
create table if not exists public.homepage_blocks (
  id        uuid primary key default gen_random_uuid(),
  type      text not null check (type in ('hero','category_card','featured','store')),
  position  int not null default 0,
  payload   jsonb not null
);

-- ---------- vto_sessions ----------
create table if not exists public.vto_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid,
  product_id    uuid references public.products(id) on delete set null,
  product_sku   text,
  input_url     text,
  result_url    text,
  status        text not null default 'pending' check (status in ('pending','ready','failed')),
  provider      text,
  error         text,
  created_at    timestamptz not null default now()
);

create index if not exists vto_sessions_user_idx on public.vto_sessions (user_id, created_at desc);

-- ---------- RLS ----------
alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.product_images   enable row level security;
alter table public.product_colors   enable row level security;
alter table public.product_sizes    enable row level security;
alter table public.homepage_blocks  enable row level security;
alter table public.vto_sessions     enable row level security;

-- Public read for storefront
create policy "public read categories"      on public.categories      for select using (true);
create policy "public read products"        on public.products        for select using (true);
create policy "public read product_images"  on public.product_images  for select using (true);
create policy "public read product_colors"  on public.product_colors  for select using (true);
create policy "public read product_sizes"   on public.product_sizes   for select using (true);
create policy "public read homepage_blocks" on public.homepage_blocks for select using (true);

-- VTO: anyone can insert their own session; owner reads their rows
create policy "anyone insert vto session"   on public.vto_sessions for insert with check (true);
create policy "owner reads vto session"     on public.vto_sessions for select using (
  user_id is null or auth.uid() = user_id
);
