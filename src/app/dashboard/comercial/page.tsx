import { getPDVData, getSalesHistory, getExpenses, createExpense } from './actions'
import PDVComponent from './PDVComponent'
import { Trash2 } from 'lucide-react'

export default async function ComercialPage() {
  const { clients, products } = await getPDVData()
  const salesHistory = await getSalesHistory()
  const expenses = await getExpenses()

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-fit mt-10">
        
        {/* Histórico Vendas */}
        <div className="glass-panel overflow-hidden h-fit">
           <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40">
              <h2 className="font-serif">Últimas Vendas (PDV)</h2>
           </div>
           <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-[#1a1512] sticky top-0">
                    <tr className="text-[--secondary-text] text-xs uppercase border-b border-[--card-border]">
                       <th className="p-3">Data/Cliente</th>
                       <th className="p-3">Itens</th>
                       <th className="p-3">Pgto</th>
                       <th className="p-3 text-right">Total Final</th>
                       <th className="p-3 text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {salesHistory.map((s: any) => (
                      <tr key={s.id} className="border-b border-[--card-border]/50 hover:bg-white/5">
                        <td className="p-3">
                           <span className="block">{new Date(s.date).toLocaleDateString()}</span>
                           <span className="text-xs text-[--secondary-text]">{s.client?.name || 'Cliente Avulso'}</span>
                        </td>
                        <td className="p-3">
                           {s.sale_items?.map((item: any, idx: number) => (
                             <div key={idx} className="text-xs text-[--primary]">
                               {item.quantity}x {item.pkg?.roast_batch?.green_coffee?.name || 'Produto'} ({item.pkg?.bean_format})
                             </div>
                           ))}
                        </td>
                        <td className="p-3 text-xs text-[--secondary-text] uppercase">{s.payment_method}</td>
                        <td className="p-3 text-right text-[--success] font-bold">R$ {s.final_amount.toFixed(2)}</td>
                        <td className="p-3 text-right">
                           <button className="p-2 rounded-md hover:bg-white/5 text-[--danger] opacity-80">
                              <Trash2 className="w-4 h-4" />
                           </button>
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

        {/* Despesas */}
        <div className="flex flex-col gap-6">
          {/* Adicionar Despesa */}
          <div className="glass-panel p-6">
            <h2 className="font-serif mb-4 text-[--danger]">Lançar Despesa</h2>
            <form action={createExpense} className="flex gap-3 items-end">
               <div className="flex flex-col gap-1 w-full">
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
               </div>
               <div className="flex flex-col gap-1 w-full">
                  <select name="category" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                     <option value="Embalagem">Embalagens</option>
                     <option value="Serviços">Serviços / Gás</option>
                     <option value="Impostos">Impostos</option>
                     <option value="Outros">Outros</option>
                  </select>
               </div>
               <div className="flex flex-col gap-1 w-full">
                  <input name="amount" type="number" step="0.01" placeholder="R$ 100,00" required />
               </div>
               <div className="flex flex-col gap-1 w-full hidden">
                  <input name="notes" type="text" placeholder="Obs..." />
               </div>
               <button type="submit" className="danger-btn py-2 text-sm h-[40px] px-8">Salvar</button>
            </form>
          </div>

          <div className="glass-panel overflow-hidden h-fit">
             <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40">
                <h2 className="font-serif">Relatório de Despesas</h2>
             </div>
             <div className="overflow-x-auto max-h-[250px]">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-[#1a1512] sticky top-0">
                      <tr className="text-[--secondary-text] text-xs uppercase border-b border-[--card-border]">
                         <th className="p-3">Data</th>
                         <th className="p-3">Categoria</th>
                         <th className="p-3">Obsevação</th>
                         <th className="p-3 text-right">Valor</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm">
                      {expenses.map((e: any) => (
                        <tr key={e.id} className="border-b border-[--card-border]/50 hover:bg-white/5">
                          <td className="p-3 text-[--secondary-text]">{new Date(e.date).toLocaleDateString()}</td>
                          <td className="p-3 text-[#AC9D91]">{e.category}</td>
                          <td className="p-3 text-xs">{e.notes}</td>
                          <td className="p-3 text-right text-[--danger] font-bold">R$ {e.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      {expenses.length === 0 && (
                        <tr><td colSpan={4} className="p-6 text-center text-sm text-[--secondary-text]">Nenhuma despesa registrada.</td></tr>
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
