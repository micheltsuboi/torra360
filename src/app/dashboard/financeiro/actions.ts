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

export async function getFinancialStats() {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)

  // 1. Faturamento (Vendas)
  const { data: sales, error: salesError } = await supabase
    .from('sale_transactions')
    .select('final_amount, date')
    .eq('tenant_id', tenantId)
    .eq('payment_status', 'paid')

  const totalRevenue = sales?.reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0

  // 2. Custo de Produção (Torra)
  // Usamos a view roast_reports_view que já inclui tenant_id
  const { data: roastStats, error: roastError } = await supabase
    .from('roast_reports_view')
    .select('total_torra_cost')
    .eq('tenant_id', tenantId)

  const totalProductionCost = roastStats?.reduce((acc, curr) => acc + (curr.total_torra_cost || 0), 0) || 0

  // 3. Despesas Gerais (Tabela expenses)
  const { data: expenses, error: expError } = await supabase
    .from('expenses')
    .select('amount')
    .eq('tenant_id', tenantId)

  const totalGeneralExpenses = expenses?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0

  // 4. Contas a Receber (Vendas Pendentes)
  const { data: pendingSales } = await supabase
    .from('sale_transactions')
    .select('final_amount')
    .eq('tenant_id', tenantId)
    .eq('payment_status', 'pending')

  const totalPending = pendingSales?.reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0

  // 5. Lucro Real (Considera apenas o que foi recebido)
  const realProfit = totalRevenue - (totalProductionCost + totalGeneralExpenses)

  return {
    revenue: totalRevenue,
    productionCost: totalProductionCost,
    expenses: totalGeneralExpenses,
    profit: realProfit,
    pendingRevenue: totalPending,
    salesCount: sales?.length || 0
  }
}

export async function getRecentTransactions() {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { data: sales } = await supabase
    .from('sale_transactions')
    .select('*, clients(name)')
    .eq('tenant_id', tenantId)
    .order('date', { ascending: false })
    .limit(10)

  return sales || []
}

export async function getExpensesList() {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  
  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('date', { ascending: false })
    .limit(20)

  return expenses || []
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
      date: new Date().toISOString().split('T')[0] // Opcional: atualizar para a data do recebimento?
    })
    .eq('id', saleId)
    .eq('tenant_id', tenantId)

  if (error) throw error
  
  const { revalidatePath } = require('next/cache')
  revalidatePath('/dashboard/financeiro')
  revalidatePath('/dashboard/comercial')
}
