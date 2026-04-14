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
      id,
      date,
      bean_format,
      package_size_g,
      quantity_units,
      initial_quantity,
      retail_price,
      is_blend,
      roast_batch_id,
      expense_package_id,
      created_at,
      roast_batch:roast_batch_id(
        id,
        date, 
        qty_after_kg, 
        green_coffee(name)
      ),
      expense_package:expense_package_id(total_cost),
      materials:packaging_batch_materials(
        material_id,
        quantity_used,
        packaging_inventory(name, unit_cost)
      ),
      blend_composition:packaging_batch_blend_composition(
        roast_batch_id,
        quantity_kg,
        percentage,
        roast_batch:roast_batch_id(
          id,
          green_coffee(name)
        )
      )
    `)

    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching packages:', error)
    return []
  }

  // Buscar custos de torra separadamente para evitar erro de JOIN com View
  const roastIds = new Set<string>()
  data?.forEach(pkg => {
    if (pkg.roast_batch_id) roastIds.add(pkg.roast_batch_id)
    pkg.blend_composition?.forEach((bc: any) => roastIds.add(bc.roast_batch_id))
  })

  const { data: roastCosts } = await supabase
    .from('roast_reports_view')
    .select('roast_batch_id, cost_per_kg_roasted')
    .in('roast_batch_id', Array.from(roastIds))

  // Calcular custos calculados no servidor
  const enrichedData = data?.map(pkg => {
    let coffeeCost = 0
    
    // Usar initial_quantity para cálculos de custo/lucro totais do lote
    const initialQty = pkg.initial_quantity || pkg.quantity_units || 1

    if (!pkg.is_blend) {
      const roastCostKg = roastCosts?.find((rc: any) => rc.roast_batch_id === pkg.roast_batch_id)?.cost_per_kg_roasted || 0
      coffeeCost = (pkg.package_size_g / 1000) * roastCostKg * initialQty
    } else {
      // Custo ponderado do blend (calculado sobre a produção inicial)
      coffeeCost = pkg.blend_composition?.reduce((acc: number, comp: any) => {
        const roastCostKg = roastCosts?.find((rc: any) => rc.roast_batch_id === comp.roast_batch_id)?.cost_per_kg_roasted || 0
        // Para blends, o comp.quantity_kg já é o peso total usado na produção inicial
        return acc + (comp.quantity_kg * roastCostKg)
      }, 0) || 0
    }
    
    const materialsCost = pkg.materials?.reduce((acc: number, m: any) => {
      // m.quantity_used já reflete o total usado na produção inicial
      return acc + (m.quantity_used * (m.packaging_inventory?.unit_cost || 0))
    }, 0) || 0
    
    const extraBatchCost = (pkg.expense_package as any)?.[0]?.total_cost || 0
    const totalProductionCost = coffeeCost + materialsCost + extraBatchCost
    
    return {
      ...pkg,
      calculated_costs: {
        coffee: coffeeCost,
        materials: materialsCost,
        extra: extraBatchCost,
        total: totalProductionCost,
        unit: totalProductionCost / initialQty
      }
    }
  })

  return enrichedData || []
}


export async function createPackages(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const isBlend = formData.get('is_blend') === 'true'
  const roast_batch_id = formData.get('roast_batch_id') as string
  const blendComponentsJson = formData.get('blend_components') as string
  const blendComponents = JSON.parse(blendComponentsJson || '[]')
  
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
  if (!isBlend) {
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
  } else {
    // Validar Blend
    const totalBlendWeight = blendComponents.reduce((acc: number, curr: any) => acc + (curr.qty || 0), 0)
    if (Math.abs(totalBlendWeight - newBatchKg) > 0.01) {
      return { success: false, error: `A soma dos componentes (${totalBlendWeight.toFixed(2)}kg) deve ser igual ao peso total do lote (${newBatchKg.toFixed(2)}kg).` }
    }

    for (const comp of blendComponents) {
      const { data: roast } = await supabase.from('roast_batches').select('qty_after_kg').eq('id', comp.roastId).single()
      if (!roast) return { success: false, error: `Lote torrado ${comp.roastId} não encontrado.` }
      
      const { data: existing } = await supabase.from('packaging_batches').select('package_size_g, quantity_units').eq('roast_batch_id', comp.roastId)
      const { data: existingInBlends } = await supabase.from('packaging_batch_blend_composition').select('quantity_kg').eq('roast_batch_id', comp.roastId)
      
      const packagedKg = (existing?.reduce((acc, curr) => acc + (curr.package_size_g * curr.quantity_units / 1000), 0) || 0) +
                         (existingInBlends?.reduce((acc, curr) => acc + (curr.quantity_kg || 0), 0) || 0)
      
      const available = roast.qty_after_kg - packagedKg
      if (comp.qty > (available + 0.001)) {
        return { success: false, error: `Estoque insuficiente no componente selecionado. Disponível: ${available.toFixed(2)}kg.` }
      }
    }
  }

  // 2. Verificar disponibilidade de INSUMOS
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
  const insertData: any = {
    tenant_id: tenantId,
    date,
    bean_format,
    package_size_g,
    quantity_units,
    initial_quantity: quantity_units,
    retail_price,
    expense_package_id,
    is_blend: isBlend
  }

  if (!isBlend) {
    insertData.roast_batch_id = roast_batch_id
  }

  const { data: newBatch, error } = await supabase.from('packaging_batches').insert(insertData).select().single()

  if (error) {
    console.error('Error packaging:', error)
    return { success: false, error: 'Erro ao registrar o embalamento.' }
  }

  // 4. Se for Blend, registrar composição
  if (isBlend) {
    for (const comp of blendComponents) {
      const percentage = (comp.qty / newBatchKg) * 100
      await supabase.from('packaging_batch_blend_composition').insert({
        tenant_id: tenantId,
        packaging_batch_id: newBatch.id,
        roast_batch_id: comp.roastId,
        quantity_kg: comp.qty,
        percentage: percentage
      })
    }
  }

  // 5. Baixar Estoque de Insumos e Registrar Uso
  for (const mat of materials) {
    if (!mat.materialId) continue
    
    await supabase.from('packaging_batch_materials').insert({
      packaging_batch_id: newBatch.id,
      material_id: mat.materialId,
      quantity_used: mat.quantity,
      tenant_id: tenantId
    })

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
  const initial_quantity = parseInt(formData.get('initial_quantity') as string) || quantity_units
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
      initial_quantity,
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
