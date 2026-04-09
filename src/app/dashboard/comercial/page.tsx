import { getPDVData, getSalesHistory } from './actions'
import PDVComponent from './PDVComponent'
import DeleteSaleButton from './DeleteSaleButton'
import PaymentStatusControl from './PaymentStatusControl'
import { formatDate } from '@/utils/date-utils'

export default async function ComercialPage() {
  const { clients, products } = await getPDVData()
  const salesHistory = await getSalesHistory()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">PDV & Comercial</h1>
          <p className="text-[--secondary-text] mt-1 text-sm opacity-60">Frente de Caixa (Ponto de Venda) e Histórico de Operações</p>
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
           <div className="p-4 border-b border-[--card-border] bg-white/5 flex items-center justify-between">
              <h2 className="font-serif text-[--primary] text-sm tracking-widest capitalize">Últimas Vendas (PDV)</h2>
              <span className="text-[10px] text-[--secondary-text] opacity-40 capitalize tracking-widest">{salesHistory.length} Registros</span>
           </div>
           <div className="overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-[--primary]/20">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-black/20 text-[--secondary-text] text-[9px] capitalize border-b border-white/5 font-sans tracking-widest">
                       <th className="px-4 py-3 text-left font-bold opacity-40">Data/Cliente</th>
                       <th className="px-4 py-3 text-left font-bold opacity-40">Itens</th>
                       <th className="px-4 py-3 text-left font-bold opacity-40">Status / Pagamento</th>
                       <th className="px-4 py-3 text-right font-bold opacity-40">Total Final</th>
                       <th className="px-4 py-3 text-center font-bold opacity-40">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="text-[11px] font-sans">
                    {salesHistory.map((s: any) => (
                      <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="px-4 py-3">
                           <span className="block opacity-50">{formatDate(s.date || s.created_at)}</span>
                           <span className="text-xs font-bold text-[--foreground]">{s.client?.name || 'Cliente Avulso'}</span>
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex flex-col gap-0.5">
                             {s.sale_items?.map((item: any, idx: number) => (
                               <div key={idx} className="text-[10px] text-[--primary] font-medium leading-tight">
                                 {item.quantity}x {item.pkg?.roast_batch?.green_coffee?.name || 'Produto'}
                                 <span className="text-[8px] opacity-40 ml-1">({item.pkg?.bean_format})</span>
                               </div>
                             ))}
                           </div>
                        </td>
                        <td className="px-4 py-3">
                           <PaymentStatusControl sale={s} />
                        </td>
                        <td className="px-4 py-3 text-right">
                           <span className="text-[14px] font-mono text-[--success] font-bold">R$ {s.final_amount.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex justify-center items-center">
                              <DeleteSaleButton saleId={s.id} />
                           </div>
                        </td>
                      </tr>
                    ))}
                    {salesHistory.length === 0 && (
                      <tr><td colSpan={5} className="p-10 text-center text-sm text-[--secondary-text] italic opacity-40">Nenhuma venda registrada no PDV.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

      </div>

    </div>
  )
}
