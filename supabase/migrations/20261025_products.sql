-- TrustDrop: products let a business group reviews by what they actually sell.
-- Run this once in the Supabase SQL Editor.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (business_id, slug)
);

create index if not exists products_business_idx on public.products (business_id);

-- Reviews can point at the product they are about. Reviews without a product stay valid.
alter table public.testimonials
  add column if not exists product_id uuid references public.products(id) on delete set null;

create index if not exists testimonials_product_idx on public.testimonials (product_id);

alter table public.products enable row level security;

drop policy if exists "owners manage own products" on public.products;
create policy "owners manage own products"
  on public.products
  for all
  using (auth.uid() = business_id)
  with check (auth.uid() = business_id);

drop policy if exists "anyone can read products" on public.products;
create policy "anyone can read products"
  on public.products
  for select
  using (true);

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
