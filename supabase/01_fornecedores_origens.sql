-- 1. Tabela: providers (Fornecedores)
create table if not exists public.providers (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.providers enable row level security;
create policy "Providers All" on public.providers for all using (tenant_id = public.get_tenant_id());

-- 2. Tabela: origins (Origens)
create table if not exists public.origins (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.origins enable row level security;
create policy "Origins All" on public.origins for all using (tenant_id = public.get_tenant_id());
