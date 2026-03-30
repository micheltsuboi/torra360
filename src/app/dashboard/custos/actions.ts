'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getExpensePackages() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('expense_packages')
    .select('*, expense_package_items(*)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function createExpensePackage(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expense_packages')
    .insert({ name })
    .select()
    .single()

  if (error) console.error('Error creating expense package:', error)
  
  revalidatePath('/dashboard/custos')
  return data
}

export async function updateExpensePackage(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  if (!id || !name) return

  const supabase = await createClient()
  await supabase.from('expense_packages').update({ name }).eq('id', id)
  revalidatePath('/dashboard/custos')
}

export async function deleteExpensePackage(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('expense_packages').delete().eq('id', id)
  
  revalidatePath('/dashboard/custos')
}

export async function addExpenseItem(formData: FormData) {
  const package_id = formData.get('package_id') as string
  const name = formData.get('name') as string
  const cost = parseFloat(formData.get('cost') as string) || 0

  if (!package_id || !name) return

  const supabase = await createClient()
  
  // Inserir item
  await supabase.from('expense_package_items').insert({
    package_id,
    name,
    cost
  })

  // Recalcular total do pacote
  const { data: items } = await supabase.from('expense_package_items').select('cost').eq('package_id', package_id)
  const total = items?.reduce((acc, curr) => acc + Number(curr.cost), 0) || 0
  
  await supabase.from('expense_packages').update({ total_cost: total }).eq('id', package_id)

  revalidatePath('/dashboard/custos')
}

export async function removeExpenseItem(formData: FormData) {
  const id = formData.get('id') as string
  const package_id = formData.get('package_id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('expense_package_items').delete().eq('id', id)

  // Recalcular total
  const { data: items } = await supabase.from('expense_package_items').select('cost').eq('package_id', package_id)
  const total = items?.reduce((acc, curr) => acc + Number(curr.cost), 0) || 0
  
  await supabase.from('expense_packages').update({ total_cost: total }).eq('id', package_id)

  revalidatePath('/dashboard/custos')
}
