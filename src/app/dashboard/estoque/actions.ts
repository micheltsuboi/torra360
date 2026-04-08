'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function getTenantId(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  
  const { data: profile } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single()
    
  if (!profile) throw new Error('Perfil não encontrado')
  return profile.tenant_id
}

export async function getGreenCoffeeLots() {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { data, error } = await supabase
    .from('green_coffee')
    .select('*, roast_batches(qty_before_kg)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) {
     console.error("Error fetching green coffee lots:", error);
     return [];
  }

  const processed = data?.map((lot: any) => ({
    ...lot,
    total_roasted_qty: lot.roast_batches?.reduce((acc: number, r: any) => acc + (r.qty_before_kg || 0), 0) || 0
  }))

  return processed || []
}

export async function createGreenCoffeeLot(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
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
    tenant_id: tenantId,
    name,
    total_qty_kg,
    available_qty_kg: total_qty_kg,
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

export async function updateGreenCoffeeLot(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const total_qty_kg = parseFloat(formData.get('total_qty_kg') as string)
  const total_cost = parseFloat(formData.get('total_cost') as string)
  const provider = formData.get('provider') as string
  const coffee_type = formData.get('coffee_type') as string
  const origin = formData.get('origin') as string
  const quality_level = formData.get('quality_level') as string
  const score = formData.get('score') as string
  const sieve = formData.get('sieve') as string

  // Buscar dados atuais para ajustar saldo se a quantidade total mudar
  const { data: current } = await supabase
    .from('green_coffee')
    .select('total_qty_kg, available_qty_kg')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .single()

  if (!current) return

  let newAvailable = current.available_qty_kg
  if (total_qty_kg !== current.total_qty_kg) {
    const diff = total_qty_kg - current.total_qty_kg
    newAvailable = Math.max(0, current.available_qty_kg + diff)
  }

  const { error } = await supabase
    .from('green_coffee')
    .update({
      name,
      total_qty_kg,
      available_qty_kg: newAvailable,
      total_cost,
      provider,
      coffee_type,
      origin,
      quality_level,
      score,
      sieve
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)

  if (error) {
    console.error('Error updating lot:', error)
    return
  }

  revalidatePath('/dashboard/estoque')
  revalidatePath('/dashboard/torra')
}

export async function deleteGreenCoffeeLot(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  // Verificar se há torras vinculadas para evitar erro brusco de FK
  const { count } = await supabase
    .from('roast_batches')
    .select('*', { count: 'exact', head: true })
    .eq('green_coffee_id', id)

  if (count && count > 0) {
    // Aqui poderíamos retornar um erro, mas por enquanto vamos logar
    console.warn('Lote possui torras vinculadas. Exclua as torras primeiro.')
    // return { error: 'Lote possui torras vinculadas' }
  }

  await supabase
    .from('green_coffee')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)
  
  revalidatePath('/dashboard/estoque')
}

export async function createBlend(data: {
  name: string,
  components: { lotId: string, qty: number }[]
}) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const lotIds = data.components.map(c => c.lotId)
  const { data: lots, error: fetchError } = await supabase
    .from('green_coffee')
    .select('id, total_cost, total_qty_kg, available_qty_kg, name')
    .in('id', lotIds)
    .eq('tenant_id', tenantId)

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

  const { data: newLot, error: insertError } = await supabase
    .from('green_coffee')
    .insert({
      tenant_id: tenantId,
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

  for (const comp of data.components) {
    const percentage = (comp.qty / totalQty) * 100

    await supabase.from('green_coffee_blend_composition').insert({
      tenant_id: tenantId,
      blend_lot_id: newLot.id,
      component_lot_id: comp.lotId,
      quantity_kg: comp.qty,
      percentage: percentage
    })

    const lot = lots.find(l => l.id === comp.lotId)
    if (lot) {
      const newAvailable = lot.available_qty_kg - comp.qty
      await supabase
        .from('green_coffee')
        .update({ available_qty_kg: newAvailable })
        .eq('id', comp.lotId)
        .eq('tenant_id', tenantId)
    }
  }

  revalidatePath('/dashboard/estoque')
  revalidatePath('/dashboard/torra')
  return { success: true }
}
