import { getRoastBatches, getAvailableGreenLots, createRoastBatch, deleteRoastBatch } from './actions'
import { Pencil, Trash2 } from 'lucide-react'

export default async function TorraPage() {
  const greenLots = await getAvailableGreenLots()
  const roastBatches = await getRoastBatches()

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
        <div className="glass-panel p-6 h-fit">
          <h2 className="text-xl font-serif mb-6 text-[--primary]">Registrar Nova Torra</h2>
          <form action={createRoastBatch} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[--secondary-text] uppercase">Data da Torra</label>
              <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[--secondary-text] uppercase">Lote de Café Verde Utilizado</label>
              <select name="green_coffee_id" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                <option value="">Selecione um Lote...</option>
                {greenLots.map((l: any) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.available_qty_kg}kg disp.)</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1 relative">
                <label className="text-xs text-[--secondary-text] uppercase">Kg Verde (Antes)</label>
                <input name="qty_before_kg" type="number" step="0.01" placeholder="10" required />
              </div>
              <div className="flex flex-col gap-1 relative">
                 <label className="text-xs justify-between flex w-full text-[--primary] uppercase font-bold">Kg Torrado (Depois)</label>
                 <input name="qty_after_kg" type="number" step="0.01" placeholder="8.4" required className="!border-[--primary]" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[--card-border] text-xs text-[--secondary-text]">
               Custo Operacional padrão: R$ 4,00 / Kg torrado<br/>
               Rendimento e Custos serão calculados automaticamente.
            </div>

            <button type="submit" className="primary-btn mt-2">Registrar Lote</button>
          </form>
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
