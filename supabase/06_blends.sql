-- 11. Tabela: green_coffee_blend_composition
create table if not exists public.green_coffee_blend_composition (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  blend_lot_id uuid references public.green_coffee(id) on delete cascade not null,
  component_lot_id uuid references public.green_coffee(id) on delete cascade not null,
  quantity_kg numeric not null,
  percentage numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.green_coffee_blend_composition enable row level security;
create policy "GreenCoffeeBlendComposition All" on public.green_coffee_blend_composition for all using (tenant_id = public.get_tenant_id());
