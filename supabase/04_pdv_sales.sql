-- Migration: Modulo PDV
create table if not exists public.sale_transactions (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  client_id uuid references public.clients(id),
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  total_amount numeric not null,
  discount_amount numeric default 0,
  final_amount numeric not null,
  payment_method text not null, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.sale_items (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  sale_id uuid references public.sale_transactions(id) on delete cascade not null,
  packaging_batch_id uuid references public.packaging_batches(id) not null,
  quantity integer not null,
  unit_price numeric not null,
  total_price numeric not null
);

alter table public.sale_transactions enable row level security;
alter table public.sale_items enable row level security;

create policy "PDV Sales All" on public.sale_transactions for all using (tenant_id = public.get_tenant_id());
create policy "PDV Items All" on public.sale_items for all using (tenant_id = public.get_tenant_id());
