-- Migration: Adicionar status ativo/inativo para tenants
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Garantir que todos os existentes comecem como ativos
UPDATE public.tenants SET active = true WHERE active IS NULL;
