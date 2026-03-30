'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ====== PRODUTOS ======
export async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').order('name')
  return data || []
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const default_price = parseFloat(formData.get('default_price') as string)

  await supabase.from('products').insert({ name, type, default_price })
  revalidatePath('/dashboard/comercial')
}

// ====== VENDAS ======
export async function getSales() {
  const supabase = await createClient()
  const { data } = await supabase.from('sales').select('*, product:product_id(name)').order('date', { ascending: false })
  return data || []
}

export async function createSale(formData: FormData) {
  const supabase = await createClient()
  const product_id = formData.get('product_id') as string
  const date = formData.get('date') as string
  const client_name = formData.get('client_name') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const unit_price = parseFloat(formData.get('unit_price') as string)

  await supabase.from('sales').insert({ product_id, date, client_name, quantity, unit_price })
  revalidatePath('/dashboard/comercial')
}

// ====== DESPESAS ======
export async function getExpenses() {
  const supabase = await createClient()
  const { data } = await supabase.from('expenses').select('*').order('date', { ascending: false })
  return data || []
}

export async function createExpense(formData: FormData) {
  const supabase = await createClient()
  const category = formData.get('category') as string
  const date = formData.get('date') as string
  const amount = parseFloat(formData.get('amount') as string)
  const notes = formData.get('notes') as string

  await supabase.from('expenses').insert({ category, date, amount, notes })
  revalidatePath('/dashboard/comercial')
}
