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
      <div className="glass-panel overflow-hidden border-t-2 border-[--success]">
        <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex justify-between items-center bg-black/40">
           <h3 className="text-[10px] uppercase tracking-widest text-[--success] font-serif font-bold">Faturamento Total</h3>
           <TrendingUp className="w-4 h-4 text-[--success] opacity-60" />
        </div>
        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-transparent to-[--success]/5">
           <span className="text-2xl font-serif text-[--foreground] title-glow uppercase">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-2 text-[--success]">
             <ArrowUpRight className="w-3 h-3" />
             <span className="text-[9px] font-bold uppercase tracking-tighter">Total Recebido</span>
           </div>
        </div>
      </div>

      {/* 2. Custo de Produção */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]">
        <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex justify-between items-center bg-black/40">
           <h3 className="text-[10px] uppercase tracking-widest text-[--primary] font-serif font-bold">Custos Operacionais</h3>
           <Activity className="w-4 h-4 text-[--primary] opacity-60" />
        </div>
        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-transparent to-[--primary]/5">
           <span className="text-2xl font-serif text-[--foreground] title-glow uppercase">R$ {stats.productionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-2 text-[--warning]">
             <span className="text-[9px] font-bold uppercase tracking-tighter">Grãos + Processo</span>
           </div>
        </div>
      </div>

      {/* 3. Despesas Gerais */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--danger]">
        <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex justify-between items-center bg-black/40">
           <h3 className="text-[10px] uppercase tracking-widest text-[--danger] font-serif font-bold">Gasto com Despesas</h3>
           <Receipt className="w-4 h-4 text-[--danger] opacity-60" />
        </div>
        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-transparent to-[--danger]/5">
           <span className="text-2xl font-serif text-[--foreground] title-glow uppercase">R$ {stats.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="flex items-center gap-1 mt-2 text-[--danger]">
             <ArrowDownRight className="w-3 h-3" />
             <span className="text-[9px] font-bold uppercase tracking-tighter">Fixas e Variáveis</span>
           </div>
        </div>
      </div>

      {/* 4. Lucro Real */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--primary] bg-black/20 shadow-2xl">
        <div className="p-2 px-4 border-b border-[--card-border] card-texture-header flex justify-between items-center bg-black/60 shadow-xl">
           <h3 className="text-[10px] uppercase tracking-widest text-[--primary] font-serif font-bold tracking-widest">Lucro Líquido Real</h3>
           <Wallet className="w-4 h-4 text-[--primary] opacity-80" />
        </div>
        <div className="p-6 flex flex-col items-center bg-gradient-to-br from-transparent via-[--primary]/10 to-[--primary]/5 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 pointer-events-none wood-texture" />
           <span className="text-3xl font-serif text-[--primary] title-glow uppercase relative z-10">R$ {stats.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           <div className="bg-[--primary]/30 backdrop-blur-md rounded-full px-3 py-1 mt-3 border border-[--primary]/40 relative z-10 shadow-lg">
              <span className="text-[10px] font-bold text-[--primary] uppercase tracking-widest">Margem: {profitMargin}%</span>
           </div>
        </div>
      </div>

    </div>
  )
}
