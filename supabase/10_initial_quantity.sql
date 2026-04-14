-- Migration: Adicionar Quantidade Inicial para Cálculo de Lucratividade
-- Esta coluna permite manter o registro de quanto foi produzido originalmente,
-- enquanto a 'quantity_units' passa a ser tratada apenas como estoque disponível.

ALTER TABLE public.packaging_batches ADD COLUMN IF NOT EXISTS initial_quantity INTEGER;

-- Sincronizar dados existentes: definimos a quantidade inicial como a quantidade atual
-- para que os lotes já criados não fiquem com valor total zerado.
UPDATE public.packaging_batches SET initial_quantity = quantity_units WHERE initial_quantity IS NULL;

-- Tornar obrigatório para novos registros (opcional, mas recomendado)
-- ALTER TABLE public.packaging_batches ALTER COLUMN initial_quantity SET NOT NULL;
-- ALTER TABLE public.packaging_batches ALTER COLUMN initial_quantity SET DEFAULT 0;
