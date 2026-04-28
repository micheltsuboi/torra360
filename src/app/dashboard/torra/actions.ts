'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCachedTenantId } from '@/utils/tenant'


export async function getRoastBatches() {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  // Tenta consultar a view primeiro
  const { data: viewData, error: viewError } = await supabase
    .from('roast_reports_view')
    .select('*')
    .eq('tenant_id', tenantId)
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
        .eq('tenant_id', tenantId)
        .order('date', { ascending: false })
        .limit(50)
     
     return tableData || []
  }

  // Normaliza o retorno da view para o componente RoastList
  return (viewData || []).map(item => ({
    ...item,
    id: item.roast_batch_id, // Garante que tenha 'id'
    green_coffee: item.green_coffee_name ? { name: item.green_coffee_name } : null
  }))
}

export async function getAvailableGreenLots() {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  const { data } = await supabase
    .from('green_coffee')
    .select('id, name, available_qty_kg')
    .eq('tenant_id', tenantId)
    .gt('available_qty_kg', 0)
    .order('name')
  return data || []
}

export async function createRoastBatch(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  const green_coffee_id = formData.get('green_coffee_id') as string
  const date = formData.get('date') as string
  const qty_before_kg = parseFloat(formData.get('qty_before_kg') as string)
  const qty_after_kg = parseFloat(formData.get('qty_after_kg') as string)
  const operational_cost = parseFloat(formData.get('operational_cost') as string) || 4.00

  // 1. Validar estoque de café verde disponível
  const { data: lot } = await supabase
    .from('green_coffee')
    .select('name, available_qty_kg')
    .eq('id', green_coffee_id)
    .eq('tenant_id', tenantId)
    .single()

  if (!lot || lot.available_qty_kg < qty_before_kg) {
    return { 
      success: false, 
      error: `Estoque insuficiente de ${lot?.name || 'café verde'}. Disponível: ${lot?.available_qty_kg || 0}kg.` 
    }
  }

  // 2. Inserir a Torra
  const { error: insertError } = await supabase.from('roast_batches').insert({
    tenant_id: tenantId,
    green_coffee_id,
    date,
    qty_before_kg,
    qty_after_kg,
    operational_cost,
    roast_parameters: JSON.parse(formData.get('roast_parameters') as string || '[]')
  });

  if (insertError) {
    console.error('Error creating roast batch:', insertError)
    return { success: false, error: 'Erro ao salvar o lote de torra.' }
  }

  // 3. Dar baixa no Café Verde
  const newQty = lot.available_qty_kg - qty_before_kg
  await supabase
    .from('green_coffee')
    .update({ available_qty_kg: newQty })
    .eq('id', green_coffee_id)
    .eq('tenant_id', tenantId)

  revalidatePath('/dashboard/torra')
  revalidatePath('/dashboard/estoque')
  revalidatePath('/dashboard/pacotes')
  
  return { success: true }
}

export async function updateRoastBatch(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  const id = formData.get('id') as string
  const green_coffee_id = formData.get('green_coffee_id') as string
  const date = formData.get('date') as string
  const qty_before_kg = parseFloat(formData.get('qty_before_kg') as string)
  const qty_after_kg = parseFloat(formData.get('qty_after_kg') as string)
  const operational_cost = parseFloat(formData.get('operational_cost') as string) || 4.00

  // 1. Buscar a torra atual para calcular a diferença de estoque
  const { data: currentBatch } = await supabase
    .from('roast_batches')
    .select('qty_before_kg, green_coffee_id')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .single()

  if (!currentBatch) return { success: false, error: 'Lote de torra não encontrado.' }

  // 2. Validar estoque antes de atualizar
  if (currentBatch.green_coffee_id === green_coffee_id) {
    const diff = qty_before_kg - currentBatch.qty_before_kg
    const { data: lot } = await supabase
      .from('green_coffee')
      .select('name, available_qty_kg')
      .eq('id', green_coffee_id)
      .eq('tenant_id', tenantId)
      .single()

    if (lot && diff > lot.available_qty_kg) {
      return { 
        success: false, 
        error: `Estoque insuficiente de ${lot.name}. Necessário: ${diff}kg adicionais, Disponível: ${lot.available_qty_kg}kg.` 
      }
    }
  } else {
    // Caso tenha mudado o lote de origem, validar o saldo no novo lote
    const { data: newLot } = await supabase
      .from('green_coffee')
      .select('name, available_qty_kg')
      .eq('id', green_coffee_id)
      .eq('tenant_id', tenantId)
      .single()

    if (newLot && qty_before_kg > newLot.available_qty_kg) {
      return { 
        success: false, 
        error: `Estoque insuficiente de ${newLot.name}. Necessário: ${qty_before_kg}kg, Disponível: ${newLot.available_qty_kg}kg.` 
      }
    }
  }

  // 3. Atualizar a torra
  const { error: updateError } = await supabase
    .from('roast_batches')
    .update({
      green_coffee_id,
      date,
      qty_before_kg,
      qty_after_kg,
      operational_cost,
      roast_parameters: JSON.parse(formData.get('roast_parameters') as string || '[]')
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)

  if (updateError) {
    console.error('Error updating roast batch:', updateError)
    return { success: false, error: 'Erro ao atualizar o lote de torra.' }
  }

  // 4. Ajustar o estoque de Café Verde
  if (currentBatch.green_coffee_id === green_coffee_id) {
    const diff = qty_before_kg - currentBatch.qty_before_kg
    const { data: lot } = await supabase
      .from('green_coffee')
      .select('available_qty_kg')
      .eq('id', green_coffee_id)
      .eq('tenant_id', tenantId)
      .single()

    if (lot) {
      const newQty = Math.max(0, lot.available_qty_kg - diff)
      await supabase
        .from('green_coffee')
        .update({ available_qty_kg: newQty })
        .eq('id', green_coffee_id)
        .eq('tenant_id', tenantId)
    }
  } else {
    // Mudou de lote!
    // Devolve para o lote antigo
    const { data: oldLot } = await supabase
      .from('green_coffee')
      .select('available_qty_kg')
      .eq('id', currentBatch.green_coffee_id)
      .eq('tenant_id', tenantId)
      .single()
    if (oldLot) {
      await supabase
        .from('green_coffee')
        .update({ available_qty_kg: oldLot.available_qty_kg + currentBatch.qty_before_kg })
        .eq('id', currentBatch.green_coffee_id)
        .eq('tenant_id', tenantId)
    }
    // Retira do novo lote
    const { data: newLot } = await supabase
      .from('green_coffee')
      .select('available_qty_kg')
      .eq('id', green_coffee_id)
      .eq('tenant_id', tenantId)
      .single()
    if (newLot) {
      await supabase
        .from('green_coffee')
        .update({ available_qty_kg: Math.max(0, newLot.available_qty_kg - qty_before_kg) })
        .eq('id', green_coffee_id)
        .eq('tenant_id', tenantId)
    }
  }

  revalidatePath('/dashboard/torra')
  revalidatePath('/dashboard/estoque')
  
  return { success: true }
}

export async function deleteRoastBatch(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()

  // 1. Buscar detalhes antes de excluir para devolver ao estoque
  const { data: batch } = await supabase
    .from('roast_batches')
    .select('qty_before_kg, green_coffee_id')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .single()

  if (batch) {
    const { data: lot } = await supabase
      .from('green_coffee')
      .select('available_qty_kg')
      .eq('id', batch.green_coffee_id)
      .eq('tenant_id', tenantId)
      .single()
    
    if (lot) {
      await supabase
        .from('green_coffee')
        .update({ available_qty_kg: lot.available_qty_kg + batch.qty_before_kg })
        .eq('id', batch.green_coffee_id)
        .eq('tenant_id', tenantId)
    }
  }

  await supabase.from('roast_batches').delete().eq('id', id).eq('tenant_id', tenantId)
  
  revalidatePath('/dashboard/torra')
  revalidatePath('/dashboard/estoque')
  revalidatePath('/dashboard/pacotes')
}

export async function saveRoastParameters(roastId: string, text: string, paramId?: string) {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()

  if (!roastId) return { success: false, error: 'ID da torra não informado.' }

  const { data: roast, error: fetchError } = await supabase
    .from('roast_batches')
    .select('roast_parameters')
    .eq('id', roastId)
    .eq('tenant_id', tenantId)
    .single()

  if (fetchError || !roast) {
    return { success: false, error: 'Torra não encontrada.' }
  }

  let existingParams = Array.isArray(roast.roast_parameters) ? roast.roast_parameters : []

  if (paramId) {
    existingParams = existingParams.map((p: any) => 
      p.id === paramId ? { ...p, content: text } : p
    )
  } else {
    const nextId = existingParams.length > 0 
      ? (Math.max(...existingParams.map((p: any) => parseInt(p.id) || 0)) + 1).toString() 
      : '1'
    existingParams.push({ id: nextId, title: 'Registro de Torra', content: text })
  }

  const { error } = await supabase
    .from('roast_batches')
    .update({
      roast_parameters: existingParams
    })
    .eq('id', roastId)
    .eq('tenant_id', tenantId)

  if (error) {
    console.error('Error saving roast parameters:', error)
    return { success: false, error: 'Erro ao salvar parâmetros de torra.' }
  }

  revalidatePath('/dashboard/torra')
  return { success: true }
}

export async function deleteRoastParameters(roastId: string, paramId: string) {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()

  if (!roastId || !paramId) return { success: false, error: 'Dados incompletos.' }

  const { data: roast, error: fetchError } = await supabase
    .from('roast_batches')
    .select('roast_parameters')
    .eq('id', roastId)
    .eq('tenant_id', tenantId)
    .single()

  if (fetchError || !roast) {
    return { success: false, error: 'Torra não encontrada.' }
  }

  const existingParams = Array.isArray(roast.roast_parameters) ? roast.roast_parameters : []
  const updatedParams = existingParams.filter((p: any) => p.id !== paramId)

  const { error } = await supabase
    .from('roast_batches')
    .update({
      roast_parameters: updatedParams
    })
    .eq('id', roastId)
    .eq('tenant_id', tenantId)

  if (error) {
    console.error('Error deleting roast parameters:', error)
    return { success: false, error: 'Erro ao excluir parâmetro de torra.' }
  }

  revalidatePath('/dashboard/torra')
  return { success: true }
}
