'use client'

import { useState } from 'react'
import { Pencil, Trash2, Search, ShoppingBag } from 'lucide-react'
import { updatePackage, deletePackage } from './actions'
import Modal from '@/components/ui/Modal'

export default function PackageList({ packages, roasts, expensePackages }: { packages: any[], roasts: any[], expensePackages: any[] }) {
  const [editingPackage, setEditingPackage] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

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
                  const totalEstimado = (p.retail_price * p.quantity_units).toFixed(2)
                  const roast = roasts.find(r => r.id === p.roast_batch_id)

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
                              onClick={() => setEditingPackage(p)}
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

      {/* Modal de Edição */}
      <Modal 
        isOpen={editingPackage !== null} 
        onClose={() => {
          setEditingPackage(null)
          setError(null)
        }} 
        title="Editar Lote De Produtos"
      >
        {editingPackage && (
          <form action={async (formData) => {
            setError(null)
            const result = await updatePackage(formData)
            if (result?.success) {
              setEditingPackage(null)
            } else {
              setError(result?.error || 'Erro ao atualizar')
            }
          }} className="flex flex-col gap-6">
            <input type="hidden" name="id" value={editingPackage.id} />

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="data-label text-[--primary] uppercase tracking-tighter opacity-70 mb-2">
                Produto: <span className="text-[--foreground] font-bold">{roasts.find(r => r.id === editingPackage.roast_batch_id)?.green_coffee?.name || 'N/A'}</span>
              </label>
              <label className="data-label">Data De Produção</label>
              <input 
                name="date" 
                type="date" 
                required 
                defaultValue={editingPackage.date} 
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="data-label">Formato Do Café</label>
                <select name="bean_format" defaultValue={editingPackage.bean_format} required className="text-sm">
                  <option value="Em Grãos">Em Grãos</option>
                  <option value="Moído">Moído</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="data-label">Tamanho Da Embalagem</label>
                <select name="package_size_g" defaultValue={editingPackage.package_size_g} required className="text-sm">
                  <option value="250">250g (Padrão)</option>
                  <option value="500">500g</option>
                  <option value="1000">1kg</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="data-label">Quantidade De Pacotes</label>
                <input 
                  name="quantity_units" 
                  type="number" 
                  min="1" 
                  defaultValue={editingPackage.quantity_units} 
                  required 
                  className="text-sm" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="data-label">Valor De Venda (R$)</label>
                <input 
                  name="retail_price" 
                  type="number" 
                  step="0.01" 
                  defaultValue={editingPackage.retail_price} 
                  required 
                  className="text-sm" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="data-label">Pacote De Custos</label>
              <select name="expense_package_id" defaultValue={editingPackage.expense_package_id || ''} className="text-sm">
                <option value="">Nenhum custo adicional</option>
                {expensePackages.map((ep: any) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.name} (R$ {ep.total_cost.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="golden-btn py-4 text-lg mt-2 w-full">
              Salvar Alterações No Lote
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
