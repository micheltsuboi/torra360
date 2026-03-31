import { getRoastBatches, getAvailableGreenLots, createRoastBatch, deleteRoastBatch } from './actions'
import { Pencil, Trash2, Flame } from 'lucide-react'
import TorraHeader from './TorraHeader'

export const dynamic = 'force-dynamic'

export default async function TorraPage() {
  const greenLots = await getAvailableGreenLots()
  const roastBatches = await getRoastBatches()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-serif text-[--foreground]">Produção de Torra</h1>
          <p className="text-[--secondary-text] mt-1 italic opacity-60">Monitore o rendimento e controle a quebra de cada lote em tempo real.</p>
        </div>
      </div>

      <TorraHeader greenLots={greenLots} />

      {/* Histórico / Relatório de Torra */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="glass-panel overflow-hidden border-t-4 border-[--primary]/30 shadow-2xl">
           <div className="p-2 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <h2 className="font-serif text-[--primary] text-xl">Histórico de Produção Recente</h2>
           </div>
           
           <div className="responsive-table-container scrollbar-thin scrollbar-thumb-[--primary]/20">
            <table className="w-full   border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[--secondary-text] text-[10px] capitalize border-b border-[--card-border]/50 bg-white/5 tracking-widest">
                   <th className="p-2 font-bold border-r border-white/5">Data da Torra</th>
                   <th className="p-2 font-bold">Lote Base (Café Verde)</th>
                   <th className="p-2 font-bold text-center">Rendimento Final</th>
                   <th className="p-2 font-bold text-center border-l border-white/5">Quebra (%)</th>
                   <th className="p-2 font-bold   border-l border-white/5">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {roastBatches && roastBatches.length > 0 ? (
                  roastBatches.map((r: any) => {
                    const yieldPerc = r.yield_percentage || (r.qty_after_kg / r.qty_before_kg * 100);
                    const shrinkage = 100 - yieldPerc;
                    
                    return (
                      <tr key={r.roast_batch_id || r.id} className="border-b border-[--card-border]/30 hover:bg-white/5 transition-colors group">
                        <td className="p-2 border-r border-white/5">
                           <div className="flex flex-col">
                             <span className="text-sm font-bold text-[--foreground]">{new Date(r.date).toLocaleDateString()}</span>
                             <span className="text-[9px] capitalize tracking-widest text-[--secondary-text]">Lote: #{r.id.slice(-6).toUpperCase()}</span>
                           </div>
                        </td>
                        <td className="p-2">
                           <div className="flex flex-col">
                             <span className="text-base font-serif text-[--primary] font-medium">{r.green_coffee?.name || 'N/A'}</span>
                             <span className="text-[10px] capitalize text-[--secondary-text]">{r.qty_before_kg}kg orig.</span>
                           </div>
                        </td>
                        <td className="p-2 text-center">
                           <div className="flex flex-col items-center">
                             <div className={`text-xl font-serif font-bold ${yieldPerc < 80 ? 'text-[--danger]' : 'text-[--success]'}`}>
                               {yieldPerc?.toFixed(1)}%
                             </div>
                             <span className="text-[9px] font-bold text-[--secondary-text] capitalize">{r.qty_after_kg.toFixed(2)}kg produzidos</span>
                           </div>
                        </td>
                        <td className="p-2 text-center border-l border-white/5">
                           <div className="flex flex-col items-center">
                             <span className="text-xl font-mono text-[--danger] font-bold opacity-80">{shrinkage.toFixed(1)}%</span>
                             <span className="text-[9px] font-bold opacity-30 capitalize tracking-tighter">Perda de umidade</span>
                           </div>
                        </td>
                        <td className="p-2   border-l border-white/5">
                           <div className="flex items-center justify-end gap-2">
                            <form action={deleteRoastBatch} className="flex items-center">
                               <input type="hidden" name="id" value={r.id} />
                               <button type="submit" className="p-2 text-[--danger] hover:bg-[--danger]/10 rounded-full transition-all">
                                  <Trash2 className="w-5 h-5 opacity-40 hover:opacity-100" />
                               </button>
                            </form>
                           </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-[--secondary-text] italic opacity-40">
                      <Flame className="w-12 h-12 mx-auto mb-4" />
                      Nenhuma sessão de torra registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
           </div>
        </div>
      </div>
    </div>
  )
}
