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

export async function getExpensePackages() {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { data } = await supabase
    .from('expense_packages')
    .select('*, expense_package_items(*)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function createExpensePackage(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const name = formData.get('name') as string
  if (!name) return

  const { data, error } = await supabase
    .from('expense_packages')
    .insert({ tenant_id: tenantId, name })
    .select()
    .single()

  if (error) console.error('Error creating expense package:', error)
  
  revalidatePath('/dashboard/custos')
  return data
}

export async function updateExpensePackage(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  if (!id || !name) return

  await supabase.from('expense_packages').update({ name }).eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/custos')
}

export async function deleteExpensePackage(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  await supabase.from('expense_packages').delete().eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/custos')
}

export async function addExpenseItem(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const package_id = formData.get('package_id') as string
  const name = formData.get('name') as string
  const cost = parseFloat(formData.get('cost') as string) || 0

  if (!package_id || !name) return

  await supabase.from('expense_package_items').insert({
    tenant_id: tenantId,
    package_id,
    name,
    cost
  })

  const { data: items } = await supabase
    .from('expense_package_items')
    .select('cost')
    .eq('package_id', package_id)
    .eq('tenant_id', tenantId)

  const total = items?.reduce((acc, curr) => acc + Number(curr.cost), 0) || 0
  
  await supabase.from('expense_packages').update({ total_cost: total }).eq('id', package_id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/custos')
}

export async function updateExpenseItem(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const id = formData.get('id') as string
  const package_id = formData.get('package_id') as string
  const name = formData.get('name') as string
  const cost = parseFloat(formData.get('cost') as string) || 0

  if (!id || !name) return

  await supabase.from('expense_package_items').update({ name, cost }).eq('id', id).eq('tenant_id', tenantId)

  const { data: items } = await supabase
    .from('expense_package_items')
    .select('cost')
    .eq('package_id', package_id)
    .eq('tenant_id', tenantId)

  const total = items?.reduce((acc, curr) => acc + Number(curr.cost), 0) || 0
  await supabase.from('expense_packages').update({ total_cost: total }).eq('id', package_id).eq('tenant_id', tenantId)

  revalidatePath('/dashboard/custos')
}

export async function removeExpenseItem(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const id = formData.get('id') as string
  const package_id = formData.get('package_id') as string
  if (!id) return

  await supabase.from('expense_package_items').delete().eq('id', id).eq('tenant_id', tenantId)

  const { data: items } = await supabase
    .from('expense_package_items')
    .select('cost')
    .eq('package_id', package_id)
    .eq('tenant_id', tenantId)

  const total = items?.reduce((acc, curr) => acc + Number(curr.cost), 0) || 0
  await supabase.from('expense_packages').update({ total_cost: total }).eq('id', package_id).eq('tenant_id', tenantId)

  revalidatePath('/dashboard/custos')
}
