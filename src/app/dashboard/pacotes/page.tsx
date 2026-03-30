import { getRoastBatchesAvailable, getPackages, createPackages } from './actions'

export default async function PacotesPage() {
  const roasts = await getRoastBatchesAvailable()
  const packages = await getPackages()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Embalamento de Café</h1>
          <p className="text-[--secondary-text] mt-1">Geração de pacotes a partir de Lotes Torrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Formulário de Pacotes */}
        <div className="glass-panel p-6 h-fit">
          <h2 className="text-xl font-serif mb-6 text-[--primary]">Registrar Embalamento</h2>
          <form action={createPackages} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[--secondary-text] uppercase">Data</label>
              <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[--secondary-text] uppercase">Lote Torrado Original</label>
              <select name="roast_batch_id" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                <option value="">Selecione um Lote...</option>
                {roasts.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.green_coffee?.name} • Torrado: {new Date(r.date).toLocaleDateString()} ({r.qty_after_kg}kg disp.)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase text-center w-full">Pct 1Kg</label>
                <input name="qty_1kg" type="number" min="0" defaultValue="0" required className="text-center" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase text-center w-full">Pct 500g</label>
                <input name="qty_500g" type="number" min="0" defaultValue="0" required className="text-center" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase text-center w-full">Pct 250g</label>
                <input name="qty_250g" type="number" min="0" defaultValue="0" required className="text-center" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[--card-border] text-xs text-[--secondary-text]">
               Cálculo da conversão de rendimentos (Pacotes Finais e Custos/Pacote) é atualizado nos dashboards comerciais.
            </div>

            <button type="submit" className="primary-btn mt-2">Gravar Pacotes</button>
          </form>
        </div>

        {/* Histórico / Relatório de Pacotes */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="glass-panel overflow-hidden">
             <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40">
              <h2 className="font-serif">Histórico de Produção / Estoque de Venda</h2>
             </div>
             <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[--secondary-text] text-xs uppercase border-b border-[--card-border]">
                     <th className="p-4 font-medium">Data / Lote</th>
                     <th className="p-4 font-medium text-center border-l border-[--card-border]/20">1 Kg</th>
                     <th className="p-4 font-medium text-center border-l border-[--card-border]/20">500g</th>
                     <th className="p-4 font-medium text-center border-l border-[--card-border]/20">250g</th>
                     <th className="p-4 font-medium text-right border-l border-[--card-border]/20">Total Embalado</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {packages && packages.length > 0 ? (
                    packages.map((p: any) => {
                      const embalado = (p.qty_1kg * 1) + (p.qty_500g * 0.5) + (p.qty_250g * 0.25);
                      return (
                        <tr key={p.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <span className="font-medium text-[--primary] block">{p.roast_batch?.green_coffee?.name || 'N/A'}</span>
                            <span className="text-[--secondary-text] text-xs">{new Date(p.date).toLocaleDateString()}</span>
                          </td>
                          <td className="p-4 text-center border-l border-[--card-border]/20 font-bold">{p.qty_1kg || '-'}</td>
                          <td className="p-4 text-center border-l border-[--card-border]/20 font-bold">{p.qty_500g || '-'}</td>
                          <td className="p-4 text-center border-l border-[--card-border]/20 font-bold">{p.qty_250g || '-'}</td>
                          <td className="p-4 text-right border-l border-[--card-border]/20 text-[--success]">{embalado} kg</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-[--secondary-text] italic">
                        Nenhum pacote produzido ainda.
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
