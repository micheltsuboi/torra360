-- 1. Tabela: clients (Clientes)
create table if not exists public.clients (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  name text not null,
  phone text,
  cpf text,
  birth_date date,
  address text,
  city text,
  state text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.clients enable row level security;
create policy "Clients All" on public.clients for all using (tenant_id = public.get_tenant_id());
