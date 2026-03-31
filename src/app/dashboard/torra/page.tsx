import { getRoastBatches, getAvailableGreenLots, createRoastBatch, deleteRoastBatch } from './actions'
import { Pencil, Trash2, Flame } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TorraPage() {
  const greenLots = await getAvailableGreenLots()
  const roastBatches = await getRoastBatches()

  // Reusable icon for accordions
  const ChevronIcon = () => (
    <span className="transition duration-300 group-open:rotate-180 text-[--primary]">
      <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
        <path d="M6 9l6 6 6-6"></path>
      </svg>
    </span>
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Processo de Torra</h1>
          <p className="text-[--secondary-text] mt-1">Produção e acompanhamento de rendimentos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Formulário de Torra */}
        <div className="flex flex-col gap-4">
          <details className="glass-panel group overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="card-texture-header cursor-pointer list-none font-serif text-base text-[--primary] p-4 flex justify-between items-center transition-colors">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <span>Registrar Nova Torra</span>
              </div>
              <ChevronIcon />
            </summary>
            <div className="p-6 border-t border-[--card-border]">
              <form action={createRoastBatch} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[--secondary-text] uppercase font-bold">Data da Torra</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[--secondary-text] uppercase font-bold">Lote de Café Verde Utilizado</label>
                  <select name="green_coffee_id" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                    <option value="">Selecione um Lote...</option>
                    {greenLots.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.name} ({l.available_qty_kg}kg disp.)</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1 relative">
                    <label className="text-xs text-[--secondary-text] uppercase font-bold">Kg Verde (Antes)</label>
                    <input name="qty_before_kg" type="number" step="0.01" placeholder="10" required />
                  </div>
                  <div className="flex flex-col gap-1 relative">
                     <label className="text-xs justify-between flex w-full text-[--primary] uppercase font-bold">Kg Torrado (Depois)</label>
                     <input name="qty_after_kg" type="number" step="0.01" placeholder="8.4" required className="!border-[--primary]" />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[--card-border] text-[10px] text-[--secondary-text] uppercase font-bold italic">
                   Custo Operacional padrão: R$ 4,00 / Kg torrado<br/>
                   Rendimento e Custos serão calculados automaticamente.
                </div>

                <button type="submit" className="primary-btn mt-2">Registrar Lote de Torra</button>
              </form>
            </div>
          </details>
        </div>

        {/* Histórico / Relatório de Torra */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="glass-panel overflow-hidden">
             <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40">
              <h2 className="font-serif">Histórico de Produção</h2>
             </div>
             <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[--secondary-text] text-xs uppercase border-b border-[--card-border]">
                     <th className="p-4 font-medium">Data</th>
                     <th className="p-4 font-medium">Lote Base</th>
                     <th className="p-4 font-medium text-right">Rendimento</th>
                     <th className="p-4 font-medium text-center border-l border-[--card-border]/20">Quebra (%)</th>
                     <th className="p-4 font-medium text-right border-l border-[--card-border]/20">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {roastBatches && roastBatches.length > 0 ? (
                    roastBatches.map((r: any) => {
                      // Se os calculos não virem da view por erro, vamos fazer manual aqui:
                      const yieldPerc = r.yield_percentage || (r.qty_after_kg / r.qty_before_kg * 100);
                      
                      return (
                        <tr key={r.roast_batch_id || r.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-[--secondary-text]">{new Date(r.date).toLocaleDateString()}</td>
                          <td className="p-4 font-medium text-[--primary]">{r.green_coffee?.name || 'N/A'}</td>
                          <td className="p-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                               {yieldPerc > 80 ? '🔥' : '⚠️'} {yieldPerc?.toFixed(1)}%
                             </div>
                          </td>
                          <td className="p-4 text-center border-l border-[--card-border]/20 text-[--danger]">{r.shrinkage_pct ? r.shrinkage_pct.toFixed(1) : '-'}%</td>
                          <td className="p-4 text-right border-l border-[--card-border]/20 flex items-center justify-end gap-2 h-full">
                            <span className="action-icon-btn text-[--primary] opacity-60" title="Edição em breve">
                               <Pencil className="action-icon" />
                            </span>
                            <form action={deleteRoastBatch}>
                               <input type="hidden" name="id" value={r.id} />
                               <button type="submit" className="action-icon-btn text-[--danger] opacity-60">
                                  <Trash2 className="action-icon" />
                               </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-[--secondary-text] italic">
                        Nenhuma torra registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
