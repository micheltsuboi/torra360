'use server'

import { createClient } from '@/utils/supabase/server'

async function getTenantId(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  
  const { data: profile } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single()
    
  if (!profile) throw new Error('Perfil não encontrado')
  return profile.tenant_id
}

export async function getFinancialStats(startDate?: string, endDate?: string) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  // 1. Faturamento (Vendas)
  let salesQuery = supabase
    .from('sale_transactions')
    .select('final_amount, date')
    .eq('tenant_id', tenantId)
    .or('payment_status.eq.paid,payment_status.is.null')

  if (startDate) salesQuery = salesQuery.gte('date', startDate)
  if (endDate) salesQuery = salesQuery.lte('date', endDate)

  const { data: sales } = await salesQuery
  const totalRevenue = sales?.reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0

  // 2. Custo de Produção (Torra)
  let roastQuery = supabase
    .from('roast_reports_view')
    .select('total_torra_cost, date')
    .eq('tenant_id', tenantId)

  if (startDate) roastQuery = roastQuery.gte('date', startDate)
  if (endDate) roastQuery = roastQuery.lte('date', endDate)

  const { data: roastStats } = await roastQuery
  const totalProductionCost = roastStats?.reduce((acc, curr) => acc + (curr.total_torra_cost || 0), 0) || 0

  // 3. Despesas Gerais (Tabela expenses)
  let expQuery = supabase
    .from('expenses')
    .select('amount, date')
    .eq('tenant_id', tenantId)

  if (startDate) expQuery = expQuery.gte('date', startDate)
  if (endDate) expQuery = expQuery.lte('date', endDate)

  const { data: expenses } = await expQuery
  const totalGeneralExpenses = expenses?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0

  // 4. Contas a Receber (Vendas Pendentes) - Geralmente não filtra por data de criação para mostrar o saldo REAL atual
  const { data: pendingSales } = await supabase
    .from('sale_transactions')
    .select('final_amount')
    .eq('tenant_id', tenantId)
    .eq('payment_status', 'pending')

  const totalPending = pendingSales?.reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0

  // 5. Lucro Real
  const realProfit = totalRevenue - (totalProductionCost + totalGeneralExpenses)

  // 6. Variação (Mês atual vs anterior) - Mantemos a lógica fixa de meses para o badge de tendência
  const now = new Date()
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  
  const currentMonthRevenue = sales?.filter(s => s.date >= firstDayCurrentMonth)
    .reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0
    
  const lastMonthRevenue = sales?.filter(s => s.date >= firstDayLastMonth && s.date < firstDayCurrentMonth)
    .reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0
    
  let revenueChange = 0
  if (lastMonthRevenue > 0) {
    revenueChange = parseFloat(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1))
  } else if (currentMonthRevenue > 0) {
    revenueChange = 100
  }

  return {
    revenue: totalRevenue,
    productionCost: totalProductionCost,
    expenses: totalGeneralExpenses,
    profit: realProfit,
    pendingRevenue: totalPending,
    salesCount: sales?.length || 0,
    revenueChange
  }
}

export async function getRecentTransactions(startDate?: string, endDate?: string) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  let query = supabase
    .from('sale_transactions')
    .select('*, clients(name)')
    .eq('tenant_id', tenantId)
    .order('date', { ascending: false })

  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)
  if (!startDate && !endDate) query = query.limit(10)

  const { data: sales } = await query
  return sales || []
}

export async function getExpensesList(startDate?: string, endDate?: string) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  let query = supabase
    .from('expenses')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('date', { ascending: false })

  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)
  if (!startDate && !endDate) query = query.limit(20)

  const { data: expenses } = await query
  return expenses || []
}

export async function createExpense(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const notes = formData.get('notes') as string

  const { error } = await supabase
    .from('expenses')
    .insert({
      tenant_id: tenantId,
      amount,
      date,
      category,
      description,
      notes
    })

  if (error) throw error
  
  const { revalidatePath } = require('next/cache')
  revalidatePath('/dashboard/financeiro')
  revalidatePath('/dashboard/custos')
}

export async function updateExpense(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const id = formData.get('id') as string
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const notes = formData.get('notes') as string

  const { error } = await supabase
    .from('expenses')
    .update({
      amount,
      date,
      category,
      description,
      notes
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)

  if (error) throw error
  
  const { revalidatePath } = require('next/cache')
  revalidatePath('/dashboard/financeiro')
  revalidatePath('/dashboard/custos')
}

export async function deleteExpense(id: string) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)

  if (error) throw error
  
  const { revalidatePath } = require('next/cache')
  revalidatePath('/dashboard/financeiro')
}

export async function getPendingSales() {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { data: pendingSales } = await supabase
    .from('sale_transactions')
    .select('*, clients(name)')
    .eq('tenant_id', tenantId)
    .eq('payment_status', 'pending')
    .order('date', { ascending: false })

  return pendingSales || []
}

export async function markSaleAsPaid(saleId: string, finalPaymentMethod: string) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { error } = await supabase
    .from('sale_transactions')
    .update({ 
      payment_status: 'paid',
      payment_method: finalPaymentMethod,
      payment_date: new Date().toISOString()
    })
    .eq('id', saleId)
    .eq('tenant_id', tenantId)

  if (error) throw error
  
  const { revalidatePath } = require('next/cache')
  revalidatePath('/dashboard/financeiro')
  revalidatePath('/dashboard/comercial')
}

export async function createIncome(formData: FormData) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  const date = formData.get('date') as string
  const method = formData.get('payment_method') as string
  const amountStr = formData.get('amount') as string
  const amount = parseFloat(amountStr) || 0
  
  if (amount <= 0) return

  const { error } = await supabase
    .from('sale_transactions')
    .insert({
      tenant_id: tenantId,
      final_amount: amount,
      total_amount: amount,
      discount_amount: 0,
      payment_method: method,
      payment_status: 'paid',
      date: date
    })

  if (error) throw error
  
  const { revalidatePath } = require('next/cache')
  revalidatePath('/dashboard/financeiro')
  revalidatePath('/dashboard/comercial')
}
