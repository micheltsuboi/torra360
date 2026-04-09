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
      <div className="flex justify-between items-center gap-4 px-1 mb-4">
         <div className="flex-1 max-w-sm relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 pointer-events-none">
               <Search size={18} className="text-[--primary] opacity-40 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <input 
              type="text"
              placeholder="Buscar por cliente ou café..."
              className="w-full pl-14 pr-4 py-4 bg-black/60 border border-white/10 rounded-xl text-sm focus:border-[--primary]/50 transition-all outline-none shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <span className="text-[10px] text-[--secondary-text] opacity-25 uppercase tracking-widest font-bold">
            {filteredSales.length} Resultados
         </span>
      </div>

      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 shadow-2xl">
         <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40">
           <h2 className="font-serif text-[--primary] text-lg tracking-normal">Histórico Recente de Operações</h2>
         </div>
         
         <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[--primary]/20">
            <table className="w-full border-collapse">
               <thead>
                  <tr className="bg-black/30 text-[--secondary-text] text-[10px] capitalize border-b border-white/10 font-sans tracking-widest">
                     <th className="px-8 py-5 text-left font-bold opacity-30">Data/Cliente</th>
                     <th className="px-8 py-5 text-left font-bold opacity-30">Itens Vendidos</th>
                     <th className="px-8 py-5 text-center font-bold opacity-30">Status / Recebimento</th>
                     <th className="px-8 py-5 text-right font-bold opacity-30">Total Final</th>
                     <th className="px-4 py-5 text-center font-bold opacity-30">Ações</th>
                  </tr>
               </thead>
               <tbody className="text-[11px] font-sans">
                  {visibleSales.map((s) => (
                    <tr key={s.id} className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors group">
                      <td className="px-8 py-24">
                         <div className="flex flex-col gap-2">
                            <span className="text-base font-extrabold text-[--foreground] leading-tight capitalize">{s.client?.name || 'Cliente Avulso'}</span>
                            <span className="text-[8px] text-[--secondary-text] opacity-20 tracking-[0.3em] font-medium">{formatDate(s.date || s.created_at)}</span>
                         </div>
                      </td>
                      <td className="px-8 py-24 text-left">
                         <div className="flex flex-col gap-3">
                           {s.sale_items?.map((item: any, idx: number) => (
                             <div key={idx} className="text-[11px] text-[--primary] font-medium leading-tight opacity-70 flex items-center gap-2">
                               <span className="bg-[--primary]/10 px-2 py-0.5 rounded border border-[--primary]/20 text-[10px] font-bold text-[--primary]">{item.quantity}x</span> 
                               <span>
                                 {item.pkg?.roast_batch?.green_coffee?.name || 'Produto'}
                                 <span className="text-[9px] opacity-30 ml-2 italic font-normal">({item.pkg?.bean_format})</span>
                               </span>
                             </div>
                           ))}
                         </div>
                      </td>
                      <td className="px-8 py-24 text-center">
                         {s.payment_status === 'pending' ? (
                           <span className="text-[10px] text-amber-500/60 tracking-widest border border-amber-500/20 px-5 py-2 rounded-full bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]">À receber</span>
                         ) : (
                           <div className="flex flex-col items-center leading-none gap-2.5">
                              <span className="text-[11px] text-[--success] opacity-80 tracking-wide font-bold">
                                 {s.payment_method}
                              </span>
                              <span className="text-[9px] opacity-20 tracking-widest font-medium">
                                 {formatDate(s.date)}
                              </span>
                           </div>
                         )}
                      </td>
                      <td className="px-8 py-24 text-right">
                         <span className="text-2xl font-mono text-[--success] font-black title-glow tracking-tighter">R$ {s.final_amount.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-24">
                         <div className="scale-125 transition-transform hover:scale-150">
                            <SaleActions sale={s} />
                         </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSales.length === 0 && (
                    <tr><td colSpan={5} className="p-48 text-center text-lg text-[--secondary-text] italic opacity-40 font-serif">Nenhuma venda encontrada para os critérios de busca.</td></tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Paginador: Carregar Mais */}
         {visibleCount < filteredSales.length && (
            <div className="p-10 bg-black/40 flex justify-center border-t border-white/5 shadow-inner">
              <button 
                onClick={() => setVisibleCount(p => p + 20)}
                className="flex items-center gap-4 text-[11px] uppercase font-serif tracking-[0.3em] font-bold text-[--primary] hover:text-[--foreground] transition-all group"
              >
                <ChevronDown className="w-6 h-6 transition-transform group-hover:translate-y-2" />
                Carregar mais 20 registros
              </button>
            </div>
         )}
      </div>
    </div>
  )
}
