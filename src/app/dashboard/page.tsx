import { getRoastBatches } from './torra/actions'

export default async function DashboardIndex() {
  const recentRoasts = await getRoastBatches()
  const latestFive = recentRoasts.slice(0, 5)

  // Calculate yield rates for the chart
  const averageYieldStr = latestFive.length > 0 
    ? (latestFive.reduce((acc: number, r: any) => acc + parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100)), 0) / latestFive.length).toFixed(1)
    : "0.0"

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[--foreground]">Visão Geral</h1>
        <p className="text-[--secondary-text] mt-1">Resumo da sua torrefação</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Gráfico Principal */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-serif text-[--foreground]">Taxa de Rendimento (Últimas Torras)</h2>
              <p className="text-sm text-[--secondary-text]">Média: {averageYieldStr}%</p>
            </div>
            <div className="text-[--primary] bg-[--primary]/10 px-3 py-1 rounded text-sm select-none border border-[--primary]/20">
              Ideal: &gt; 80%
            </div>
          </div>
          <div className="flex-1 flex items-end justify-around gap-2 mt-8 min-h-[220px] wood-texture rounded-xl p-6 border border-[--card-border] shadow-inner">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => {
                const yieldP = parseFloat(roast.yield_percentage || ((roast.qty_after_kg / roast.qty_before_kg) * 100).toString())
                const height = Math.min(100, Math.max(15, yieldP))
                
                let colorClass = 'bg-[--primary]'
                let iconColor = 'text-[--primary]'
                if (yieldP < 78) { colorClass = 'bg-[--danger]'; iconColor = 'text-[--danger]'; }
                else if (yieldP >= 78 && yieldP < 82) { colorClass = 'bg-[--warning]'; iconColor = 'text-[--warning]'; }
                else { colorClass = 'bg-[--success]'; iconColor = 'text-[--success]'; }

                return (
                  <div key={roast.roast_batch_id || roast.id || idx} className="flex-1 max-w-[80px] h-full flex flex-col justify-end group">
                    <div className="relative w-full flex flex-col justify-end flex-1">
                      {/* Tooltip-like value */}
                      <span className={`absolute -top-7 left-0 right-0 text-center text-[10px] font-bold ${iconColor} opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0`}>
                        {yieldP.toFixed(1)}%
                      </span>
                      <span className={`absolute -top-7 left-0 right-0 text-center text-[10px] font-bold ${iconColor} group-hover:opacity-0 transition-all`}>
                        {yieldP.toFixed(1)}%
                      </span>
                      
                      <div 
                        className={`w-full ${colorClass} rounded-t-md opacity-60 backdrop-blur-sm transition-all duration-500 hover:opacity-100 hover:scale-x-105 shadow-[0_0_15px_rgba(0,0,0,0.5)]`} 
                        style={{ height: `${height}%` }}
                      >
                        <div className="w-full h-full bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    </div>
                    
                    <div className="mt-3 text-center px-1">
                      <p className="text-[10px] font-bold text-[--foreground] truncate leading-tight mb-0.5">
                        {roast.green_coffee?.name || 'Lote'}
                      </p>
                      <p className="text-[8px] text-[--secondary-text] opacity-40">
                        {new Date(roast.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="w-full flex items-center justify-center text-[--secondary-text] italic h-full opacity-30">
                Nenhum lote torrado ainda.
              </div>
            )}
          </div>
        </div>

        {/* Logs Recentes */}
        <div className="glass-panel p-0 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
            <h2 className="font-serif">Lotes Recentes</h2>
            <span className="text-xs py-1 px-3 bg-white/10 rounded-full border border-white/5">{latestFive.length}</span>
          </div>
          <div className="p-2 flex flex-col gap-2">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => (
                <div key={roast.roast_batch_id || roast.id || idx} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full border border-[--primary]/50 overflow-hidden shrink-0 relative bg-black">
                    <div className="absolute inset-0 opacity-40 wood-texture" />
                    <span className="absolute inset-0 flex items-center justify-center text-xs">TR</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <h4 className="text-sm font-semibold text-[--foreground] truncate">{roast.green_coffee?.name || 'Lote de Café'}</h4>
                     <p className="text-xs text-[--secondary-text]">Data: {roast.date}</p>
                  </div>
                  <div className="w-8 flex flex-col items-end text-xs shrink-0">
                    <span className="text-[--success]">{roast.qty_after_kg}kg</span>
                  </div>
                </div>
              ))
            ) : (
               <p className="text-xs text-[--secondary-text] text-center italic mt-4">Nenhum registro encontrado.</p>
            )}
          </div>
        </div>

      </div>
    </>
  )
}
