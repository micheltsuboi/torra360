'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getGreenCoffeeLots() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('green_coffee')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
     console.error("Error fetching green coffee lots:", error);
     return [];
  }
  return data
}

export async function createGreenCoffeeLot(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const total_qty_kg = parseFloat(formData.get('total_qty_kg') as string)
  const total_cost = parseFloat(formData.get('total_cost') as string)
  const provider = formData.get('provider') as string
  const coffee_type = formData.get('coffee_type') as string
  const origin = formData.get('origin') as string
  const quality_level = formData.get('quality_level') as string
  const score = formData.get('score') as string
  const sieve = formData.get('sieve') as string

  const { error } = await supabase.from('green_coffee').insert({
    name,
    total_qty_kg,
    available_qty_kg: total_qty_kg, // Inicialmente igual ao total
    total_cost,
    provider,
    coffee_type,
    origin,
    quality_level,
    score,
    sieve
  })

  if (error) {
    console.error('Error creating lot:', error)
    return
  }

  revalidatePath('/dashboard/estoque')
}

export async function deleteGreenCoffeeLot(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('green_coffee').delete().eq('id', id)
  
  revalidatePath('/dashboard/estoque')
}
