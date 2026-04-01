'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRoastBatches() {
  const supabase = await createClient()
  
  // Tenta consultar a view primeiro
  const { data: viewData, error: viewError } = await supabase
    .from('roast_reports_view')
    .select('*')
    .order('date', { ascending: false })
    .limit(50)

  if (viewError) {
     console.error('Erro ao acessar view (usando fallback):', viewError)
     // Fallback limpo: traz da tabela base com join
     const { data: tableData } = await supabase
        .from('roast_batches')
        .select(`
          *,
          green_coffee:green_coffee_id (
            name
          )
        `)
        .order('date', { ascending: false })
        .limit(50)
     
     return tableData || []
  }

  // Normaliza o retorno da view para o componente RoastList
  // A View já traz 'green_coffee_name', colocamos no objeto aninhado se necessário
  return (viewData || []).map(item => ({
    ...item,
    id: item.roast_batch_id, // Garante que tenha 'id'
    green_coffee: item.green_coffee_name ? { name: item.green_coffee_name } : null
  }))
}

export async function getAvailableGreenLots() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('green_coffee')
    .select('id, name, available_qty_kg')
    .gt('available_qty_kg', 0)
    .order('name')
  return data || []
}

export async function createRoastBatch(formData: FormData) {
  const supabase = await createClient()
  
  const green_coffee_id = formData.get('green_coffee_id') as string
  const date = formData.get('date') as string
  const qty_before_kg = parseFloat(formData.get('qty_before_kg') as string)
  const qty_after_kg = parseFloat(formData.get('qty_after_kg') as string)
  const operational_cost = parseFloat(formData.get('operational_cost') as string) || 4.00

  // 1. Inserir a Torra
  const { error: insertError } = await supabase.from('roast_batches').insert({
    green_coffee_id,
    date,
    qty_before_kg,
    qty_after_kg,
    operational_cost
  });

  if (insertError) {
    console.error('Error creating roast batch:', insertError)
    return
  }

  // 2. Dar baixa no Café Verde
  // Pegamos o lote atual
  const { data: lot } = await supabase.from('green_coffee').select('available_qty_kg').eq('id', green_coffee_id).single()
  
  if (lot) {
    const newQty = Math.max(0, lot.available_qty_kg - qty_before_kg)
    await supabase.from('green_coffee').update({ available_qty_kg: newQty }).eq('id', green_coffee_id)
  }

  revalidatePath('/dashboard/torra')
  revalidatePath('/dashboard/estoque')
  revalidatePath('/dashboard/pacotes')
}

export async function deleteRoastBatch(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('roast_batches').delete().eq('id', id)
  
  revalidatePath('/dashboard/torra')
  revalidatePath('/dashboard/pacotes')
}
