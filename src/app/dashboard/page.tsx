import { getRoastBatches } from './torra/actions'
import { formatDate } from '@/utils/date-utils'

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
          <div className="flex-1 flex flex-col gap-4 mt-8 bg-black/30 rounded-xl p-8 border border-[--card-border] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none wood-texture" />
            
            <div className="flex-1 flex items-end justify-between gap-6 min-h-[220px] pb-2 px-2 relative z-10">
              {latestFive.length > 0 ? (
                latestFive.map((roast: any, idx: number) => {
                  const yieldP = parseFloat(roast.yield_percentage || ((roast.qty_after_kg / roast.qty_before_kg) * 100).toString())
                  const height = Math.min(100, Math.max(15, yieldP))
                  
                  let colorClass = 'bg-[--primary]'
                  let iconColor = 'text-[--primary]'
                  let glowColor = 'shadow-[0_0_20px_rgba(195,153,103,0.3)]'
                  
                  if (yieldP < 78) { 
                    colorClass = 'bg-[--danger]'; 
                    iconColor = 'text-[--danger]';
                    glowColor = 'shadow-[0_0_20px_rgba(239,68,68,0.3)]';
                  }
                  else if (yieldP >= 78 && yieldP < 82) { 
                    colorClass = 'bg-[--warning]'; 
                    iconColor = 'text-[--warning]';
                    glowColor = 'shadow-[0_0_20px_rgba(245,158,11,0.3)]';
                  }
                  else { 
                    colorClass = 'bg-[--success]'; 
                    iconColor = 'text-[--success]';
                    glowColor = 'shadow-[0_0_20px_rgba(34,197,94,0.3)]';
                  }

                  return (
                    <div key={roast.roast_batch_id || roast.id || idx} className="flex-1 flex flex-col items-center group max-w-[120px]">
                      <div className="relative w-full flex flex-col justify-end h-[160px] bg-white/5 rounded-t-lg border-x border-t border-white/5 shadow-inner">
                        {/* Percentage Label */}
                        <div className={`absolute -top-8 w-full text-center font-bold text-sm ${iconColor} drop-shadow-lg`}>
                          {yieldP.toFixed(1)}%
                        </div>
                        
                        {/* The Actual Bar */}
                        <div 
                          className={`w-full ${colorClass} ${glowColor} rounded-t-lg transition-all duration-700 ease-out relative group-hover:opacity-100 opacity-80`} 
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute inset-x-0 top-0 h-1 bg-white/20 rounded-t-lg" />
                          <div className="w-full h-full bg-gradient-to-t from-black/40 via-transparent to-white/10" />
                        </div>
                      </div>
                      
                      {/* Name and Date */}
                      <div className="mt-4 text-center w-full">
                        <p className="text-[11px] font-bold text-[--primary] truncate mb-0.5 tracking-wide uppercase">
                          {roast.green_coffee?.name || 'Lote'}
                        </p>
                        <p className="text-[9px] text-[--secondary-text] opacity-40 font-mono">
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
                     <p className="text-xs text-[--secondary-text]">Data: {formatDate(roast.date)}</p>
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
