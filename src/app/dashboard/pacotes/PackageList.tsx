'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check, X, Search } from 'lucide-react'
import { updatePackage, deletePackage } from './actions'

export default function PackageList({ packages, roasts, expensePackages }: { packages: any[], roasts: any[], expensePackages: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPackages = packages?.filter(p => {
    const roast = roasts.find(r => r.id === p.roast_batch_id)
    const nameMatch = roast?.green_coffee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const formatMatch = p.bean_format?.toLowerCase().includes(searchTerm.toLowerCase())
    const sizeMatch = p.package_size_g?.toString().includes(searchTerm)
    return nameMatch || formatMatch || sizeMatch
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de Busca Externa - De fora a fora */}
      <div className="flex items-center bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner w-full">
        <div className="flex items-center w-full bg-black/60 rounded-lg border border-white/10 px-4 gap-3 focus-within:border-[--primary]/50 transition-all">
          <Search className="w-5 h-5 text-[--primary] opacity-60 shrink-0" />
          <input 
            type="text"
            placeholder="Buscar por café, formato ou tamanho..."
            className="!py-3 !bg-transparent !border-none !p-0 focus:!ring-0 w-full !text-sm font-sans outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20">
        <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40">
          <h2 className="font-serif text-[--primary] text-sm tracking-widest uppercase">Estoque Disponível / Produtos Finais</h2>
        </div>
        <div className="responsive-table-container scrollbar-thin scrollbar-thumb-[--primary]/20">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="text-[--secondary-text] text-[10px] capitalize border-b border-[--card-border]/50 bg-white/5 tracking-widest">
                <th className="p-2 font-bold">Produto / Lote Torra</th>
                <th className="p-2 font-bold border-l border-white/5">Formato / Tamanho</th>
                <th className="p-2 font-bold border-l border-white/5">Qtd (Unids)</th>
                <th className="p-2 font-bold border-l border-white/5">Venda Unit.</th>
                <th className="p-2 font-bold border-l border-white/5">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredPackages && filteredPackages.length > 0 ? (
                filteredPackages.map((p: any) => {
                  const isEditing = editingId === p.id
                  const totalEstimado = (p.retail_price * p.quantity_units).toFixed(2)
                  const roast = roasts.find(r => r.id === p.roast_batch_id)

                  if (isEditing) {
                    return (
                      <tr key={p.id} className="border-b border-[--primary]/30 bg-[--primary]/5">
                        <td className="p-2">
                          <form id={`edit-pkg-${p.id}`} action={async (formData) => {
                            await updatePackage(formData)
                            setEditingId(null)
                          }}>
                            <input type="hidden" name="id" value={p.id} />
                            <span className="text-sm font-semibold text-[--primary] block">{roast?.green_coffee?.name || 'N/A'}</span>
                            <input name="date" type="date" defaultValue={p.date} className="bg-black/60 text-xs p-1 mt-1 border border-white/10 rounded w-full" />
                          </form>
                        </td>
                        <td className="p-2 border-l border-white/5">
                          <div className="flex flex-col gap-1">
                            <select name="bean_format" form={`edit-pkg-${p.id}`} defaultValue={p.bean_format} className="bg-black/60 text-[10px] p-1 border border-white/10 rounded">
                              <option value="Grãos Inteiros">Grãos</option>
                              <option value="Café Moído">Moído</option>
                            </select>
                            <select name="package_size_g" form={`edit-pkg-${p.id}`} defaultValue={p.package_size_g} className="bg-black/60 text-[10px] p-1 border border-white/10 rounded">
                              <option value="250">250g</option>
                              <option value="500">500g</option>
                              <option value="1000">1kg</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-2 border-l border-white/5">
                          <input name="quantity_units" type="number" form={`edit-pkg-${p.id}`} defaultValue={p.quantity_units} className="bg-black/60 text-xs p-1 w-16 text-center border border-white/10 rounded" />
                        </td>
                        <td className="p-2 border-l border-white/5">
                          <input name="retail_price" type="number" step="0.01" form={`edit-pkg-${p.id}`} defaultValue={p.retail_price} className="bg-black/60 text-xs p-1 w-20 text-center border border-white/10 rounded" />
                        </td>
                        <td className="p-2 border-l border-white/5">
                          <div className="flex items-center justify-center gap-1">
                            <button type="submit" form={`edit-pkg-${p.id}`} className="action-icon-btn text-[--success] !opacity-100">
                              <Check className="action-icon" />
                            </button>
                            <button type="button" onClick={() => setEditingId(null)} className="action-icon-btn text-[--secondary-text] !opacity-100">
                              <X className="action-icon" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr key={p.id} className="border-b border-[--card-border]/30 hover:bg-white/5 transition-colors group">
                      <td className="p-2">
                        <span className="text-sm font-semibold text-[--primary] block">{roast?.green_coffee?.name || 'N/A'}</span>
                        <span className="text-[10px] text-[--secondary-text] opacity-60">Produzido em {new Date(p.date).toLocaleDateString()}</span>
                      </td>
                      <td className="p-2 border-l border-white/5">
                        <span className="text-xs font-medium block">{p.bean_format}</span>
                        <span className="text-[10px] opacity-40">{p.package_size_g}g</span>
                      </td>
                      <td className="p-2 border-l border-white/5">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold ${p.quantity_units < 5 ? 'text-[--danger]' : 'text-[--primary]'}`}>
                            {p.quantity_units}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 border-l border-white/5">
                        <div className="flex flex-col items-center">
                          <div className="text-[--foreground] font-bold text-sm">R$ {(p.retail_price || 0).toFixed(2)}</div>
                          <div className="text-[9px] opacity-30">Total: R$ {totalEstimado}</div>
                        </div>
                      </td>
                      <td className="p-2 border-l border-white/5">
                        <div className="flex justify-center items-center gap-1">
                            <button 
                              onClick={() => setEditingId(p.id)}
                              className="action-icon-btn text-[--primary]" 
                              title="Editar"
                            >
                               <Pencil className="action-icon" />
                            </button>
                            <form action={deletePackage} className="flex items-center">
                               <input type="hidden" name="id" value={p.id} />
                               <button type="submit" className="action-icon-btn text-[--danger]">
                                  <Trash2 className="action-icon" />
                               </button>
                            </form>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-[--secondary-text] italic opacity-40">
                    {searchTerm ? 'Nenhum produto encontrado para esta busca.' : 'Sem produtos finais registrados.'}
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
