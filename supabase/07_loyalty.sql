-- 1. Tabela: loyalty_settings (Configurações de Cashback)
create table if not exists public.loyalty_settings (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  cashback_percentage numeric not null default 5, -- Default 5%
  is_active boolean default true,
  apply_to_all boolean default true, -- Se aplica a todos os produtos ou específicos
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tenant_id)
);

alter table public.loyalty_settings enable row level security;
create policy "LoyaltySettings All" on public.loyalty_settings for all using (tenant_id = public.get_tenant_id());

-- 2. Tabela: loyalty_transactions (Histórico de Cashback)
create table if not exists public.loyalty_transactions (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants not null default public.get_tenant_id(),
  client_id uuid references public.clients not null,
  sale_id uuid references public.sales, -- Opcional, link para a venda
  amount numeric not null, -- Valor do cashback (positivo para ganho, negativo para resgate)
  transaction_type text not null, -- 'EARNED', 'REDEEMED'
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.loyalty_transactions enable row level security;
create policy "LoyaltyTransactions All" on public.loyalty_transactions for all using (tenant_id = public.get_tenant_id());

-- Inserir default settings para todos os tenants
insert into public.loyalty_settings (tenant_id, cashback_percentage)
select id, 5 from public.tenants
on conflict (tenant_id) do nothing;
