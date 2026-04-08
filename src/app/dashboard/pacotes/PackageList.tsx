'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Search, ShoppingBag, Box, Plus, Trash, Package } from 'lucide-react'
import { updatePackage, deletePackage } from './actions'
import Modal from '@/components/ui/Modal'

interface PackageListProps {
  packages: any[]
  roasts: any[]
  expensePackages: any[]
  inventory: any[]
}

export default function PackageList({ packages, roasts, expensePackages, inventory }: PackageListProps) {
  const [editingPackage, setEditingPackage] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // Gestão de Insumos na Edição
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([])

  useEffect(() => {
    if (editingPackage) {
      // Carregar materiais atuais do lote sendo editado
      const currentMaterials = editingPackage.materials?.map((m: any) => ({
        materialId: m.material_id,
        quantity: m.quantity_used
      })) || []
      setSelectedMaterials(currentMaterials)
    }
  }, [editingPackage])

  const handleAddMaterial = () => {
    setSelectedMaterials([...selectedMaterials, { materialId: '', quantity: editingPackage?.quantity_units || 0 }])
  }

  const removeMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index))
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const newMaterials = [...selectedMaterials]
    newMaterials[index][field] = value
    setSelectedMaterials(newMaterials)
  }

  const filteredPackages = packages?.filter(p => {
    const roast = roasts.find(r => r.id === p.roast_batch_id)
    const nameMatch = roast?.green_coffee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const formatMatch = p.bean_format?.toLowerCase().includes(searchTerm.toLowerCase())
    const sizeMatch = p.package_size_g?.toString().includes(searchTerm)
    return nameMatch || formatMatch || sizeMatch
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de Busca Externa */}
      <div className="flex items-center bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner w-full">
        <div className="flex items-center w-full bg-black/60 rounded-lg border border-white/10 px-4 gap-3 focus-within:border-[--primary]/50 transition-all">
          <Search className="w-5 h-5 text-[--primary] opacity-60 shrink-0" />
          <input 
            type="text"
            placeholder="Buscar por café, formato ou tamanho..."
            className="!py-3 !bg-transparent !border-none !p-0 focus:!ring-0 w-full !text-sm font-sans outline-none text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20">
        <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40">
          <h2 className="font-serif text-[--primary] text-sm tracking-widest uppercase">Lotes Embalados e Estoque</h2>
        </div>
        <div className="responsive-table-container scrollbar-thin scrollbar-thumb-[--primary]/20">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="text-[--secondary-text] text-[10px] capitalize border-b border-[--card-border]/50 bg-white/5 tracking-widest">
                <th className="p-2 font-bold text-left">Produto / Lote</th>
                <th className="p-2 font-bold border-l border-white/5">Formato / Tam</th>
                <th className="p-2 font-bold border-l border-white/5">Qtd</th>
                <th className="p-2 font-bold border-l border-white/5">Custo Produção</th>
                <th className="p-2 font-bold border-l border-white/5">Venda Unit.</th>
                <th className="p-2 font-bold border-l border-white/5">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredPackages && filteredPackages.length > 0 ? (
                filteredPackages.map((p: any) => {
                  const roast = roasts.find(r => r.id === p.roast_batch_id)
                  const costs = p.calculated_costs || { total: 0, unit: 0 }

                  return (
                    <tr key={p.id} className="border-b border-[--card-border]/30 hover:bg-white/5 transition-colors group">
                      <td className="p-2">
                        <span className="text-sm font-semibold text-[--primary] block">{roast?.green_coffee?.name || 'N/A'}</span>
                        <span className="text-[10px] text-[--secondary-text] opacity-60">Produzido em {new Date(p.date + 'T12:00:00').toLocaleDateString()}</span>
                      </td>
                      <td className="p-2 border-l border-white/5 text-center">
                        <span className="text-xs font-medium block">{p.bean_format}</span>
                        <span className="text-[10px] opacity-40">{p.package_size_g}g</span>
                      </td>
                      <td className="p-2 border-l border-white/5 text-center">
                        <span className={`font-bold ${p.quantity_units < 10 ? 'text-[--danger]' : 'text-[--primary]'}`}>
                          {p.quantity_units}
                        </span>
                      </td>
                      <td className="p-2 border-l border-white/5 text-center">
                        <div className="flex flex-col items-center">
                          <div className="text-[--foreground] font-bold text-sm">R$ {costs.unit.toFixed(2)}</div>
                          <div className="text-[9px] opacity-50 text-[--secondary-text]">Total: R$ {costs.total.toFixed(2)}</div>
                        </div>
                      </td>
                      <td className="p-2 border-l border-white/5 text-center">
                        <div className="flex flex-col items-center">
                          <div className="text-[--primary] font-bold text-sm">R$ {(p.retail_price || 0).toFixed(2)}</div>
                          <div className="text-[9px] opacity-30 text-[--secondary-text]">Margem: R$ {(p.retail_price - costs.unit).toFixed(2)}</div>
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
                               <button type="submit" className="action-icon-btn text-[--danger]" title="Excluir">
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
                  <td colSpan={6} className="p-20 text-center text-[--secondary-text] italic opacity-40">
                    {searchTerm ? 'Nenhum produto encontrado para esta busca.' : 'Sem produtos finais registrados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição (Sync com Cadastro) */}
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
            formData.append('materials', JSON.stringify(selectedMaterials))
            const result = await updatePackage(formData)
            if (result?.success) {
              setEditingPackage(null)
            } else {
              setError(result?.error || 'Erro ao atualizar')
            }
          }} className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin">
            <input type="hidden" name="id" value={editingPackage.id} />

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="data-label text-[--primary] uppercase tracking-tighter opacity-70">Lote:</label>
                <div className="p-2 bg-white/5 rounded text-sm border border-white/10">
                   {roasts.find(r => r.id === editingPackage.roast_batch_id)?.green_coffee?.name || 'N/A'}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="data-label">Data Produção</label>
                <input 
                  name="date" 
                  type="date" 
                  required 
                  defaultValue={editingPackage.date} 
                  className="text-sm bg-black/40 border-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div className="flex flex-col gap-1">
                <label className="data-label">Formato</label>
                <select name="bean_format" defaultValue={editingPackage.bean_format} required className="text-sm bg-black/40 border-white/10">
                  <option value="Em Grãos">Em Grãos</option>
                  <option value="Moído">Moído</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="data-label">Tamanho (g)</label>
                <select name="package_size_g" defaultValue={editingPackage.package_size_g} required className="text-sm bg-black/40 border-white/10">
                  <option value="250">250g</option>
                  <option value="500">500g</option>
                  <option value="1000">1kg</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="data-label">Qtd Pacotes</label>
                <input 
                  name="quantity_units" 
                  type="number" 
                  min="1" 
                  defaultValue={editingPackage.quantity_units} 
                  required 
                  className="text-sm bg-black/40 border-white/10"
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    // Opcional: atualizar quantidades de materiais se desejar sync automático na edição tb
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="data-label font-serif text-[--primary] tracking-wider">Venda (R$)</label>
                <input 
                  name="retail_price" 
                  type="number" 
                  step="0.01" 
                  defaultValue={editingPackage.retail_price} 
                  required 
                  className="text-sm bg-black/40 border-white/10" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
              <label className="data-label">Pacote de Custos Extra</label>
              <select name="expense_package_id" defaultValue={editingPackage.expense_package_id || ''} className="text-sm bg-black/40 border-white/10">
                <option value="">Nenhum custo extra</option>
                {expensePackages.map((ep: any) => (
                  <option key={ep.id} value={ep.id}>{ep.name} (R$ {ep.total_cost})</option>
                ))}
              </select>
            </div>

            {/* SEÇÃO DE INSUMOS (ESTOQUE) NA EDIÇÃO */}
            <div className="border-t border-[--primary]/20 pt-4">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                     <Box className="w-4 h-4 text-[--primary]" />
                     <h3 className="text-xs uppercase font-bold tracking-widest text-[--primary]">Insumos / Embalagens</h3>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddMaterial}
                    className="golden-btn flex items-center gap-2 px-4 py-2 text-xs"
                  >
                     <Plus className="w-3 h-3" /> Adicionar Insumo
                  </button>
               </div>

               <div className="flex flex-col gap-3">
                  {selectedMaterials.map((sm, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end bg-white/5 p-2 rounded-lg border border-white/5">
                      <div className="col-span-7 flex flex-col gap-1">
                         <label className="text-[9px] uppercase opacity-40">Tipo de Insumo</label>
                         <select 
                           value={sm.materialId}
                           required
                           onChange={(e) => updateMaterial(index, 'materialId', e.target.value)}
                           className="text-[11px] p-1.5 bg-black/60"
                         >
                            <option value="">Selecione...</option>
                            {inventory.map((inv: any) => (
                              <option key={inv.id} value={inv.id}>
                                 {inv.name} ({inv.quantity_available} dispon.)
                              </option>
                            ))}
                         </select>
                      </div>
                      <div className="col-span-3 flex flex-col gap-1">
                         <label className="text-[9px] uppercase opacity-40">Qtd Uso</label>
                         <input 
                           type="number"
                           value={sm.quantity}
                           required
                           onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value) || 0)}
                           className="text-[11px] p-1.5 bg-black/60 font-mono"
                         />
                      </div>
                      <div className="col-span-2 flex justify-center pb-1">
                         <button 
                           type="button"
                           onClick={() => removeMaterial(index)}
                           className="action-icon-btn text-[--danger]"
                         >
                           <Trash className="action-icon" />
                         </button>
                      </div>
                    </div>
                  ))}
                  {selectedMaterials.length === 0 && (
                    <p className="text-[10px] text-center text-[--secondary-text] italic opacity-50 py-2 border border-dashed border-white/5 rounded">
                      Nenhum insumo extra vinculado.
                    </p>
                  )}
               </div>
            </div>

            <div className="px-3 py-2 bg-[--warning]/5 rounded-lg text-[9px] text-[--secondary-text] leading-tight flex items-start gap-2 border border-[--warning]/20">
               <Package className="w-4 h-4 text-[--warning] shrink-0" />
               <p>
                  <span className="text-[--warning] uppercase font-bold mr-1">Aviso de Estoque:</span> 
                  Ao editar, o sistema **devolverá** os insumos anteriores ao estoque e **subtrairá** os novos. 
                  Verifique se as quantidades estão corretas.
               </p>
            </div>

            <button type="submit" className="golden-btn py-4 text-lg mt-2 w-full">
              Salvar Alterações
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
