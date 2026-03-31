'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRoastBatches() {
  const supabase = await createClient()
  
  // Consultamos a View consolidada que já possui todos os cálculos e o nome do café
  const { data, error } = await supabase
    .from('roast_reports_view')
    .select('*')
    .order('date', { ascending: false })
    .limit(50)

  if (error) {
     console.error('Erro ao acessar view de torra:', error)
     // Fallback para tabela base se a view falhar
     const fallback = await supabase
        .from('roast_batches')
        .select('*, green_coffee(name)')
        .order('date', { ascending: false })
        .limit(50)
     return fallback.data || []
  }
  return data || []
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
