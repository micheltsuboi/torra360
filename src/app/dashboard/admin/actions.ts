'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { isAdmin } from '@/utils/auth'
import { revalidatePath } from 'next/cache'

export async function getAllTenants() {
  if (!(await isAdmin())) throw new Error('Não autorizado')
  
  const supabase = createAdminClient()
  
  // Buscar todos os tenants e contar usuários/vendas
  const { data: tenants, error } = await supabase
    .from('tenants')
    .select(`
      id,
      name,
      active,
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
    active: t.active ?? true,
    created_at: t.created_at,
    userCount: t.users?.[0]?.count || 0,
    totalRevenue: t.sale_transactions?.reduce((acc: number, s: any) => acc + (s.final_amount || 0), 0) || 0
  }))
}

export async function createTenant(name: string) {
  if (!(await isAdmin())) throw new Error('Não autorizado')
  
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('tenants')
    .insert([{ name, active: true }])
    .select()

  if (error) throw error
  revalidatePath('/dashboard/admin')
  return data[0]
}

export async function toggleTenantStatus(id: string, active: boolean) {
  if (!(await isAdmin())) throw new Error('Não autorizado')
  
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('tenants')
    .update({ active })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/dashboard/admin')
}

export async function getAllUsers() {
  if (!(await isAdmin())) throw new Error('Não autorizado')
  
  const supabase = createAdminClient()
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
