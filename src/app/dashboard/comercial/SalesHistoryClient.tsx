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
         
         <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[--primary]/20 p-2">
            <table className="w-full border-collapse">
               <thead>
                  <tr className="text-[--secondary-text] text-[10px] capitalize tracking-widest opacity-60 border-b border-white/10">
                     <th className="px-6 py-4 text-left font-bold">Data/Cliente</th>
                     <th className="px-6 py-4 text-left font-bold">Itens Vendidos</th>
                     <th className="px-6 py-4 text-center font-bold">Status / Recebimento</th>
                     <th className="px-6 py-4 text-right font-bold transition-all">Total Final</th>
                     <th className="px-4 py-4 text-center font-bold w-32">Ações</th>
                  </tr>
               </thead>
               <tbody className="text-[11px]">
                  {visibleSales.map((s, index) => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.08] transition-colors group" style={{ backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-[--foreground] leading-tight capitalize">{s.client?.name || 'Cliente Avulso'}</span>
                            <span className="text-[8px] text-[--secondary-text] opacity-40">{formatDate(s.created_at)}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1.5">
                           {s.sale_items?.map((item: any, idx: number) => (
                             <div key={idx} className="text-[10px] text-[--primary] font-medium leading-tight opacity-70">
                               <span className="bg-[--primary]/10 px-2 py-0.5 rounded border border-[--primary]/20 mr-2 text-[9px] font-bold">{item.quantity}x</span> 
                               {item.pkg?.roast_batch?.green_coffee?.name || 'Produto'}
                               <span className="text-[8px] opacity-30 ml-1 italic font-normal">({item.pkg?.bean_format})</span>
                             </div>
                           ))}
                         </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                         {s.payment_status === 'pending' ? (
                           <span className="text-[10px] text-amber-500 tracking-wider border border-amber-500/20 px-3 py-1 rounded-full bg-amber-500/10">À receber</span>
                         ) : (
                           <div className="flex flex-col items-center leading-none gap-0.5">
                              <span className="text-[10px] text-[--success] opacity-80 font-medium">
                                 {s.payment_method}
                              </span>
                              <span className="text-[8px] text-[--secondary-text] opacity-40">
                                 {formatDate(s.payment_date)}
                              </span>
                           </div>
                         )}
                      </td>
                      <td className="px-6 py-8 text-right">
                         <span className="text-lg font-mono text-[--success] font-bold title-glow">R$ {s.final_amount.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-8 text-center">
                         <SaleActions sale={s} />
                      </td>
                    </tr>
                  ))}
                  {filteredSales.length === 0 && (
                    <tr><td colSpan={5} className="p-40 text-center text-sm text-[--secondary-text] italic opacity-40">Nenhuma venda encontrada para os critérios de busca.</td></tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Paginador: Carregar Mais */}
         {visibleCount < filteredSales.length && (
            <div className="p-8 bg-black/40 flex justify-center border-t border-white/5 shadow-inner">
              <button 
                onClick={() => setVisibleCount(p => p + 20)}
                className="golden-btn flex items-center justify-center gap-2 px-6 py-3 text-sm mx-auto"
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
