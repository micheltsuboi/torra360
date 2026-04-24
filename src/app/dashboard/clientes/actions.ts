'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCachedTenantId } from '@/utils/tenant'


export async function getClients() {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()
  
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name')

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }
  return data
}

export async function createClientRecord(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const cpf = formData.get('cpf') as string
  const birth_date = formData.get('birth_date') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string

  if (!name) return

  await supabase.from('clients').insert({
    tenant_id: tenantId,
    name,
    phone,
    cpf,
    birth_date: birth_date ? birth_date : null,
    address,
    city,
    state
  })
  
  revalidatePath('/dashboard/clientes')
  return { success: true }
}

export async function updateClientRecord(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getCachedTenantId()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const cpf = formData.get('cpf') as string
  const birth_date = formData.get('birth_date') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string

  await supabase.from('clients').update({
    name,
    phone,
    cpf,
    birth_date: birth_date ? birth_date : null,
    address,
    city,
    state
  }).eq('id', id).eq('tenant_id', tenantId)
  
  revalidatePath('/dashboard/clientes')
  return { success: true }
}

export async function deleteClientRecord(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  const tenantId = await getCachedTenantId()

  await supabase.from('clients').delete().eq('id', id).eq('tenant_id', tenantId)
  revalidatePath('/dashboard/clientes')
}
