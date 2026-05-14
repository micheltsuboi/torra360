-- Permitir que roast_batch_id seja nulo (necessário para blends de empacotamento)
ALTER TABLE public.packaging_batches ALTER COLUMN roast_batch_id DROP NOT NULL;

-- Adicionar is_blend se não existir
ALTER TABLE public.packaging_batches ADD COLUMN IF NOT EXISTS is_blend boolean DEFAULT false;

-- Tabela para composição de blend no empacotamento (se não existir)
CREATE TABLE IF NOT EXISTS public.packaging_batch_blend_composition (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants NOT NULL DEFAULT public.get_tenant_id(),
  packaging_batch_id uuid REFERENCES public.packaging_batches(id) ON DELETE CASCADE NOT NULL,
  roast_batch_id uuid REFERENCES public.roast_batches(id) ON DELETE CASCADE NOT NULL,
  quantity_kg numeric NOT NULL,
  percentage numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.packaging_batch_blend_composition ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'PackagingBatchBlendComposition All') THEN
    CREATE POLICY "PackagingBatchBlendComposition All" ON public.packaging_batch_blend_composition FOR ALL USING (tenant_id = public.get_tenant_id());
  END IF;
END $$;

-- Tabela para insumos usados no empacotamento (se não existir)
CREATE TABLE IF NOT EXISTS public.packaging_batch_materials (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants NOT NULL DEFAULT public.get_tenant_id(),
  packaging_batch_id uuid REFERENCES public.packaging_batches(id) ON DELETE CASCADE NOT NULL,
  material_id uuid REFERENCES public.packaging_inventory(id) ON DELETE CASCADE NOT NULL,
  quantity_used integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.packaging_batch_materials ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'PackagingBatchMaterials All') THEN
    CREATE POLICY "PackagingBatchMaterials All" ON public.packaging_batch_materials FOR ALL USING (tenant_id = public.get_tenant_id());
  END IF;
END $$;
