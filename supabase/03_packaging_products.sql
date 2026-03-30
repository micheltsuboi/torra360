-- Migration: Refatorar Embalamento para Unificação com Produto Final
alter table public.packaging_batches drop column if exists qty_1kg cascade;
alter table public.packaging_batches drop column if exists qty_500g cascade;
alter table public.packaging_batches drop column if exists qty_250g cascade;

alter table public.packaging_batches add column if not exists package_size_g integer default 0;   -- Tamanho do pacote em gramas (250, 500, 1000)
alter table public.packaging_batches add column if not exists bean_format text;                  -- 'Grãos' ou 'Moído'
alter table public.packaging_batches add column if not exists retail_price numeric default 0;    -- Preço de venda unitário
alter table public.packaging_batches add column if not exists quantity_units integer default 0;  -- Quantos pacotes gerados
