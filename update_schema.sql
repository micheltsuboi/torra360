create table if not exists public.coffee_types (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.coffee_types enable row level security;
create policy "CoffeeTypes All" on public.coffee_types for all using (tenant_id = public.get_tenant_id());

create table if not exists public.quality_levels (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.quality_levels enable row level security;
create policy "QualityLevels All" on public.quality_levels for all using (tenant_id = public.get_tenant_id());
