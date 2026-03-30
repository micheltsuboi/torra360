-- Habilita extensão p/ UUIDs
create extension if not exists "uuid-ossp";

-- 1. Tabela: tenants
create table if not exists public.tenants (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela: users (relacionado à auth.users)
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  tenant_id uuid references public.tenants not null,
  name text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.tenants enable row level security;
alter table public.users enable row level security;

-- Criar trigger para criar tenant e usuário automaticamente ao fazer signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_tenant_id uuid;
begin
  -- Cria um novo tenant com o email do usuario
  insert into public.tenants (name) values (new.email) returning id into new_tenant_id;
  -- Cria o usuario amarrado ao tenant
  insert into public.users (id, tenant_id, name)
  values (new.id, new_tenant_id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

-- Associar trigger à tabela auth.users do Supabase
-- IMPORTANTE: execute esse trigger se for a primeira vez
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Função auxiliar para pegar o tenant
create or replace function public.get_tenant_id()
returns uuid as $$
  select tenant_id from public.users where id = auth.uid() limit 1;
$$ language sql security definer;

-- Políticas base: Usuários só enxergam dados de seu próprio tenant
create policy "Tenants Select" on public.tenants for select using (id = public.get_tenant_id());
create policy "Users Select" on public.users for select using (tenant_id = public.get_tenant_id());


-- 3. Tabela: green_coffee
create table if not exists public.green_coffee (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  name text not null,
  total_qty_kg numeric not null default 0,
  total_cost numeric not null default 0,
  available_qty_kg numeric not null default 0,
  provider text,
  coffee_type text,
  bean_type text,
  origin text,
  quality_level text,
  score text,
  certification text,
  harvest_date text,
  purchase_date date,
  sieve text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.green_coffee enable row level security;
create policy "GreenCoffee All" on public.green_coffee for all using (tenant_id = public.get_tenant_id());

-- 4. Tabela: roast_batches
create table if not exists public.roast_batches (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  green_coffee_id uuid references public.green_coffee not null,
  date date default CURRENT_DATE,
  qty_before_kg numeric not null,
  qty_after_kg numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.roast_batches enable row level security;
create policy "RoastBatches All" on public.roast_batches for all using (tenant_id = public.get_tenant_id());

-- 5. Tabela: packaging_batches
create table if not exists public.packaging_batches (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  roast_batch_id uuid references public.roast_batches not null,
  date date default CURRENT_DATE,
  qty_1kg integer not null default 0,
  qty_500g integer not null default 0,
  qty_250g integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.packaging_batches enable row level security;
create policy "Packaging All" on public.packaging_batches for all using (tenant_id = public.get_tenant_id());

-- 6. Tabela: products
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  name text not null,
  type text not null, -- 'Grão' ou 'Moído'
  default_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;
create policy "Products All" on public.products for all using (tenant_id = public.get_tenant_id());

-- Populando alguns produtos base (usando trigger se necessário, mas eles podem criar manualmente)

-- 7. Tabela: sales
create table if not exists public.sales (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  product_id uuid references public.products not null,
  date date default CURRENT_DATE,
  client_name text,
  quantity integer not null,
  unit_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.sales enable row level security;
create policy "Sales All" on public.sales for all using (tenant_id = public.get_tenant_id());

-- 8. Tabela: expenses
create table if not exists public.expenses (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  date date default CURRENT_DATE,
  category text,
  amount numeric not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;
create policy "Expenses All" on public.expenses for all using (tenant_id = public.get_tenant_id());

-- View: roast_reports_view (Ajuda nas fórmulas de Dashboard)
create or replace view public.roast_reports_view as
select 
  r.id as roast_batch_id,
  r.tenant_id,
  r.date,
  r.qty_before_kg,
  r.qty_after_kg,
  case when r.qty_before_kg > 0 then (r.qty_after_kg / r.qty_before_kg) * 100 else 0 end as yield_percentage,
  case when gc.total_qty_kg > 0 then gc.total_cost / gc.total_qty_kg else 0 end as raw_cost_per_kg,
  r.qty_before_kg * (case when gc.total_qty_kg > 0 then gc.total_cost / gc.total_qty_kg else 0 end) as coffee_cost,
  r.qty_after_kg * 4 as operational_cost,
  (r.qty_before_kg * (case when gc.total_qty_kg > 0 then gc.total_cost / gc.total_qty_kg else 0 end)) + (r.qty_after_kg * 4) as total_torra_cost
from public.roast_batches r
join public.green_coffee gc on r.green_coffee_id = gc.id;
