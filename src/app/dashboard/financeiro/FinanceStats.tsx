'use client'

import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Banknote, 
  Hourglass, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp as ProfitIcon
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
  const totalExpenses = stats.productionCost + stats.expenses
  const isPositiveProfit = stats.profit >= 0
  const variation = stats.revenueChange || 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
      
      {/* 1. Faturamento */}
      <div className="glass-panel relative overflow-hidden group min-h-[140px] flex flex-col justify-center p-6 border-b-2 border-transparent hover:border-[--primary]/30 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
            <Banknote className="w-6 h-6 text-[--primary] opacity-80" />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${variation >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {variation > 0 ? '+' : ''}{variation}%
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-serif text-[--foreground] mb-0.5 tracking-tight">
            R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[--secondary-text] font-bold opacity-60">Faturamento</span>
        </div>
        <div className="absolute top-0 right-0 p-8 bg-[--primary]/5 blur-3xl rounded-full -mr-10 -mt-10" />
      </div>

      {/* 2. Despesas (Vermelho) */}
      <div className="glass-panel relative overflow-hidden group min-h-[140px] flex flex-col justify-center p-6 border-b-2 border-transparent hover:border-red-500/30 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-red-500/5 rounded-xl border border-red-500/10 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-6 h-6 text-red-500 opacity-80" />
          </div>
          <button 
            onClick={onNewExpense}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[10px] text-red-500 font-bold transition-all"
          >
            <Plus className="w-3 h-3" /> Nova Despesa
          </button>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-serif text-red-500 mb-0.5 tracking-tight group-hover:scale-[1.02] origin-left transition-transform">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-red-500/60 font-bold">Despesas</span>
        </div>
        <div className="absolute top-0 right-0 p-8 bg-red-500/5 blur-3xl rounded-full -mr-10 -mt-10" />
      </div>

      {/* 3. Lucro Líquido (Condicional) */}
      <div className="glass-panel relative overflow-hidden group min-h-[140px] flex flex-col justify-center p-6 border-b-2 border-transparent hover:border-[--primary]/30 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl border transition-transform group-hover:scale-110 ${isPositiveProfit ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
            {isPositiveProfit ? (
              <ProfitIcon className="w-6 h-6 text-green-500 opacity-80" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-500 opacity-80" />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className={`text-2xl font-serif mb-0.5 tracking-tight ${isPositiveProfit ? 'text-green-500' : 'text-red-500'}`}>
            R$ {stats.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[--secondary-text] font-bold opacity-60">Lucro Líquido</span>
        </div>
        <div className={`absolute top-0 right-0 p-8 blur-3xl rounded-full -mr-10 -mt-10 ${isPositiveProfit ? 'bg-green-500/5' : 'bg-red-500/5'}`} />
      </div>

      {/* 4. A Receber (Laranja) */}
      <div 
        onClick={onOpenPending}
        className="glass-panel relative overflow-hidden group min-h-[140px] flex flex-col justify-center p-6 border-b-2 border-transparent hover:border-orange-500/30 transition-all cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-orange-500/5 rounded-xl border border-orange-500/10 group-hover:rotate-12 transition-all">
            <Hourglass className="w-6 h-6 text-orange-400 opacity-80" />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-serif text-orange-400 mb-0.5 tracking-tight group-hover:scale-[1.02] origin-left transition-transform">
            R$ {stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-orange-400/60 font-bold">A Receber</span>
        </div>
        <div className="absolute top-0 right-0 p-8 bg-orange-500/5 blur-3xl rounded-full -mr-10 -mt-10" />
      </div>

    </div>
  )
}
