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
          <div className="flex-1 flex items-end justify-between gap-2 mt-4 min-h-[200px] wood-texture rounded-lg p-4 border border-[--card-border]">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => {
                const yieldP = parseFloat(roast.yield_percentage || ((roast.qty_after_kg / roast.qty_before_kg) * 100).toString())
                const height = Math.min(100, Math.max(10, yieldP))
                // some color logic
                let colorClass = 'bg-[--primary]'
                if (yieldP < 78) colorClass = 'bg-[--danger]'
                else if (yieldP >= 78 && yieldP < 82) colorClass = 'bg-[--warning]'
                else colorClass = 'bg-[--success]'

                return (
                  <div key={roast.roast_batch_id || roast.id || idx} className={`w-1/5 ${colorClass} rounded-t opacity-80 backdrop-blur-sm relative group cursor-pointer transition-all hover:opacity-100 hover:-translate-y-1`} style={{ height: `${height}%` }}>
                    <span className="absolute -top-6 w-full text-center text-xs text-[--foreground]">{yieldP.toFixed(1)}%</span>
                    <div className="absolute top-2 w-full text-center text-[10px] text-black font-bold truncate px-1">
                      {roast.green_coffee?.name || 'Lote'}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="w-full flex items-center justify-center text-[--secondary-text] italic h-full">
                Nenhum lote torrado ainda.
              </div>
            )}
          </div>
        </div>

        {/* Logs Recentes */}
        <div className="glass-panel p-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
            <h2 className="font-serif">Lotes Recentes</h2>
            <span className="text-xs py-1 px-3 bg-white/10 rounded-full border border-white/5">{latestFive.length}</span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => (
                <div key={roast.roast_batch_id || roast.id || idx} className="flex items-center gap-3">
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
