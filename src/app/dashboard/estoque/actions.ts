'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getGreenCoffeeLots() {
  const supabase = await createClient()
  
  // Buscamos os lotes e incluímos a soma das quantidades que foram para a torra (qty_before_kg)
  const { data, error } = await supabase
    .from('green_coffee')
    .select('*, roast_batches(qty_before_kg)')
    .order('created_at', { ascending: false })

  if (error) {
     console.error("Error fetching green coffee lots:", error);
     return [];
  }

  // Processamos para ter o total retirado do verde fácil no objeto
  const processed = data?.map((lot: any) => ({
    ...lot,
    total_roasted_qty: lot.roast_batches?.reduce((acc: number, r: any) => acc + (r.qty_before_kg || 0), 0) || 0
  }))

  return processed || []
}

export async function createGreenCoffeeLot(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const total_qty_kg = parseFloat(formData.get('total_qty_kg') as string)
  const total_cost = parseFloat(formData.get('total_cost') as string)
  const provider = formData.get('provider') as string
  const coffee_type = formData.get('coffee_type') as string
  const origin = formData.get('origin') as string
  const quality_level = formData.get('quality_level') as string
  const score = formData.get('score') as string
  const sieve = formData.get('sieve') as string

  const { error } = await supabase.from('green_coffee').insert({
    name,
    total_qty_kg,
    available_qty_kg: total_qty_kg, // Inicialmente igual ao total
    total_cost,
    provider,
    coffee_type,
    origin,
    quality_level,
    score,
    sieve
  })

  if (error) {
    console.error('Error creating lot:', error)
    return
  }

  revalidatePath('/dashboard/estoque')
  revalidatePath('/dashboard/torra')
}

export async function deleteGreenCoffeeLot(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('green_coffee').delete().eq('id', id)
  
  revalidatePath('/dashboard/estoque')
}

export async function createBlend(data: {
  name: string,
  components: { lotId: string, qty: number }[]
}) {
  const supabase = await createClient()

  // 1. Buscar detalhes dos componentes para calcular custo
  const lotIds = data.components.map(c => c.lotId)
  const { data: lots, error: fetchError } = await supabase
    .from('green_coffee')
    .select('id, total_cost, total_qty_kg, available_qty_kg, name')
    .in('id', lotIds)

  if (fetchError || !lots) {
    console.error('Erro ao buscar componentes do blend:', fetchError)
    return { error: 'Erro ao buscar componentes' }
  }

  let totalQty = 0
  let totalCost = 0

  for (const comp of data.components) {
    const lot = lots.find(l => l.id === comp.lotId)
    if (lot) {
      const unitCost = lot.total_cost / lot.total_qty_kg
      totalCost += unitCost * comp.qty
      totalQty += comp.qty
    }
  }

  // 2. Criar o novo lote de Blend
  const { data: newLot, error: insertError } = await supabase
    .from('green_coffee')
    .insert({
      name: data.name,
      total_qty_kg: totalQty,
      available_qty_kg: totalQty,
      total_cost: totalCost,
      quality_level: 'Blend',
      coffee_type: 'Blend',
      origin: 'Várias (Mix)',
      provider: 'Interno (Blend)'
    })
    .select()
    .single()

  if (insertError || !newLot) {
    console.error('Erro ao criar lote de blend:', insertError)
    return { error: 'Erro ao criar lote de blend' }
  }

  // 3. Registrar a composição e dar baixa nos lotes originais
  for (const comp of data.components) {
    const percentage = (comp.qty / totalQty) * 100

    // Registrar composição
    await supabase.from('green_coffee_blend_composition').insert({
      blend_lot_id: newLot.id,
      component_lot_id: comp.lotId,
      quantity_kg: comp.qty,
      percentage: percentage
    })

    // Dar baixa no estoque do componente
    const lot = lots.find(l => l.id === comp.lotId)
    if (lot) {
      const newAvailable = lot.available_qty_kg - comp.qty
      await supabase
        .from('green_coffee')
        .update({ available_qty_kg: newAvailable })
        .eq('id', comp.lotId)
    }
  }

  revalidatePath('/dashboard/estoque')
  revalidatePath('/dashboard/torra')
  return { success: true }
}
