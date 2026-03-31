'use client'

import { useState } from 'react'
import { Trash2, Flame, Search } from 'lucide-react'
import { deleteRoastBatch } from './actions'

export default function RoastList({ roastBatches }: { roastBatches: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBatches = roastBatches?.filter(r => 
    r.green_coffee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(r.date).toLocaleDateString().includes(searchTerm)
  )

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Barra de Busca Externa - De fora a fora */}
      <div className="flex items-center bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner w-full">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[--primary] opacity-60" />
          <input 
            type="text"
            placeholder="Buscar por café, lote ou data..."
            className="!py-3 !pl-12 !pr-4 !text-sm w-full !bg-black/60 !rounded-lg !border-white/10 focus:!border-[--primary]/50 transition-all font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20">
        <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40">
          <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Histórico de Produção</h2>
        </div>
        
        <div className="responsive-table-container scrollbar-thin scrollbar-thumb-[--primary]/20">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="text-[--secondary-text] text-[10px] capitalize border-b border-[--card-border]/50 bg-white/5 tracking-widest">
                <th className="p-2 font-bold border-r border-white/5">Data da Torra</th>
                <th className="p-2 font-bold">Lote Base (Café Verde)</th>
                <th className="p-2 font-bold text-center">Rendimento Final</th>
                <th className="p-2 font-bold text-center border-l border-white/5">Quebra (%)</th>
                <th className="p-2 font-bold border-l border-white/5">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredBatches && filteredBatches.length > 0 ? (
                filteredBatches.map((r: any) => {
                  const yieldPerc = r.yield_percentage || (r.qty_after_kg / r.qty_before_kg * 100);
                  const shrinkage = 100 - yieldPerc;
                  
                  return (
                    <tr key={r.roast_batch_id || r.id} className="border-b border-[--card-border]/30 hover:bg-white/5 transition-colors group">
                      <td className="p-2 border-r border-white/5">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-[--foreground]">{new Date(r.date).toLocaleDateString()}</span>
                          <span className="text-[9px] capitalize tracking-widest text-[--secondary-text] opacity-40">Lote: #{r.id.slice(-6).toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-semibold text-[--primary]">{r.green_coffee?.name || 'N/A'}</span>
                          <span className="text-[10px] capitalize text-[--secondary-text] opacity-60">{r.qty_before_kg}kg orig.</span>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex flex-col items-center">
                          <div className={`text-base font-bold ${yieldPerc < 80 ? 'text-[--danger]' : 'text-[--success]'}`}>
                            {yieldPerc?.toFixed(1)}%
                          </div>
                          <span className="text-[9px] font-bold text-[--secondary-text] opacity-40 capitalize tracking-tight">{r.qty_after_kg.toFixed(2)}kg produzidos</span>
                        </div>
                      </td>
                      <td className="p-2 text-center border-l border-white/5">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-mono text-[--danger] font-bold opacity-80">{shrinkage.toFixed(1)}%</span>
                          <span className="text-[9px] font-bold opacity-30 capitalize tracking-tighter">Perda de umidade</span>
                        </div>
                      </td>
                      <td className="p-2 border-l border-white/5">
                        <div className="flex justify-center items-center gap-1">
                        <form action={deleteRoastBatch} className="flex items-center">
                          <input type="hidden" name="id" value={r.id} />
                          <button type="submit" className="action-icon-btn text-[--danger]">
                              <Trash2 className="action-icon" />
                          </button>
                        </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-[--secondary-text] italic opacity-40">
                    <Flame className="w-12 h-12 mx-auto mb-4" />
                    {searchTerm ? 'Nenhuma produção encontrada para esta busca.' : 'Nenhuma sessão de torra registrada.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
