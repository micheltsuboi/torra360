-- Adicionar coluna de custo operacional configurável por lote de torra
ALTER TABLE public.roast_batches 
ADD COLUMN IF NOT EXISTS operational_cost numeric DEFAULT 4.00;

-- Atualizar view de relatórios de torra para considerar o novo campo preenchível
CREATE OR REPLACE VIEW public.roast_reports_view AS
SELECT 
    r.id AS roast_batch_id,
    r.tenant_id,
    r.date,
    r.qty_before_kg,
    r.qty_after_kg,
    r.green_coffee_id,
    r.operational_cost AS operational_cost_per_kg,
    gc.name AS green_coffee_name,
    gc.total_cost AS batch_raw_cost,
    gc.total_qty_kg AS batch_raw_qty,
    -- Custo do café verde utilizado na torra
    (r.qty_before_kg * (CASE WHEN gc.total_qty_kg > 0 THEN gc.total_cost / gc.total_qty_kg ELSE 0 END)) AS raw_coffee_cost,
    -- Custo operacional total (baseado no peso final torrado)
    (r.qty_after_kg * r.operational_cost) AS total_operational_cost,
    -- Custo total desta torra (Verde + Operacional)
    (r.qty_before_kg * (CASE WHEN gc.total_qty_kg > 0 THEN gc.total_cost / gc.total_qty_kg ELSE 0 END)) + (r.qty_after_kg * r.operational_cost) AS total_roast_cost,
    -- Custo por kg de café torrado produzido
    ((r.qty_before_kg * (CASE WHEN gc.total_qty_kg > 0 THEN gc.total_cost / gc.total_qty_kg ELSE 0 END)) + (r.qty_after_kg * r.operational_cost)) / NULLIF(r.qty_after_kg, 0) AS cost_per_kg_roasted,
    -- Porcentagem de rendimento
    (r.qty_after_kg / NULLIF(r.qty_before_kg, 0)) * 100 AS yield_percentage
FROM 
    public.roast_batches r
LEFT JOIN 
    public.green_coffee gc ON r.green_coffee_id = gc.id;
