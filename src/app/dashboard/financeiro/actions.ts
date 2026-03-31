'use server'

import { createClient } from '@/utils/supabase/server'

export async function getFinancialStats() {
  const supabase = await createClient()

  // 1. Faturamento (Vendas)
  const { data: sales, error: salesError } = await supabase
    .from('sale_transactions')
    .select('final_amount, date')

  const totalRevenue = sales?.reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0

  // 2. Custo de Produção (Torra)
  // Usamos a view roast_reports_view que já calcula o custo total por lote
  const { data: roastStats, error: roastError } = await supabase
    .from('roast_reports_view')
    .select('total_torra_cost')

  const totalProductionCost = roastStats?.reduce((acc, curr) => acc + (curr.total_torra_cost || 0), 0) || 0

  // 3. Despesas Gerais (Tabela expenses)
  const { data: expenses, error: expError } = await supabase
    .from('expenses')
    .select('amount')

  const totalGeneralExpenses = expenses?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0

  // 4. Lucro Real
  const realProfit = totalRevenue - (totalProductionCost + totalGeneralExpenses)

  return {
    revenue: totalRevenue,
    productionCost: totalProductionCost,
    expenses: totalGeneralExpenses,
    profit: realProfit,
    salesCount: sales?.length || 0
  }
}

export async function getRecentTransactions() {
  const supabase = await createClient()
  
  const { data: sales } = await supabase
    .from('sale_transactions')
    .select('*, clients(name)')
    .order('date', { ascending: false })
    .limit(10)

  return sales || []
}

export async function getExpensesList() {
  const supabase = await createClient()
  
  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })
    .limit(20)

  return expenses || []
}
