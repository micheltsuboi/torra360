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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      
      {/* 1. Faturamento Total */}
      <div className="glass-panel p-6 group transition-all hover:bg-black/40">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-[--success]/10 rounded-lg group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-[--success]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] opacity-60">Faturamento</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-serif text-[--foreground]">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <div className="flex items-center gap-1 mt-2 text-[--success]">
            <ArrowUpRight className="w-3 h-3" />
            <span className="text-[10px] font-bold">Total Recebido</span>
          </div>
        </div>
      </div>

      {/* 2. Custo de Produção */}
      <div className="glass-panel p-6 group transition-all hover:bg-black/40 border-l-4 border-[--primary]/20">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-[--primary]/10 rounded-lg group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-[--primary]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] opacity-60">Custos de Produção</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-serif text-[--foreground]">R$ {stats.productionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <div className="flex items-center gap-1 mt-2 text-[--warning]">
             <span className="text-[10px] font-bold">Grãos + Operacional</span>
          </div>
        </div>
      </div>

      {/* 3. Despesas Gerais */}
      <div className="glass-panel p-6 group transition-all hover:bg-black/40">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-[--danger]/10 rounded-lg group-hover:scale-110 transition-transform">
            <Receipt className="w-6 h-6 text-[--danger]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] opacity-60">Despesas Extras</span>
        </div>
        <div className="flex flex-col">
           <span className="text-2xl font-serif text-[--foreground]">R$ {stats.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-2 text-[--danger]">
             <ArrowDownRight className="w-3 h-3" />
             <span className="text-[10px] font-bold">Fixas e Variáveis</span>
           </div>
        </div>
      </div>

      {/* 4. Lucro Real */}
      <div className="glass-panel p-6 group transition-all hover:bg-black/40 bg-gradient-to-br from-black/0 to-[--primary]/5">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6 text-[--primary]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] opacity-60">Lucro Real</span>
        </div>
        <div className="flex flex-col">
           <span className="text-2xl font-serif text-[--primary] title-glow uppercase">R$ {stats.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="bg-[--primary]/20 rounded-full px-2 py-0.5 w-fit mt-2 border border-[--primary]/30">
              <span className="text-[10px] font-bold text-[--primary] uppercase tracking-tighter">Margem: {profitMargin}%</span>
           </div>
        </div>
      </div>

    </div>
  )
}
