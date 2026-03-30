'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCoffeeTypes() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('coffee_types').select('*').order('name')
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
  await supabase.from('coffee_types').insert({ name })
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function deleteCoffeeType(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('coffee_types').delete().eq('id', id)
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function getQualityLevels() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('quality_levels').select('*').order('name')
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
  await supabase.from('quality_levels').insert({ name })
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}

export async function deleteQualityLevel(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('quality_levels').delete().eq('id', id)
  revalidatePath('/dashboard/parametros')
  revalidatePath('/dashboard/estoque')
}
