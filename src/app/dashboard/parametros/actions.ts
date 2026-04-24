'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCachedTenantId } from '@/utils/tenant'


export async function getCoffeeTypes() {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  const { data, error } = await supabase
    .from('coffee_types')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name')

  if (error) {
    console.error('Error fetching coffee types:', error)
    return []
  }
  return data
}

export async function createCoffeeType(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  await supabase.from('coffee_types').insert({ tenant_id: tenantId, name })
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function deleteCoffeeType(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  await supabase.from('coffee_types').delete().eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function getQualityLevels() {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  const { data, error } = await supabase
    .from('quality_levels')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name')

  if (error) {
    console.error('Error fetching quality levels:', error)
    return []
  }
  return data
}

export async function createQualityLevel(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  await supabase.from('quality_levels').insert({ tenant_id: tenantId, name })
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function deleteQualityLevel(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  await supabase.from('quality_levels').delete().eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function getProviders() {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name')

  if (error) {
    console.error('Error fetching providers:', error)
    return []
  }
  return data
}

export async function createProvider(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  await supabase.from('providers').insert({ tenant_id: tenantId, name })
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function deleteProvider(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  await supabase.from('providers').delete().eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function getOrigins() {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  const { data, error } = await supabase
    .from('origins')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name')

  if (error) {
    console.error('Error fetching origins:', error)
    return []
  }
  return data
}

export async function createOrigin(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  await supabase.from('origins').insert({ tenant_id: tenantId, name })
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function deleteOrigin(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  await supabase.from('origins').delete().eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}
