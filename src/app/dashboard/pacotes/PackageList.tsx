'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Search, ShoppingBag, Box, Plus, Trash, Package, Beaker } from 'lucide-react'
import { updatePackage, deletePackage } from './actions'
import Modal from '@/components/ui/Modal'
import { formatDate } from '@/utils/date-utils'

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
      <div className="flex items-center bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner w-full mb-2">
        <div className="flex items-center w-full bg-black/40 rounded-lg border border-white/10 px-4 gap-3 focus-within:border-[--primary]/40 transition-all">
          <Search className="w-5 h-5 text-[--primary] opacity-40 shrink-0" />
          <input 
            type="text"
            placeholder="Buscar por café, formato ou tamanho..."
            className="!py-3 !bg-transparent !border-none !p-0 focus:!ring-0 w-full ! font-sans outline-none text-white placeholder:opacity-30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 shadow-2xl">
        <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
          <h2 className="font-serif text-[--primary]  tracking-widest capitalize font-bold">Lotes Embalados e Estoque</h2>
          <span className=" text-[--secondary-text] opacity-40 capitalize tracking-widest">{filteredPackages?.length || 0} Registros</span>
        </div>
        <div className="responsive-table-container scrollbar-thin scrollbar-thumb-[--primary]/20">
          <table className="w-full border-collapse min-w-[900px]">
            <thead className="text-[10px] capitalize tracking-widest text-[--secondary-text] opacity-60 font-sans border-b border-white/10 bg-black/20">
              <tr>
                <th className="p-3 font-bold text-left opacity-40">Produto / Lote</th>
                <th className="p-3 font-bold text-center opacity-40">Formato / Tam</th>
                <th className="p-3 font-bold text-center opacity-40">Qtd</th>
                <th className="p-3 font-bold text-center opacity-40">Custo Produção</th>
                <th className="p-3 font-bold text-center opacity-40">Venda Unit.</th>
                <th className="p-3 font-bold text-center opacity-40">Ações</th>
              </tr>
            </thead>
            <tbody className="font-sans text-[11px]">
              {filteredPackages && filteredPackages.length > 0 ? (
                filteredPackages.map((p: any, index: number) => {
                  const roast = roasts.find(r => r.id === p.roast_batch_id)
                  const costs = p.calculated_costs || { total: 0, unit: 0 }

                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.08] transition-colors group" style={{ backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}>
                      <td className="p-3">
                        {!p.is_blend ? (
                          <>
                            <span className=" font-semibold text-[--primary] block">{roast?.green_coffee?.name || 'N/A'}</span>
                            <span className=" text-[--secondary-text] opacity-60">Lote torrado em {formatDate(p.date)}</span>
                          </>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <Beaker className="w-3.5 h-3.5 text-[--primary]" />
                              <span className=" font-bold text-[--foreground]">Blend Comercial</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.blend_composition?.map((comp: any, i: number) => (
                                <span key={i} className=" bg-[--primary]/10 text-[--primary] px-1.5 py-0.5 rounded border border-[--primary]/20 font-medium">
                                  {comp.roast_batch?.green_coffee?.name}: <strong>{Math.round(comp.percentage)}%</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3 border-l border-white/5 text-center">
                        <span className="font-bold block text-[--foreground]">{p.bean_format}</span>
                        <span className="opacity-40 capitalize tracking-tighter">{p.package_size_g}g</span>
                      </td>
                      <td className="p-3 border-l border-white/5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={` font-bold ${p.quantity_units < 10 ? 'text-[--danger]' : 'text-[--primary]'}`}>
                            {p.quantity_units}
                          </span>
                          <span className=" capitalize opacity-30 font-bold -mt-1">unidades</span>
                        </div>
                      </td>
                      <td className="p-3 border-l border-white/5 text-center">
                        <div className="flex flex-col items-center">
                          <div className="text-[--foreground] font-bold tracking-tight">R$ {costs.unit.toFixed(2)}</div>
                          <div className="opacity-40 text-[--secondary-text] capitalize font-bold">Total: R$ {costs.total.toFixed(2)}</div>
                        </div>
                      </td>
                      <td className="p-3 border-l border-white/5 text-center">
                        <div className="flex flex-col items-center">
                          {(() => {
                            const price = Number(p.retail_price || 0);
                            const unitCost = Number(costs.unit || 0);
                            const units = Number(p.quantity_units || 0);
                            
                            const unitMargin = price - unitCost;
                            const marginPct = price > 0 ? (unitMargin / price) * 100 : 0;
                            const totalMargin = unitMargin * units;
                            const isPositive = unitMargin > 0;

                            return (
                              <>
                                <div className="text-[12px] text-[--primary] font-bold tracking-tight">
                                  {price > 0 ? `R$ ${price.toFixed(2)}` : <span className="opacity-30 text-[9px] italic">Preço não definido</span>}
                                </div>
                                <div className="flex flex-col gap-0.5 mt-1">
                                  <div className={`text-[10px] font-bold flex items-center justify-center gap-1 ${isPositive ? 'text-[--success]' : unitMargin < 0 ? 'text-[--danger]' : 'text-[--secondary-text] opacity-40'}`}>
                                    <span>Margem:</span>
                                    <span>R$ {unitMargin.toFixed(2)}</span>
                                    {price > 0 && <span className="opacity-60 text-[8px]">({marginPct.toFixed(1)}%)</span>}
                                  </div>
                                  <div className="text-[9px] uppercase font-bold text-[--secondary-text] opacity-40">
                                    {units > 0 ? `Lote: R$ ${totalMargin.toFixed(2)}` : <span className="text-[8px] opacity-20 italic">Sem unidades</span>}
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </td>



                      <td className="p-3 border-l border-white/5">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={() => setEditingPackage(p)}
                            className="action-icon-btn text-[--primary]" 
                            title="Editar"
                          >
                             <Pencil className="action-icon" />
                          </button>
                          <form action={deletePackage} className="flex items-center">
                             <input type="hidden" name="id" value={p.id} />
                             <button 
                               type="submit" 
                               className="action-icon-btn text-[--danger]" 
                               title="Excluir"
                               onClick={(e) => { if(!confirm('Tem certeza?')) e.preventDefault(); }}
                             >
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
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <ShoppingBag className="w-12 h-12" />
                      <p className=" uppercase tracking-widest font-bold">
                        {searchTerm ? 'Nenhum lote compatível.' : 'Nenhum produto em estoque.'}
                      </p>
                    </div>
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
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg  font-semibold">
                ⚠️ {error}
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="data-label text-[--primary] uppercase tracking-widest">Produto Original:</label>
                  <div className="p-3 bg-black/40 rounded-lg  border border-white/5 flex items-center gap-2">
                     <Package className="w-4 h-4 opacity-40" />
                     <span className="font-bold">
                       {roasts.find(r => r.id === editingPackage.roast_batch_id)?.green_coffee?.name || 'Blend Comercial'}
                     </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="data-label">Data De Produção</label>
                  <input 
                    name="date" 
                    type="date" 
                    required 
                    defaultValue={editingPackage.date} 
                    className=" bg-black/40 border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div className="flex flex-col gap-1">
                  <label className="data-label">Formato</label>
                  <select name="bean_format" defaultValue={editingPackage.bean_format} required className=" bg-black/40 border-white/10">
                    <option value="Em Grãos">Em Grãos</option>
                    <option value="Moído">Moído</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="data-label">Tamanho (g)</label>
                  <select name="package_size_g" defaultValue={editingPackage.package_size_g} required className=" bg-black/40 border-white/10">
                    <option value="250">250g</option>
                    <option value="500">500g</option>
                    <option value="1000">1kg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="data-label">Qtd Pacotes (Unidades)</label>
                  <input 
                    name="quantity_units" 
                    type="number" 
                    min="1" 
                    defaultValue={editingPackage.quantity_units} 
                    required 
                    className=" bg-black/40 border-white/10"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="data-label font-serif text-[--primary] tracking-wider uppercase">Venda Unitário (R$)</label>
                  <input 
                    name="retail_price" 
                    type="number" 
                    step="0.01" 
                    defaultValue={editingPackage.retail_price} 
                    required 
                    className=" bg-black/40 border-white/10" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
                <label className="data-label uppercase tracking-widest text-[--primary]">Pacote de Custos Extra</label>
                <select name="expense_package_id" defaultValue={editingPackage.expense_package_id || ''} className=" bg-black/40 border-white/10">
                  <option value="">Nenhum custo extra</option>
                  {expensePackages.map((ep: any) => (
                    <option key={ep.id} value={ep.id}>{ep.name} (R$ {ep.total_cost})</option>
                  ))}
                </select>
              </div>

              {/* SEÇÃO DE INSUMOS (ESTOQUE) NA EDIÇÃO */}
              <div className="border-t border-white/5 pt-4">
                 <div className="flex justify-between items-center mb-3 px-1">
                    <div className="flex items-center gap-2">
                       <Box className="w-4 h-4 text-[--primary]" />
                       <h3 className="data-label font-bold text-[--primary] tracking-widest uppercase">Insumos / Embalagens</h3>
                    </div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      {selectedMaterials.map((sm, index) => (
                        <div key={index} className="flex gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/5 group transition-all hover:border-white/10">
                          <div className="flex-1">
                             <select 
                                value={sm.materialId}
                                required
                                onChange={(e) => updateMaterial(index, 'materialId', e.target.value)}
                                className="text-[11px] p-2 bg-black/40 border-none w-full"
                             >
                                <option value="">Selecionar Insumo...</option>
                                {inventory.map((inv: any) => (
                                  <option key={inv.id} value={inv.id}>
                                     {inv.name} ({inv.quantity_available} disp.)
                                  </option>
                                ))}
                             </select>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="relative">
                               <input 
                                 type="number"
                                 value={sm.quantity || ''}
                                 placeholder="0"
                                 required
                                 onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value) || 0)}
                                 className="text-[12px] p-2 bg-black/40 font-mono w-20 border-none"
                               />
                               <span className="absolute right-2 top-1/2 -translate-y-1/2  font-bold opacity-30">UN</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeMaterial(index)}
                              className="action-icon-btn text-[--danger] hover:bg-[--danger]/10 !opacity-100"
                              title="Remover Insumo"
                            >
                              <Trash2 className="action-icon" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      type="button"
                      onClick={handleAddMaterial}
                      className="w-full py-2.5 bg-transparent border border-dashed border-[--primary]/30 rounded-lg  text-[--primary] font-bold hover:bg-[--primary]/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                       <Plus className="w-3.5 h-3.5" /> Adicionar Insumo Extra
                    </button>

                    {selectedMaterials.length === 0 && (
                      <p className=" text-center text-[--secondary-text] italic opacity-50 py-3 border border-dashed border-white/5 rounded-lg mt-1">
                        Nenhum insumo extra vinculado.
                      </p>
                    )}
                 </div>
              </div>

              <div className="px-3 py-2 bg-[--warning]/5 rounded-lg  text-[--secondary-text] leading-tight flex items-start gap-2 border border-[--warning]/20">
                 <Package className="w-4 h-4 text-[--warning] shrink-0" />
                 <p>
                    <span className="text-[--warning] uppercase font-bold mr-1">Aviso de Estoque:</span> 
                    Ao salvar, o sistema recalculará o estoque de insumos. Verifique se as quantidades estão corretas.
                 </p>
              </div>
            </div>

            <button type="submit" className="golden-btn py-4 text-lg mt-2 w-full">
              Salvar Alterações do Lote
            </button>
          </form>
        )}
      </Modal>

    </div>
  )
}
