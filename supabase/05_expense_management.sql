-- Migration: Gestão de Pacotes de Despesas e Custos Operacionais

-- Tabela de Pacotes de Despesas
create table if not exists public.expense_packages (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  name text not null,
  total_cost numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Itens individuais dentro de um pacote (ex: "Saco", "Gás")
create table if not exists public.expense_package_items (
  id uuid default uuid_generate_v4() primary key,
  package_id uuid references public.expense_packages(id) on delete cascade not null,
  name text not null,
  cost numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Vincular o pacote de despesas ao lote de embalamento/produto
alter table public.packaging_batches add column if not exists expense_package_id uuid references public.expense_packages(id);

alter table public.expense_packages enable row level security;
alter table public.expense_package_items enable row level security;

create policy "Expense Packages All" on public.expense_packages for all using (tenant_id = public.get_tenant_id());
create policy "Expense Package Items All" on public.expense_package_items for all using (
  package_id in (select id from public.expense_packages where tenant_id = public.get_tenant_id())
);
