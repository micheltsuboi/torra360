import { getPDVData, getSalesHistory, deleteSale } from './actions'
import PDVComponent from './PDVComponent'
import { Trash2 } from 'lucide-react'

export default async function ComercialPage() {
  const { clients, products } = await getPDVData()
  const salesHistory = await getSalesHistory()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">PDV & Financeiro</h1>
          <p className="text-[--secondary-text] mt-1">Frente de Caixa (Ponto de Venda) e Controle de Despesas</p>
        </div>
      </div>

      {/* PDV Module */}
      <div className="h-[600px] w-full">
         <PDVComponent clients={clients} products={products} />
      </div>

      {/* Históricos Grid */}
      <div className="grid grid-cols-1 gap-8 h-fit mt-10">
        
        {/* Histórico Vendas */}
        <div className="glass-panel overflow-hidden h-fit">
           <div className="p-2 border-b border-[--card-border] wood-texture bg-black/40">
              <h2 className="font-serif">Últimas Vendas (PDV)</h2>
           </div>
           <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full   border-collapse">
                 <thead className="bg-[#1a1512] sticky top-0">
                    <tr className="text-[--secondary-text] text-xs capitalize border-b border-[--border]">
                       <th className="p-2">Data/Cliente</th>
                       <th className="p-2">Itens</th>
                       <th className="p-2">Pgto</th>
                       <th className="p-2  ">Total Final</th>
                       <th className="p-2  ">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {salesHistory.map((s: any) => (
                      <tr key={s.id} className="border-b border-[--card-border]/50 hover:bg-white/5">
                        <td className="p-2">
                           <span className="block">{s.date ? new Date(s.date).toLocaleDateString('pt-BR') : new Date(s.created_at).toLocaleDateString('pt-BR')}</span>
                           <span className="text-xs text-[--secondary-text]">{s.client?.name || 'Cliente Avulso'}</span>
                        </td>
                        <td className="p-2">
                           {s.sale_items?.map((item: any, idx: number) => (
                             <div key={idx} className="text-xs text-[--primary]">
                               {item.quantity}x {item.pkg?.roast_batch?.green_coffee?.name || 'Produto'} ({item.pkg?.bean_format})
                             </div>
                           ))}
                        </td>
                        <td className="p-2 text-xs text-[--secondary-text] capitalize">{s.payment_method}</td>
                        <td className="p-2   text-[--success] font-bold">R$ {s.final_amount.toFixed(2)}</td>
                        <td className="p-2">
                           <form action={deleteSale} className="flex items-center justify-center gap-2">
                              <input type="hidden" name="id" value={s.id} />
                              <button type="submit" className="action-icon-btn text-[--danger]">
                                 <Trash2 className="action-icon" />
                              </button>
                           </form>
                        </td>
                      </tr>
                    ))}
                    {salesHistory.length === 0 && (
                      <tr><td colSpan={5} className="p-6 text-center text-sm text-[--secondary-text]">Nenhuma venda registrada no PDV.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

      </div>

    </div>
  )
}
