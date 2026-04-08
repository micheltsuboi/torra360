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

export async function getRoastBatchesAvailable() {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { data, error } = await supabase
    .from('roast_batches')
    .select('id, date, qty_after_kg, green_coffee(name)')
    .eq('tenant_id', tenantId)
    .order('date', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching roast batches for packaging:', error)
    return []
  }

  return data || []
}

export async function getPackages() {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { data, error } = await supabase
    .from('packaging_batches')
    .select(`
      *,
      roast_batch:roast_batch_id(
        date, 
        qty_after_kg, 
        green_coffee(name)
      ),
      expense_package:expense_package_id(total_cost),
      materials:packaging_batch_materials(
        material_id,
        quantity_used,
        packaging_inventory(name, unit_cost)
      )
    `)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching packages:', error)
    return []
  }

  // Buscar custos de torra separadamente para evitar erro de JOIN com View
  const roastIds = Array.from(new Set(data?.map(p => p.roast_batch_id) || []))
  const { data: roastCosts } = await supabase
    .from('roast_reports_view')
    .select('roast_batch_id, cost_per_kg_roasted')
    .in('roast_batch_id', roastIds)

  // Calcular custos calculados no servidor
  const enrichedData = data?.map(pkg => {
    const roastCostKg = roastCosts?.find((rc: any) => rc.roast_batch_id === pkg.roast_batch_id)?.cost_per_kg_roasted || 0
    const coffeeCost = (pkg.package_size_g / 1000) * roastCostKg * pkg.quantity_units
    
    const materialsCost = pkg.materials?.reduce((acc: number, m: any) => {
      return acc + (m.quantity_used * (m.packaging_inventory?.unit_cost || 0))
    }, 0) || 0
    
    const extraBatchCost = pkg.expense_package?.total_cost || 0
    const totalProductionCost = coffeeCost + materialsCost + extraBatchCost
    
    return {
      ...pkg,
      calculated_costs: {
        coffee: coffeeCost,
        materials: materialsCost,
        extra: extraBatchCost,
        total: totalProductionCost,
        unit: totalProductionCost / (pkg.quantity_units || 1)
      }
    }
  })

  return enrichedData || []
}

export async function createPackages(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const roast_batch_id = formData.get('roast_batch_id') as string
  const date = formData.get('date') as string
  const bean_format = formData.get('bean_format') as string
  const package_size_g = parseInt(formData.get('package_size_g') as string) || 0
  const quantity_units = parseInt(formData.get('quantity_units') as string) || 0
  const retail_price = parseFloat((formData.get('retail_price') as string).replace('R$ ', '').replace(',', '.')) || 0
  const expense_package_id = formData.get('expense_package_id') as string || null
  const materialsJson = formData.get('materials') as string
  const materials = JSON.parse(materialsJson || '[]')

  const newBatchKg = (package_size_g * quantity_units) / 1000

  // 1. Verificar disponibilidade na torra
  const { data: roast } = await supabase
    .from('roast_batches')
    .select('qty_after_kg')
    .eq('id', roast_batch_id)
    .single()

  if (!roast) return { success: false, error: 'Lote de torra não encontrado.' }

  const { data: existingPackages } = await supabase
    .from('packaging_batches')
    .select('package_size_g, quantity_units')
    .eq('roast_batch_id', roast_batch_id)

  const alreadyPackagedKg = existingPackages?.reduce((acc, curr) => acc + (curr.package_size_g * curr.quantity_units / 1000), 0) || 0
  const availableKg = roast.qty_after_kg - alreadyPackagedKg

  if (newBatchKg > (availableKg + 0.001)) { 
    return { 
      success: false, 
      error: `Quantidade insuficiente no lote torrado. Disponível: ${availableKg.toFixed(2)}kg.` 
    }
  }

  // 2. Verificar disponibilidade de INSUMOS (Embalagens)
  for (const mat of materials) {
    if (!mat.materialId) continue
    const { data: inventoryItem } = await supabase
      .from('packaging_inventory')
      .select('name, quantity_available')
      .eq('id', mat.materialId)
      .single()

    if (!inventoryItem || inventoryItem.quantity_available < mat.quantity) {
      return { 
        success: false, 
        error: `Estoque insuficiente de: ${inventoryItem?.name || 'Insumo Desconhecido'}. Necessário: ${mat.quantity}, Disponível: ${inventoryItem?.quantity_available || 0}`
      }
    }
  }

  // 3. Inserir o Lote de Embalamento
  const { data: newBatch, error } = await supabase.from('packaging_batches').insert({
    tenant_id: tenantId,
    roast_batch_id,
    date,
    bean_format,
    package_size_g,
    quantity_units,
    retail_price,
    expense_package_id
  }).select().single()

  if (error) {
    console.error('Error packaging:', error)
    return { success: false, error: 'Erro ao registrar o embalamento.' }
  }

  // 4. Baixar Estoque de Insumos e Registrar Uso
  for (const mat of materials) {
    if (!mat.materialId) continue
    
    // Registrar Uso Histórico
    await supabase.from('packaging_batch_materials').insert({
      packaging_batch_id: newBatch.id,
      material_id: mat.materialId,
      quantity_used: mat.quantity,
      tenant_id: tenantId
    })

    // Baixa de Estoque
    const { data: current } = await supabase
      .from('packaging_inventory')
      .select('quantity_available')
      .eq('id', mat.materialId)
      .single()
      
    await supabase.from('packaging_inventory').update({ 
      quantity_available: (current?.quantity_available || 0) - mat.quantity 
    }).eq('id', mat.materialId)
  }

  revalidatePath('/dashboard/pacotes')
  revalidatePath('/dashboard/embalagens')
  return { success: true }
}

export async function deletePackage(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  await supabase.from('packaging_batches').delete().eq('id', id).eq('tenant_id', tenantId)
  
  revalidatePath('/dashboard/pacotes')
}

export async function updatePackage(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const id = formData.get('id') as string
  const date = formData.get('date') as string
  const bean_format = formData.get('bean_format') as string
  const package_size_g = parseInt(formData.get('package_size_g') as string) || 0
  const quantity_units = parseInt(formData.get('quantity_units') as string) || 0
  const retail_price = parseFloat((formData.get('retail_price') as string).replace('R$ ', '').replace(',', '.')) || 0
  const expense_package_id = formData.get('expense_package_id') as string || null
  const materialsJson = formData.get('materials') as string
  const materials = JSON.parse(materialsJson || '[]')

  const newTotalKg = (package_size_g * quantity_units) / 1000

  // 1. Buscar embalamento atual e materiais atuais
  const { data: currentPackage } = await supabase
    .from('packaging_batches')
    .select('roast_batch_id')
    .eq('id', id)
    .single()

  if (!currentPackage) return { success: false, error: 'Embalamento não encontrado.' }

  const { data: currentMaterials } = await supabase
    .from('packaging_batch_materials')
    .select('material_id, quantity_used')
    .eq('packaging_batch_id', id)

  // 2. Verificar disponibilidade na torra (excluindo o peso atual deste registro)
  const { data: roast } = await supabase
    .from('roast_batches')
    .select('qty_after_kg')
    .eq('id', currentPackage.roast_batch_id)
    .single()

  const { data: otherPackages } = await supabase
    .from('packaging_batches')
    .select('package_size_g, quantity_units')
    .eq('roast_batch_id', currentPackage.roast_batch_id)
    .neq('id', id)

  const sumOthersKg = otherPackages?.reduce((acc: number, curr: any) => acc + (curr.package_size_g * curr.quantity_units / 1000), 0) || 0
  const availableKg = (roast?.qty_after_kg || 0) - sumOthersKg

  if (newTotalKg > (availableKg + 0.001)) {
    return { 
      success: false, 
      error: `Quantidade insuficiente na torra. Disponível para este ajuste: ${availableKg.toFixed(2)}kg.` 
    }
  }

  // 3. Reconciliação de Materiais (Insumos)
  // Devolver estoque antigo
  if (currentMaterials) {
    for (const mat of currentMaterials) {
      const { data: inv } = await supabase.from('packaging_inventory').select('quantity_available').eq('id', mat.material_id).single()
      await supabase.from('packaging_inventory').update({ 
        quantity_available: (inv?.quantity_available || 0) + mat.quantity_used 
      }).eq('id', mat.material_id)
    }
  }

  // Verificar se novo estoque é suficiente
  for (const mat of materials) {
    if (!mat.materialId) continue
    const { data: inventoryItem } = await supabase.from('packaging_inventory').select('name, quantity_available').eq('id', mat.materialId).single()
    if (!inventoryItem || inventoryItem.quantity_available < mat.quantity) {
      return { success: false, error: `Estoque insuficiente de: ${inventoryItem?.name}. Necessário: ${mat.quantity}` }
    }
  }

  // 4. Atualizar o Lote
  const { error } = await supabase
    .from('packaging_batches')
    .update({
      date,
      bean_format,
      package_size_g,
      quantity_units,
      retail_price,
      expense_package_id
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)

  if (error) {
    console.error('Error updating package:', error)
    return { success: false, error: 'Erro ao atualizar o embalamento.' }
  }

  // 5. Atualizar Materiais Vinculados
  await supabase.from('packaging_batch_materials').delete().eq('packaging_batch_id', id)
  for (const mat of materials) {
    if (!mat.materialId) continue
    
    // Registrar Uso
    await supabase.from('packaging_batch_materials').insert({
      packaging_batch_id: id,
      material_id: mat.materialId,
      quantity_used: mat.quantity,
      tenant_id: tenantId
    })

    // Baixa de Estoque
    const { data: current } = await supabase.from('packaging_inventory').select('quantity_available').eq('id', mat.materialId).single()
    await supabase.from('packaging_inventory').update({ 
      quantity_available: (current?.quantity_available || 0) - mat.quantity 
    }).eq('id', mat.materialId)
  }

  revalidatePath('/dashboard/pacotes')
  revalidatePath('/dashboard/embalagens')
  return { success: true }
}
