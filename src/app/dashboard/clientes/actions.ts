'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getClients() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('clients').select('*').order('name')
  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }
  return data
}

export async function createClientRecord(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const cpf = formData.get('cpf') as string
  const birth_date = formData.get('birth_date') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string

  if (!name) return

  const supabase = await createClient()
  await supabase.from('clients').insert({
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

export async function deleteClientRecord(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('clients').delete().eq('id', id)
  revalidatePath('/dashboard/clientes')
}
