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

export async function getPackagingInventory() {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { data } = await supabase
    .from('packaging_inventory')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name', { ascending: true })
    
  return data || []
}

export async function addPackagingLot(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const name = formData.get('name') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const total_cost = parseFloat(formData.get('total_cost') as string)
  const unit_cost = total_cost / quantity

  // 1. Adicionar ao estoque de embalagens
  const { data: existing } = await supabase
    .from('packaging_inventory')
    .select('id, quantity_available, unit_cost')
    .eq('tenant_id', tenantId)
    .eq('name', name)
    .single()

  if (existing) {
    // Atualiza média ponderada ou apenas soma? O usuário pediu "Lotes", 
    // mas para simplificar o estoque atual, vamos somar e atualizar o custo unitário mais recente.
    const newQty = existing.quantity_available + quantity
    const { error } = await supabase
      .from('packaging_inventory')
      .update({
        quantity_available: newQty,
        unit_cost: unit_cost // custo do lote atual
      })
      .eq('id', existing.id)
      
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('packaging_inventory')
      .insert({
        tenant_id: tenantId,
        name,
        quantity_available: quantity,
        unit_cost
      })
      
    if (error) throw error
  }

  // 2. Integração Financeira: Adicionar como Despesa
  const { error: expenseError } = await supabase
    .from('expenses')
    .insert({
      tenant_id: tenantId,
      description: name,
      notes: `${quantity} un`,
      amount: total_cost,
      category: 'Embalagens',
      date: new Date().toISOString().split('T')[0]
    })

  if (expenseError) {
    console.error('Erro ao registrar despesa:', expenseError)
    // Não barramos o processo se a despesa falhar, mas logamos
  }

  revalidatePath('/dashboard/embalagens')
  revalidatePath('/dashboard/financeiro')
  return { success: true }
}

export async function updateInventoryItem(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const quantity = parseInt(formData.get('quantity_available') as string)
  const unit_cost = parseFloat(formData.get('unit_cost') as string)

  const { error } = await supabase
    .from('packaging_inventory')
    .update({
      name,
      quantity_available: quantity,
      unit_cost
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)

  if (error) throw error
  revalidatePath('/dashboard/embalagens')
  return { success: true }
}

export async function deleteInventoryItem(id: string) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { error } = await supabase
    .from('packaging_inventory')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)
    
  if (error) throw error
  revalidatePath('/dashboard/embalagens')
}
