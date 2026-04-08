'use client'

import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Banknote, 
  Hourglass, 
  Plus
} from 'lucide-react'

interface Stats {
  revenue: number
  productionCost: number
  expenses: number
  profit: number
  pendingRevenue: number
  salesCount: number
  revenueChange: number
}

interface FinanceStatsProps {
  stats: Stats
  onOpenPending: () => void
  onNewExpense: () => void
}

export default function FinanceStats({ stats, onOpenPending, onNewExpense }: FinanceStatsProps) {
  // Garantir valores padrão para evitar quebra no toLocaleString
  const revenue = stats?.revenue ?? 0
  const productionCost = stats?.productionCost ?? 0
  const expenses = stats?.expenses ?? 0
  const totalExpenses = productionCost + expenses
  const profit = stats?.profit ?? 0
  const pendingRevenue = stats?.pendingRevenue ?? 0
  const variation = stats?.revenueChange ?? 0
  
  const isPositiveProfit = profit >= 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full text-[--foreground]">
      
      {/* 1. Faturamento */}
      <div className="glass-panel relative overflow-hidden group min-h-[140px] flex flex-col justify-center p-6 border-b-2 border-transparent hover:border-[--primary]/30 transition-all bg-[--card-bg]">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
            <Banknote className="w-6 h-6 text-[--primary] opacity-80" />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${variation >= 0 ? 'bg-[--success]/10 text-[--success]' : 'bg-[--danger]/10 text-[--danger]'}`}>
            {variation > 0 ? '+' : ''}{variation}%
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-serif text-[--foreground] mb-0.5 tracking-tight">
            R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[--secondary-text] font-bold opacity-60">Faturamento</span>
        </div>
        <div className="absolute top-0 right-0 p-8 bg-[--primary]/5 blur-3xl rounded-full -mr-10 -mt-10" />
      </div>

      {/* 2. Despesas */}
      <div className="glass-panel relative overflow-hidden group min-h-[140px] flex flex-col justify-center p-6 border-b-2 border-transparent hover:border-[--danger]/30 transition-all bg-[--card-bg]">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-[--danger]/5 rounded-xl border border-[--danger]/10 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-6 h-6 text-[--danger] opacity-80" />
          </div>
          <button 
            onClick={onNewExpense}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[--danger]/10 hover:bg-[--danger]/20 border border-[--danger]/20 rounded-lg text-[10px] text-[--danger] font-bold transition-all"
          >
            <Plus className="w-3 h-3" /> Nova Despesa
          </button>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-serif text-[--danger] mb-0.5 tracking-tight group-hover:scale-[1.02] origin-left transition-transform">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[--danger] opacity-60 font-bold">Despesas</span>
        </div>
        <div className="absolute top-0 right-0 p-8 bg-[--danger]/5 blur-3xl rounded-full -mr-10 -mt-10" />
      </div>

      {/* 3. Lucro Líquido */}
      <div className="glass-panel relative overflow-hidden group min-h-[140px] flex flex-col justify-center p-6 border-b-2 border-transparent hover:border-[--primary]/30 transition-all bg-[--card-bg]">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl border transition-transform group-hover:scale-110 ${isPositiveProfit ? 'bg-[--success]/5 border-[--success]/10' : 'bg-[--danger]/5 border-[--danger]/10'}`}>
            {isPositiveProfit ? (
              <TrendingUp className="w-6 h-6 text-[--success] opacity-80" />
            ) : (
              <TrendingDown className="w-6 h-6 text-[--danger] opacity-80" />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className={`text-2xl font-serif mb-0.5 tracking-tight ${isPositiveProfit ? 'text-[--success]' : 'text-[--danger]'}`}>
            R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[--secondary-text] font-bold opacity-60">Lucro Líquido</span>
        </div>
        <div className={`absolute top-0 right-0 p-8 blur-3xl rounded-full -mr-10 -mt-10 ${isPositiveProfit ? 'bg-[--success]/5' : 'bg-[--danger]/5'}`} />
      </div>

      {/* 4. A Receber */}
      <div 
        onClick={onOpenPending}
        className="glass-panel relative overflow-hidden group min-h-[140px] flex flex-col justify-center p-6 border-b-2 border-transparent hover:border-[--warning]/30 transition-all cursor-pointer bg-[--card-bg]"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-[--warning]/5 rounded-xl border border-[--warning]/10 group-hover:rotate-12 transition-all">
            <Hourglass className="w-6 h-6 text-[--warning] opacity-80" />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-serif text-[--warning] mb-0.5 tracking-tight group-hover:scale-[1.02] origin-left transition-transform">
            R$ {pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[--warning] opacity-60 font-bold">A Receber</span>
        </div>
        <div className="absolute top-0 right-0 p-8 bg-[--warning]/5 blur-3xl rounded-full -mr-10 -mt-10" />
      </div>

    </div>
  )
}
