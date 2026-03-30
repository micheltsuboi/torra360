export default function DashboardIndex() {
  return (
    <>
      {/* Container de Título da Página */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[--foreground]">Visão Geral</h1>
        <p className="text-[--secondary-text] mt-1">Resumo da sua torrefação hoje</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Gráfico Principal */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-serif text-[--foreground]">Taxa de Rendimento Diário</h2>
              <p className="text-sm text-[--secondary-text]">Média de eficiência dos lotes torrados</p>
            </div>
            <div className="text-[--primary] bg-[--primary]/10 px-3 py-1 rounded text-sm select-none border border-[--primary]/20">
              Ideal: 82.5%
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 mt-4 min-h-[200px] wood-texture rounded-lg p-4 border border-[--card-border]">
            {/* Barras de Exemplo (Mockadas pra manter o visual) */}
            <div className="w-1/5 bg-[--success] h-[34%] rounded-t opacity-80 backdrop-blur-sm relative group cursor-pointer transition-all hover:opacity-100 hover:-translate-y-1"><span className="absolute -top-6 w-full text-center text-xs">34.1kg</span></div>
            <div className="w-1/5 bg-[#F3EAE0] h-[60%] rounded-t opacity-80 backdrop-blur-sm relative group cursor-pointer transition-all hover:opacity-100 hover:-translate-y-1"><span className="absolute -top-6 w-full text-center text-xs text-[--secondary]">60.3kg</span></div>
            <div className="w-1/5 bg-[--danger] h-[40%] rounded-t opacity-80 backdrop-blur-sm relative group cursor-pointer transition-all hover:opacity-100 hover:-translate-y-1"><span className="absolute -top-6 w-full text-center text-xs">40.2kg</span></div>
            <div className="w-1/5 bg-gradient-to-t from-[--primary] to-[#E3C392] h-[82%] rounded-t shadow-[0_0_15px_rgba(195,153,103,0.3)] relative group cursor-pointer transition-all hover:-translate-y-1"><span className="absolute -top-6 w-full text-center text-xs">82.7kg</span><div className="absolute top-2 w-full text-center text-[10px] text-black font-bold">Lote Especial</div></div>
            <div className="w-1/5 bg-[--warning] h-[45%] rounded-t opacity-80 backdrop-blur-sm relative group cursor-pointer transition-all hover:opacity-100 hover:-translate-y-1"><span className="absolute -top-6 w-full text-center text-xs">45.4kg</span></div>
          </div>
        </div>

        {/* Logs Recentes */}
        <div className="glass-panel p-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[--card-border] wood-texture backdrop-blur-sm flex justify-between items-center bg-black/40">
            <h2 className="font-serif">Lotes Recentes</h2>
            <span className="text-xs py-1 px-3 bg-white/10 rounded-full border border-white/5">Hoje</span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {/* Item 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[--primary]/50 overflow-hidden shrink-0 relative bg-black">
                <div className="absolute inset-0 opacity-40 wood-texture" />
                <span className="absolute inset-0 flex items-center justify-center text-xs">TV</span>
              </div>
              <div className="flex-1">
                 <h4 className="text-sm font-semibold text-[--foreground]">Tradicional Volcânico</h4>
                 <p className="text-xs text-[--secondary-text]">Lote 12A • Aprovado</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-[--success]/20 flex items-center justify-center text-[--success] text-xs">✔️</div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[--warning]/50 overflow-hidden shrink-0 relative bg-black">
                <div className="absolute inset-0 opacity-40 wood-texture" />
                <span className="absolute inset-0 flex items-center justify-center text-xs">LV</span>
              </div>
              <div className="flex-1">
                 <h4 className="text-sm font-semibold text-[--foreground]">Linha Verdanite</h4>
                 <p className="text-xs text-[--secondary-text]">Lote 3 • Aprovado</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-[--success]/20 flex items-center justify-center text-[--success] text-xs">✔️</div>
            </div>
             
             {/* Item 3 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[--secondary-text]/30 overflow-hidden shrink-0 relative bg-black">
                <div className="absolute inset-0 opacity-40 wood-texture" />
                <span className="absolute inset-0 flex items-center justify-center text-xs">AG</span>
              </div>
              <div className="flex-1">
                 <h4 className="text-sm font-semibold text-[--foreground]">Arábica Green</h4>
                 <p className="text-xs text-[--secondary-text]">Aguardando Torra...</p>
              </div>
              <div className="text-xs px-2 py-1 bg-white/5 rounded-md border border-white/5">Aguardando</div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
