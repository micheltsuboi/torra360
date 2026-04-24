'use server'

import { createClient } from '@/utils/supabase/server'
import { isAdmin } from '@/utils/auth'
import { revalidatePath } from 'next/cache'

export async function getAllTenants() {
  if (!(await isAdmin())) throw new Error('Não autorizado')
  
  const supabase = await createClient()
  
  // Buscar todos os tenants e contar usuários/vendas
  const { data: tenants, error } = await supabase
    .from('tenants')
    .select(`
      id,
      name,
      created_at,
      users (count),
      sale_transactions (final_amount)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all tenants:', error)
    return []
  }

  // Transformar os dados para um formato mais amigável
  return tenants.map((t: any) => ({
    id: t.id,
    name: t.name,
    created_at: t.created_at,
    userCount: t.users?.[0]?.count || 0,
    totalRevenue: t.sale_transactions?.reduce((acc: number, s: any) => acc + (s.final_amount || 0), 0) || 0
  }))
}

export async function getAllUsers() {
  if (!(await isAdmin())) throw new Error('Não autorizado')
  
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      role,
      created_at,
      tenants (name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all users:', error)
    return []
  }
  return data
}
