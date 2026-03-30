'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRoastBatchesAvailable() {
  const supabase = await createClient()
  // Pega apenas lotes que têm qty_after_kg > 0 (simplificado, ideal é tracking the consumed pkg kg)
  // Como as tabelas básicas estão feitas, faremos a chamada principal.
  const { data } = await supabase
    .from('roast_batches')
    .select('id, date, qty_after_kg, green_coffee(name)')
    .order('date', { ascending: false })
    .limit(30)
  return data || []
}

export async function getPackages() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('packaging_batches')
    .select('*, roast_batch:roast_batch_id(date, qty_after_kg, green_coffee(name))')
    .order('created_at', { ascending: false })
  return data || []
}

export async function createPackages(formData: FormData) {
  const supabase = await createClient()
  
  const roast_batch_id = formData.get('roast_batch_id') as string
  const date = formData.get('date') as string
  
  const bean_format = formData.get('bean_format') as string
  const package_size_g = parseInt(formData.get('package_size_g') as string) || 0
  const quantity_units = parseInt(formData.get('quantity_units') as string) || 0
  const retail_price = parseFloat((formData.get('retail_price') as string).replace('R$ ', '').replace(',', '.')) || 0
  const expense_package_id = formData.get('expense_package_id') as string || null

  const { error } = await supabase.from('packaging_batches').insert({
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

  // Aqui é mock, como o controle de quanto o loge ja foi embalado requer update:
  // Para simplificar, confiaremos no uso de "lookup -> qty_after", assumindo que 
  // um lote de torra foi inteiramente embalado naquele formulário.

  revalidatePath('/dashboard/pacotes')
}

export async function deletePackage(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()
  await supabase.from('packaging_batches').delete().eq('id', id)
  
  revalidatePath('/dashboard/pacotes')
}
