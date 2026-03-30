import { getRoastBatchesAvailable, getPackages, createPackages, deletePackage } from './actions'
import { getExpensePackages } from '../custos/actions'
import { Pencil, Trash2 } from 'lucide-react'

export default async function PacotesPage() {
  const roasts = await getRoastBatchesAvailable()
  const packages = await getPackages()
  const expensePackages = await getExpensePackages()

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

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase">Formato do Café</label>
                <select name="bean_format" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                  <option value="Grãos Inteiros">Grãos Inteiros</option>
                  <option value="Café Moído">Café Moído</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase">Tamanho Pct (g)</label>
                <select name="package_size_g" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                  <option value="250">250g</option>
                  <option value="500">500g</option>
                  <option value="1000">1kg</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase">Qtd de Pacotes</label>
                <input name="quantity_units" type="number" min="1" placeholder="Ex: 50" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase">Valor de Venda (R$)</label>
                <input name="retail_price" type="number" step="0.01" min="0" placeholder="Ex: 45.90" required />
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <label className="text-xs text-[--secondary-text] uppercase">Pacote de Despesas (Custo)</label>
              <select name="expense_package_id" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]">
                <option value="">Nenhum custo adicional</option>
                {expensePackages.map((ep: any) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.name} (R$ {ep.total_cost.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 pt-4 border-t border-[--card-border] text-xs text-[--secondary-text]">
               Cálculo da conversão de rendimentos (Pacotes Finais e Retorno Bruto Estimado) atualizado agora nesta tabela.
            </div>

            <button type="submit" className="primary-btn mt-2">Registrar Produção</button>
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
                     <th className="p-4 font-medium">Lote Base</th>
                     <th className="p-4 font-medium border-l border-[--card-border]/20">Formato / Tamanho</th>
                     <th className="p-4 font-medium text-center border-l border-[--card-border]/20">Qtd (Unds)</th>
                     <th className="p-4 font-medium text-right border-l border-[--card-border]/20">Venda Unit. (R$)</th>
                     <th className="p-4 font-medium text-right border-l border-[--card-border]/20">Venda Total Est.</th>
                     <th className="p-4 font-medium text-right border-l border-[--card-border]/20">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {packages && packages.length > 0 ? (
                    packages.map((p: any) => {
                      const totalEstimado = (p.retail_price * p.quantity_units).toFixed(2);
                      return (
                        <tr key={p.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <span className="font-medium text-[--primary] block">{p.roast_batch?.green_coffee?.name || 'Lote Não Encontrado'}</span>
                            <span className="text-[--secondary-text] text-xs">Aberto em: {new Date(p.date).toLocaleDateString()}</span>
                          </td>
                          <td className="p-4 border-l border-[--card-border]/20">
                            <span className="font-bold text-[--foreground] block">{p.bean_format || '-'}</span>
                            <span className="text-[--secondary-text] text-xs">{p.package_size_g ? `${p.package_size_g}g` : '-'}</span>
                          </td>
                          <td className="p-4 text-center border-l border-[--card-border]/20 font-bold">{p.quantity_units || '0'} unds</td>
                          <td className="p-4 text-right border-l border-[--card-border]/20 text-[--success]">R$ {(p.retail_price || 0).toFixed(2)}</td>
                          <td className="p-4 text-right border-l border-[--card-border]/20 font-bold text-[--success]">R$ {totalEstimado}</td>
                          <td className="p-4 text-right border-l border-[--card-border]/20 flex items-center justify-end gap-2 h-full">
                            <span className="action-icon-btn text-[--primary] opacity-60" title="Edição em breve">
                               <Pencil className="action-icon" />
                            </span>
                            <form action={deletePackage}>
                               <input type="hidden" name="id" value={p.id} />
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
                      <td colSpan={6} className="p-10 text-center text-[--secondary-text] italic">
                        Nenhum pacote (produto final) registrado ainda.
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
