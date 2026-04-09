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
      <div className="flex justify-between items-center gap-4 px-1 mb-2">
         <div className="flex-1 max-w-sm relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
               <Search className="w-4 h-4 text-[--primary] opacity-30 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <input 
              type="text"
              placeholder="Buscar por cliente ou café..."
              className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs focus:border-[--primary]/40 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <span className="text-[10px] text-[--secondary-text] opacity-25 uppercase tracking-widest font-bold">
            {filteredSales.length} Resultados
         </span>
      </div>

      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20">
         <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40">
           <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Histórico Recente de Operações</h2>
         </div>
         
         <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[--primary]/20">
            <table className="w-full border-collapse">
               <thead>
                  <tr className="bg-black/20 text-[--secondary-text] text-[10px] capitalize border-b border-white/5 font-sans tracking-widest">
                     <th className="px-8 py-4 text-left font-bold opacity-30">Data/Cliente</th>
                     <th className="px-8 py-4 text-left font-bold opacity-30">Itens Vendidos</th>
                     <th className="px-8 py-4 text-center font-bold opacity-30">Status / Recebimento</th>
                     <th className="px-8 py-4 text-right font-bold opacity-30">Total Final</th>
                     <th className="px-4 py-4 text-center font-bold opacity-30">Ações</th>
                  </tr>
               </thead>
               <tbody className="text-[11px] font-sans">
                  {visibleSales.map((s) => (
                    <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-16">
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-[--foreground] leading-tight capitalize mb-1">{s.client?.name || 'Cliente Avulso'}</span>
                            <span className="text-[6px] text-[--secondary-text] opacity-20 tracking-[0.2em] font-medium">{formatDate(s.date || s.created_at)}</span>
                         </div>
                      </td>
                      <td className="px-8 py-16">
                         <div className="flex flex-col gap-2">
                           {s.sale_items?.map((item: any, idx: number) => (
                             <div key={idx} className="text-[10px] text-[--primary] font-medium leading-tight opacity-60">
                               {item.quantity}x {item.pkg?.roast_batch?.green_coffee?.name || 'Produto'}
                               <span className="text-[8px] opacity-30 ml-2">({item.pkg?.bean_format})</span>
                             </div>
                           ))}
                         </div>
                      </td>
                      <td className="px-8 py-16 text-center">
                         {s.payment_status === 'pending' ? (
                           <span className="text-[10px] text-amber-500/50 tracking-widest border border-amber-500/10 px-3 py-1 rounded-full bg-amber-500/5">À receber</span>
                         ) : (
                           <div className="flex flex-col items-center leading-none gap-1.5">
                              <span className="text-[10px] text-[--success] opacity-70 tracking-normal">
                                 {s.payment_method} - {formatDate(s.date)}
                              </span>
                           </div>
                         )}
                      </td>
                      <td className="px-8 py-16 text-right">
                         <span className="text-[16px] font-mono text-[--success] font-bold title-glow">R$ {s.final_amount.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-16">
                         <SaleActions sale={s} />
                      </td>
                    </tr>
                  ))}
                  {filteredSales.length === 0 && (
                    <tr><td colSpan={5} className="p-32 text-center text-sm text-[--secondary-text] italic opacity-40">Nenhuma venda encontrada para os critérios de busca.</td></tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Paginador: Carregar Mais */}
         {visibleCount < filteredSales.length && (
            <div className="p-8 bg-black/30 flex justify-center border-t border-white/5">
              <button 
                onClick={() => setVisibleCount(p => p + 20)}
                className="flex items-center gap-3 text-[10px] uppercase font-serif tracking-[0.2em] font-bold text-[--primary] hover:text-[--foreground] transition-all group"
              >
                <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
                Carregar mais 20 registros
              </button>
            </div>
         )}
      </div>
    </div>
  )
}
