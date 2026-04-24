import { getFinancialStats, getRecentTransactions, getExpensesList, getPendingSales } from './actions'
import FinanceChart from './FinanceChart'
import FinanceDashboardClient from './FinanceDashboardClient'
import { formatDate } from '@/utils/date-utils'
import { Calendar } from 'lucide-react'

import { Suspense } from 'react'
import { GlobalSkeleton } from '@/components/ui/Skeletons'

// 1. Componente Assíncrono para paralelizar respostas do Banco de Dados no Back-End (Streaming Múltiplo).
async function FinanceDataFetcher({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  const stats = await getFinancialStats(startDate, endDate)
  const recentSales = await getRecentTransactions(startDate, endDate)
  const recentExpenses = await getExpensesList(startDate, endDate)
  const pendingSales = await getPendingSales()

  return (
    <>
      {/* Stats, Modais e Listagens de Vendas/Despesas Recentes */}
      <FinanceDashboardClient 
        stats={stats} 
        pendingSales={pendingSales} 
        expensesList={recentExpenses}
        recentSales={recentSales}
        recentExpenses={recentExpenses}
      />

      {/* Gráfico Visual */}
      <FinanceChart stats={stats} />
    </>
  )
}

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>
}) {
  const { startDate, endDate } = await searchParams

  return (
    <div className="flex flex-col gap-8 text-[--foreground] pb-10">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/5 pb-6 gap-4">
        <div>
           <h1 className="text-3xl font-serif text-[--foreground]">Controle Financeiro</h1>
           <p className="text-[--secondary-text] mt-1 text-sm opacity-60">Visão geral das finanças da Torra 360</p>
        </div>

        {/* Filtros de Data */}
        <form className="flex flex-wrap items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/5" method="GET">
           <div className="flex flex-col">
              <span className="text-[9px] capitalize tracking-widest text-[--secondary-text] ml-1 mb-1 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 text-[--primary]" /> Início
              </span>
              <input 
                type="date" 
                name="startDate" 
                defaultValue={startDate}
                className="bg-black/40 border border-white/10 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[--primary]/50 transition-all font-sans"
              />
           </div>
           <div className="flex flex-col">
              <span className="text-[9px] capitalize tracking-widest text-[--secondary-text] ml-1 mb-1 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 text-[--primary]" /> Fim
              </span>
              <input 
                type="date" 
                name="endDate" 
                defaultValue={endDate}
                className="bg-black/40 border border-white/10 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[--primary]/50 transition-all font-sans"
              />
           </div>
           <button 
             type="submit"
             className="mt-4 md:mt-0 px-4 py-2 bg-[--primary]/10 hover:bg-[--primary]/20 border border-[--primary]/20 rounded-lg text-xs text-[--primary] font-bold transition-all"
           >
             Filtrar Período
           </button>
           {(startDate || endDate) && (
             <a 
               href="/dashboard/financeiro"
               className="text-[10px] text-[--secondary-text] hover:text-[--danger] transition-all underline underline-offset-4"
             >
               Limpar
             </a>
           )}
        </form>

        <div className="flex gap-4">
           <button className="bg-black/40 px-4 py-2 rounded-lg border border-white/5 text-[--secondary-text] text-[10px] capitalize tracking-widest font-bold hover:bg-black/60 transition-all">Exportar PDF</button>
        </div>
      </div>

      <Suspense fallback={<GlobalSkeleton />}>
        <FinanceDataFetcher startDate={startDate} endDate={endDate} />
      </Suspense>
    </div>
  )
}
