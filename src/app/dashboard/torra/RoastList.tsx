'use client'

import { useState } from 'react'
import { Trash2, Pencil, Flame, Search } from 'lucide-react'
import { deleteRoastBatch, updateRoastBatch } from './actions'
import Modal from '@/components/ui/Modal'
import { formatDate } from '@/utils/date-utils'
import RoastParameterList from '@/components/ui/RoastParameterList'

export default function RoastList({ roastBatches, greenLots }: { roastBatches: any[], greenLots: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingRoast, setEditingRoast] = useState<any | null>(null)
  const [viewingRoast, setViewingRoast] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [parameters, setParameters] = useState<any[]>([])

  const filteredBatches = roastBatches?.filter(r => 
    r.green_coffee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDate(r.date).includes(searchTerm)
  )

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Barra de Busca Externa - De fora a fora */}
      <div className="flex items-center bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner w-full">
        <div className="flex items-center w-full bg-black/60 rounded-lg border border-white/10 px-4 gap-3 focus-within:border-[--primary]/50 transition-all">
          <Search className="w-5 h-5 text-[--primary] opacity-60 shrink-0" />
          <input 
            type="text"
            placeholder="Buscar por café, lote ou data..."
            className="!py-3 !bg-transparent !border-none !p-0 focus:!ring-0 w-full !text-sm font-sans outline-none"
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
            <thead className="text-[10px] capitalize tracking-widest text-[--secondary-text] opacity-60 font-sans border-b border-white/10 bg-black/20">
              <tr>
                <th className="p-2 font-bold opacity-40 text-left">Data da Torra</th>
                <th className="p-2 font-bold opacity-40 text-left">Lote Base (Café Verde)</th>
                <th className="p-2 font-bold opacity-40 text-center">Rendimento Final</th>
                <th className="p-2 font-bold opacity-40 text-center">Quebra (%)</th>
                <th className="p-2 font-bold opacity-40 text-center">Custo Torrado</th>
                <th className="p-2 font-bold opacity-40 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-sans">
              {filteredBatches && filteredBatches.length > 0 ? (
                filteredBatches.map((r: any, index: number) => {
                  const yieldPerc = r.yield_percentage || (r.qty_after_kg / r.qty_before_kg * 100);
                  const shrinkage = 100 - yieldPerc;
                  
                  return (
                    <tr 
                      key={r.roast_batch_id || r.id} 
                      className="border-b border-white/5 hover:bg-white/[0.08] transition-colors group cursor-pointer" 
                      style={{ backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}
                      onClick={() => setViewingRoast(r)}
                    >
                      <td className="p-2">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-[--foreground]">{formatDate(r.date)}</span>
                          <span className="capitalize tracking-widest text-[--secondary-text] opacity-40">Lote: #{r.id.slice(-6).toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="p-2 border-l border-white/5">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-[--primary]">{r.green_coffee?.name || r.green_coffee_name || 'N/A'}</span>
                          <span className="capitalize text-[--secondary-text] opacity-60">{r.qty_before_kg}kg orig.</span>
                        </div>
                      </td>
                      <td className="p-2 text-center border-l border-white/5">
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
                      <td className="p-2 border-l border-white/5 bg-[--primary]/5">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-[--primary]">R$ {r.total_torra_cost?.toFixed(2) || r.total_roast_cost?.toFixed(2) || '0.00'}</span>
                          <span className="text-[9px] font-bold opacity-40 uppercase">R$ {r.cost_per_kg_roasted?.toFixed(2) || '0.00'}/kg</span>
                        </div>
                      </td>
                      <td className="p-2 border-l border-white/5">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              setParameters(r.roast_parameters || [])
                              setEditingRoast(r)
                            }}
                            className="action-icon-btn text-[--primary]"
                          >
                            <Pencil className="action-icon" />
                          </button>
                          <form 
                            action={deleteRoastBatch} 
                            className="flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
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
                  <td colSpan={6} className="p-20 text-center text-[--secondary-text] italic opacity-40">
                    <Flame className="w-12 h-12 mx-auto mb-4" />
                    {searchTerm ? 'Nenhuma produção encontrada para esta busca.' : 'Nenhuma sessão de torra registrada.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição */}
      <Modal 
        isOpen={editingRoast !== null} 
        onClose={() => {
          setEditingRoast(null)
          setError(null)
        }} 
        title="Editar Sessão de Torra"
      >
        {editingRoast && (
          <form action={async (formData) => {
            setError(null)
            const result = await updateRoastBatch(formData)
            if (result?.success) {
              setEditingRoast(null)
            } else {
              setError(result?.error || 'Erro ao atualizar')
            }
          }} className="flex flex-col gap-6">
            <input type="hidden" name="id" value={editingRoast.id} />

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[--secondary-text]">Café Verde (Lote de Origem)</label>
              <select name="green_coffee_id" defaultValue={editingRoast.green_coffee_id} required className="text-sm">
                <option value="">Selecione um café...</option>
                {greenLots.map((lot: any) => (
                  <option key={lot.id} value={lot.id}>
                    {lot.name} ({lot.available_qty_kg.toFixed(2)}kg disponíveis)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text]">Data da Torra</label>
                <input name="date" type="date" defaultValue={editingRoast.date} required className="text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text]">Custo Operac. (R$/kg)</label>
                <input name="operational_cost" type="number" step="0.01" defaultValue={editingRoast.operational_cost || 4.00} required className="text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-3 bg-black/20 rounded-lg border border-white/5">
                <label className="text-xs text-[--secondary-text] mb-1">Qtd Entrada (Verde kg)</label>
                <input name="qty_before_kg" type="number" step="0.01" defaultValue={editingRoast.qty_before_kg} required className="text-lg font-bold text-[--primary]" />
              </div>
              <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-lg border border-white/5">
                <label className="text-xs text-[--secondary-text] mb-1">Qtd Saída (Torrado kg)</label>
                <input name="qty_after_kg" type="number" step="0.01" defaultValue={editingRoast.qty_after_kg} required className="text-lg font-bold text-[--success]" />
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <RoastParameterList 
                initialParameters={editingRoast.roast_parameters || []} 
                onChange={setParameters} 
              />
              <input type="hidden" name="roast_parameters" value={JSON.stringify(parameters)} />
            </div>

            <button type="submit" className="golden-btn py-4 text-lg mt-2 w-full">
              Salvar Alterações
            </button>
          </form>
        )}
      </Modal>

      {/* Modal de Visualização */}
      <Modal
        isOpen={viewingRoast !== null}
        onClose={() => setViewingRoast(null)}
        title="Detalhes da Sessão de Torra"
      >
        {viewingRoast && (
          <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin">
            <div className="grid grid-cols-2 gap-6 bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] opacity-60">Data</span>
                <span className="text-lg font-serif text-[--primary]">{formatDate(viewingRoast.date)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] opacity-60">Lote de Origem</span>
                <span className="text-lg font-serif text-[--foreground]">{viewingRoast.green_coffee?.name || viewingRoast.green_coffee_name}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-tighter text-[--secondary-text]">Entrada</span>
                <span className="text-xl font-bold text-[--primary]">{viewingRoast.qty_before_kg}kg</span>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-tighter text-[--secondary-text]">Saída</span>
                <span className="text-xl font-bold text-[--success]">{viewingRoast.qty_after_kg}kg</span>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-tighter text-[--secondary-text]">Quebra</span>
                <span className="text-xl font-bold text-[--danger]">{(100 - (viewingRoast.qty_after_kg / viewingRoast.qty_before_kg * 100)).toFixed(1)}%</span>
              </div>
            </div>

            <div className="bg-[--primary]/5 p-4 rounded-xl border border-[--primary]/20">
              <h3 className="text-xs font-serif uppercase tracking-widest text-[--primary] mb-3">Custos Processados</h3>
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                <span className="text-xs text-[--secondary-text]">Custo Operacional</span>
                <span className="text-sm font-bold">R$ {viewingRoast.operational_cost?.toFixed(2) || viewingRoast.operational_cost_per_kg?.toFixed(2)} /kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[--secondary-text]">Custo Final Torrado</span>
                <span className="text-lg font-bold text-[--primary]">R$ {viewingRoast.total_torra_cost?.toFixed(2) || viewingRoast.total_roast_cost?.toFixed(2)}</span>
              </div>
            </div>

            {viewingRoast.roast_parameters && viewingRoast.roast_parameters.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-serif uppercase tracking-widest text-[--primary] opacity-80">Parâmetros de Torra</h3>
                <div className="flex flex-col gap-3">
                  {viewingRoast.roast_parameters.map((param: any) => (
                    <div key={param.id} className="bg-black/30 rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-3 py-2 bg-white/5 border-b border-white/5">
                        <span className="text-xs font-bold text-[--primary]">{param.title}</span>
                      </div>
                      <div 
                        className="p-4 text-sm text-[--foreground] custom-rich-text"
                        dangerouslySetInnerHTML={{ __html: param.content }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
