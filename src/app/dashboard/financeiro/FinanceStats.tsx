'use client'

import { TrendingUp, Wallet, Receipt, PieChart, ArrowUpRight, ArrowDownRight, Activity, Clock, ArrowRight } from 'lucide-react'

interface Stats {
  revenue: number
  productionCost: number
  expenses: number
  profit: number
  pendingRevenue: number
  salesCount: number
}

export default function FinanceStats({ stats, onOpenPending }: { stats: Stats, onOpenPending: () => void }) {
  const profitMargin = stats.revenue > 0 ? (stats.profit / stats.revenue * 100).toFixed(1) : '0'

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 w-full">
      
      {/* 1. Faturamento Total */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--success] bg-black/20 text-center">
        <div className="p-2 px-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
           <span className="text-[10px] uppercase tracking-widest text-[--primary] font-bold opacity-60">Faturamento Real</span>
           <TrendingUp className="w-3 h-3 text-[--success] opacity-60" />
        </div>
        <div className="p-4 flex flex-col items-center bg-gradient-to-b from-transparent to-[--success]/5">
           <span className="text-lg font-serif text-[--foreground] title-glow">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-1 text-[--success] opacity-60">
             <ArrowUpRight className="w-2 h-2" />
             <span className="text-[9px] font-bold tracking-tighter">Total recebido</span>
           </div>
        </div>
      </div>

      {/* 2. Contas a Receber (Novo Card Interativo) */}
      <div 
        onClick={onOpenPending}
        className="glass-panel overflow-hidden border-t-2 border-[--primary] bg-black/20 text-center cursor-pointer hover:bg-black/40 transition-all group"
      >
        <div className="p-2 px-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
           <span className="text-[10px] uppercase tracking-widest text-[--primary] font-bold opacity-60">Contas a Receber</span>
           <Clock className="w-3 h-3 text-[--primary] group-hover:rotate-12 transition-transform" />
        </div>
        <div className="p-4 flex flex-col items-center bg-gradient-to-b from-transparent to-[--primary]/5">
           <span className="text-lg font-serif text-[--foreground] title-glow">R$ {stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-1 text-[--primary] opacity-60">
             <ArrowRight className="w-2 h-2" />
             <span className="text-[9px] font-bold tracking-tighter">Clique para detalhes</span>
           </div>
        </div>
      </div>

      {/* 3. Custo de Produção / Processos */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--primary] bg-black/20 text-center opacity-80">
        <div className="p-2 px-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
           <span className="text-[10px] uppercase tracking-widest text-[--primary] font-bold opacity-60">Processos</span>
           <Activity className="w-3 h-3 text-[--primary] opacity-60" />
        </div>
        <div className="p-4 flex flex-col items-center bg-gradient-to-b from-transparent to-[--primary]/5 text-[--secondary-text]">
           <span className="text-lg font-serif">R$ {stats.productionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-1 opacity-60">
             <span className="text-[9px] font-bold tracking-tighter">Grãos + Operação</span>
           </div>
        </div>
      </div>

      {/* 4. Despesas Gerais */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--danger] bg-black/20 text-center">
        <div className="p-2 px-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
           <span className="text-[10px] uppercase tracking-widest text-[--primary] font-bold opacity-60">Gasto Despesas</span>
           <Receipt className="w-3 h-3 text-[--danger] opacity-60" />
        </div>
        <div className="p-4 flex flex-col items-center bg-gradient-to-b from-transparent to-[--danger]/5">
           <span className="text-lg font-serif text-[--foreground] title-glow">R$ {stats.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-1 text-[--danger] opacity-60">
              <ArrowDownRight className="w-2 h-2" />
              <span className="text-[9px] font-bold tracking-tighter">Fixas e Variáveis</span>
           </div>
        </div>
      </div>

      {/* 5. Lucro Real */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--primary] bg-black/20 shadow-2xl text-center">
        <div className="p-2 px-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/60 shadow-xl">
           <span className="text-[10px] uppercase tracking-widest text-[--primary] font-bold opacity-80">Lucro Líquido Real</span>
           <Wallet className="w-3 h-3 text-[--primary] opacity-80" />
        </div>
        <div className="p-4 flex flex-col items-center bg-gradient-to-br from-transparent via-[--primary]/10 to-[--primary]/5 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 pointer-events-none wood-texture" />
           <span className="text-lg font-serif text-[--primary] title-glow relative z-10">R$ {stats.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="z-10 mt-1">
              <span className="text-[10px] font-bold text-[--primary] uppercase tracking-widest opacity-60">Margem: {profitMargin}%</span>
           </div>
        </div>
      </div>

    </div>
  )
}
