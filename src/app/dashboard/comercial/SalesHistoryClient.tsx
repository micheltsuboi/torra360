'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { formatDate } from '@/utils/date-utils'
import SaleActions from './SaleActions'

export default function SalesHistoryClient({ salesHistory }: { salesHistory: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)

  const filteredSales = salesHistory.filter(s => {
    const clientName = (s.client?.name || 'Cliente Avulso').toLowerCase()
    const itemNames = s.sale_items?.map((i: any) => 
      (i.pkg?.roast_batch?.green_coffee?.name || '').toLowerCase()
    ).join(' ')
    const searchLow = searchTerm.toLowerCase()
    return clientName.includes(searchLow) || itemNames.includes(searchLow)
  })

  const visibleSales = filteredSales.slice(0, visibleCount)

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Search Bar - System Standard */}
      <div className="flex justify-between items-center gap-4 px-1">
         <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--primary] opacity-40 group-focus-within:opacity-100 transition-opacity" />
            <input 
              type="text"
              placeholder="Buscar por cliente ou café..."
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/5 rounded-xl text-xs focus:border-[--primary]/50 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <span className="text-[10px] text-[--secondary-text] opacity-30 uppercase tracking-widest font-bold">
            {filteredSales.length} Resultados
         </span>
      </div>

      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/10">
         <h2 className="px-6 py-4 font-serif text-[--primary] text-xs tracking-widest uppercase bg-white/5 opacity-60">Histórico Recente de Operações</h2>
         
         <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[--primary]/20">
            <table className="w-full border-collapse">
               <thead>
                  <tr className="bg-black/20 text-[--secondary-text] text-[9px] capitalize border-b border-white/5 font-sans tracking-widest">
                     <th className="px-8 py-5 text-left font-extrabold opacity-40">Data/Cliente</th>
                     <th className="px-8 py-5 text-left font-extrabold opacity-40">Itens Vendidos</th>
                     <th className="px-8 py-5 text-center font-extrabold opacity-40">Status / Recebimento</th>
                     <th className="px-8 py-5 text-right font-extrabold opacity-40">Total Final</th>
                     <th className="px-4 py-5 text-center font-extrabold opacity-40">Ações</th>
                  </tr>
               </thead>
               <tbody className="text-[11px] font-sans">
                  {visibleSales.map((s) => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-10">
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-[--foreground] leading-tight capitalize mb-0.5">{s.client?.name || 'Cliente Avulso'}</span>
                            <span className="text-[7px] text-[--secondary-text] opacity-30 tracking-widest">{formatDate(s.date || s.created_at)}</span>
                         </div>
                      </td>
                      <td className="px-8 py-10">
                         <div className="flex flex-col gap-1.5">
                           {s.sale_items?.map((item: any, idx: number) => (
                             <div key={idx} className="text-[10px] text-[--primary] font-medium leading-tight opacity-70">
                               {item.quantity}x {item.pkg?.roast_batch?.green_coffee?.name || 'Produto'}
                               <span className="text-[8px] opacity-40 ml-1">({item.pkg?.bean_format})</span>
                             </div>
                           ))}
                         </div>
                      </td>
                      <td className="px-8 py-10 text-center">
                         {s.payment_status === 'pending' ? (
                           <span className="text-[10px] text-amber-500/60 tracking-widest border border-amber-500/10 px-2 py-0.5 rounded-full">À receber</span>
                         ) : (
                           <div className="flex flex-col items-center leading-none">
                              <span className="text-[10px] text-[--success] opacity-80 tracking-normal">
                                 {s.payment_method} - {formatDate(s.date)}
                              </span>
                           </div>
                         )}
                      </td>
                      <td className="px-8 py-10 text-right">
                         <span className="text-[15px] font-mono text-[--success] font-bold title-glow">R$ {s.final_amount.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-10">
                         <SaleActions sale={s} />
                      </td>
                    </tr>
                  ))}
                  {filteredSales.length === 0 && (
                    <tr><td colSpan={5} className="p-24 text-center text-sm text-[--secondary-text] italic opacity-40">Nenhuma venda encontrada para os critérios de busca.</td></tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Paginador: Carregar Mais */}
         {visibleCount < filteredSales.length && (
            <div className="p-6 bg-black/30 flex justify-center border-t border-white/5">
              <button 
                onClick={() => setVisibleCount(p => p + 20)}
                className="flex items-center gap-3 text-[10px] uppercase font-serif tracking-[0.2em] font-bold text-[--primary] hover:text-[--foreground] transition-all group"
              >
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                Carregar mais 20 registros
              </button>
            </div>
         )}
      </div>
    </div>
  )
}
