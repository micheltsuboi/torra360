'use client'

interface ChartProps {
  stats: {
    revenue: number
    productionCost: number
    expenses: number
  }
}

export default function FinanceChart({ stats }: ChartProps) {
  const totalCosts = stats.productionCost + stats.expenses
  const maxVal = Math.max(stats.revenue, totalCosts, 1) // Evitar divisão por zero
  
  const revenuePercent = (stats.revenue / maxVal) * 100
  const costsPercent = (totalCosts / maxVal) * 100

  return (
    <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 mb-8 max-w-6xl w-full">
      <div className="p-3 px-5 border-b border-white/5 bg-black/40 wood-texture backdrop-blur-sm flex justify-between items-center">
         <span className="text-[10px] capitalize tracking-widest text-[--primary] font-bold opacity-80">Resumo financeiro (Fluxo)</span>
         <div className="flex gap-4 text-[9px] font-bold capitalize tracking-widest">
            <div className="flex items-center gap-1.5 opacity-60">
               <div className="w-2 h-2 rounded bg-[--success]" />
               <span>Receitas</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
               <div className="w-2 h-2 rounded bg-[--danger]" />
               <span>Custos</span>
            </div>
         </div>
      </div>
      
      <div className="p-8 flex flex-col gap-8 relative overflow-hidden">
         <div className="absolute inset-0 opacity-5 pointer-events-none wood-texture" />
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Gráfico de Barras */}
            <div className="space-y-6">
                {/* Barra Receita */}
                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] text-[--secondary-text] font-bold tracking-widest">Faturamento</span>
                      <span className="text-sm font-serif text-[--success]">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[--success]/40 to-[--success] transition-all duration-1000 shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]"
                        style={{ width: `${revenuePercent}%` }}
                      />
                   </div>
                </div>

                {/* Barra Custos */}
                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] text-[--secondary-text] font-bold tracking-widest">Custos Totais</span>
                      <span className="text-sm font-serif text-[--danger]">R$ {totalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[--danger]/40 to-[--danger] transition-all duration-1000 shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]"
                        style={{ width: `${costsPercent}%` }}
                      />
                   </div>
                </div>
            </div>

            {/* Resumo Complementar */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 border border-white/5 rounded-lg flex flex-col items-center">
                   <span className="text-[8px] text-[--secondary-text] font-bold opacity-40 capitalize tracking-widest mb-1">Custo indireto</span>
                   <span className="text-lg font-serif text-[--primary]">{((stats.expenses / (totalCosts || 1)) * 100).toFixed(0)}%</span>
                </div>
                <div className="bg-black/20 p-4 border border-white/5 rounded-lg flex flex-col items-center">
                   <span className="text-[8px] text-[--secondary-text] font-bold opacity-40 capitalize tracking-widest mb-1">Custo matéria</span>
                   <span className="text-lg font-serif text-[--primary]">{((stats.productionCost / (totalCosts || 1)) * 100).toFixed(0)}%</span>
                </div>
            </div>

         </div>

      </div>
    </div>
  )
}
