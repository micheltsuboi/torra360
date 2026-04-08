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
  
  const { data } = await supabase
    .from('packaging_batches')
    .select('*, roast_batch:roast_batch_id(date, qty_after_kg, green_coffee(name))')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
  return data || []
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

  const { error } = await supabase.from('packaging_batches').insert({
    tenant_id: tenantId,
    roast_batch_id,
    date,
    bean_format,
    package_size_g,
    quantity_units,
    retail_price,
    expense_package_id
  })

  if (error) {
    console.error('Error packaging:', error)
    return
  }

  revalidatePath('/dashboard/pacotes')
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
    return
  }

  revalidatePath('/dashboard/pacotes')
}
