'use client'

import { TrendingUp, Wallet, Receipt, PieChart, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'

interface Stats {
  revenue: number
  productionCost: number
  expenses: number
  profit: number
  salesCount: number
}

export default function FinanceStats({ stats }: { stats: Stats }) {
  const profitMargin = stats.revenue > 0 ? (stats.profit / stats.revenue * 100).toFixed(1) : '0'

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch mb-8 w-full max-w-6xl">
      
      {/* 1. Faturamento Total */}
      <div className="flex-1 glass-panel overflow-hidden border-t-2 border-[--success] bg-black/20 text-center">
        <div className="p-2 px-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
           <h2 className="text-[11px] uppercase tracking-widest text-[--primary] font-serif">Faturamento Total</h2>
           <TrendingUp className="w-3 h-3 text-[--success] opacity-60" />
        </div>
        <div className="p-4 flex flex-col items-center bg-gradient-to-b from-transparent to-[--success]/5">
           <span className="text-lg font-serif text-[--foreground] title-glow">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-1 text-[--success]">
             <ArrowUpRight className="w-2 h-2" />
             <span className="text-[8px] font-bold opacity-40 tracking-tighter">Total recebido</span>
           </div>
        </div>
      </div>

      {/* 2. Custo de Produção */}
      <div className="flex-1 glass-panel overflow-hidden border-t-2 border-[--primary] bg-black/20 text-center">
        <div className="p-2 px-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
           <h2 className="text-[11px] uppercase tracking-widest text-[--primary] font-serif">Custos Operacionais</h2>
           <Activity className="w-3 h-3 text-[--primary] opacity-60" />
        </div>
        <div className="p-4 flex flex-col items-center bg-gradient-to-b from-transparent to-[--primary]/5">
           <span className="text-lg font-serif text-[--foreground] title-glow">R$ {stats.productionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-1 text-[--warning]">
             <span className="text-[8px] font-bold opacity-40 tracking-tighter">Grãos + Processo</span>
           </div>
        </div>
      </div>

      {/* 3. Despesas Gerais */}
      <div className="flex-1 glass-panel overflow-hidden border-t-2 border-[--danger] bg-black/20 text-center">
        <div className="p-2 px-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
           <h2 className="text-[11px] uppercase tracking-widest text-[--primary] font-serif">Gasto com Despesas</h2>
           <Receipt className="w-3 h-3 text-[--danger] opacity-60" />
        </div>
        <div className="p-4 flex flex-col items-center bg-gradient-to-b from-transparent to-[--danger]/5">
           <span className="text-lg font-serif text-[--foreground] title-glow">R$ {stats.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-1 text-[--danger]">
             <ArrowDownRight className="w-2 h-2" />
             <span className="text-[8px] font-bold opacity-40 tracking-tighter">Fixas e Variáveis</span>
           </div>
        </div>
      </div>

      {/* 4. Lucro Real */}
      <div className="flex-1 glass-panel overflow-hidden border-t-2 border-[--primary] bg-black/20 shadow-2xl text-center">
        <div className="p-2 px-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/60 shadow-xl">
           <h2 className="text-[11px] uppercase tracking-widest text-[--primary] font-serif">Lucro Líquido Real</h2>
           <Wallet className="w-3 h-3 text-[--primary] opacity-80" />
        </div>
        <div className="p-4 flex flex-col items-center bg-gradient-to-br from-transparent via-[--primary]/10 to-[--primary]/5 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 pointer-events-none wood-texture" />
           <span className="text-xl font-serif text-[--primary] title-glow relative z-10">R$ {stats.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="bg-[--primary]/30 backdrop-blur-md rounded-full px-2 py-0.5 mt-2 border border-[--primary]/40 relative z-10 shadow-lg">
              <span className="text-[9px] font-bold text-[--primary] uppercase tracking-widest">Margem: {profitMargin}%</span>
           </div>
        </div>
      </div>

    </div>
  )
}
