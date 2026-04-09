'use client'

import { useState } from 'react'
import { ShoppingBag, Beaker, Minus, Plus, Trash, Trash2, Box, Package } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { createPackages } from './actions'

interface PacotesHeaderProps {
  roasts: any[]
  expensePackages: any[]
  inventory: any[]
}

export default function PacotesHeader({ roasts, expensePackages, inventory }: PacotesHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Gestão de Insumos no Lote
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([])
  const [numUnits, setNumUnits] = useState(0)

  // Gestão de Blends
  const [isBlend, setIsBlend] = useState(false)
  const [blendComponents, setBlendComponents] = useState<{ roastId: string, qty: number }[]>([
    { roastId: '', qty: 0 }
  ])

  const totalBlendWeight = blendComponents.reduce((acc, curr) => acc + (curr.qty || 0), 0)

  const handleAddMaterial = () => {
    setSelectedMaterials([...selectedMaterials, { materialId: '', quantity: numUnits }])
  }

  const removeMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index))
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const newMaterials = [...selectedMaterials]
    newMaterials[index][field] = value
    setSelectedMaterials(newMaterials)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <button 
          onClick={() => {
            setError(null)
            setSelectedMaterials([])
            setIsModalOpen(true)
          }}
          className="golden-btn flex items-center gap-2 px-4 py-2 text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Registrar Novo Embalamento
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setError(null)
        }} 
        title="Novo Lote De Produtos"
      >
        <form action={async (formData) => {
          setError(null)
          // Adicionar materiais e blend ao formData como string JSON
          formData.append('materials', JSON.stringify(selectedMaterials))
          if (isBlend) {
            formData.append('is_blend', 'true')
            formData.append('blend_components', JSON.stringify(blendComponents))
          }
          
          const result = await createPackages(formData)
          if (result?.success) {
            setIsModalOpen(false)
          } else {
            setError(result?.error || 'Erro inesperado')
          }
        }} className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="data-label">Data De Produção</label>
                <input 
                  name="date" 
                  type="date" 
                  required 
                  defaultValue={new Date().toISOString().split('T')[0]} 
                  className="text-sm"
                />
              </div>
              <div className="flex items-end pb-1.5 col-span-1">
                <div className="flex items-center gap-2 bg-black/40 px-2 py-1.5 rounded-lg border border-white/5 cursor-pointer hover:bg-black/60 transition-all" onClick={() => setIsBlend(!isBlend)}>
                   <input 
                     type="checkbox" 
                     id="is_blend" 
                     checked={isBlend} 
                     onChange={(e) => setIsBlend(e.target.checked)}
                     className="w-3 h-3 accent-[--primary] cursor-pointer"
                   />
                   <label htmlFor="is_blend" className="text-[9px] uppercase font-bold text-[--primary] cursor-pointer tracking-wide whitespace-nowrap">Modo Blend</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {!isBlend ? (
                <div className="flex flex-col gap-1">
                  <label className="data-label font-serif text-[--primary] tracking-wider">Lote Torrado Único</label>
                  <select name="roast_batch_id" required={!isBlend} className="text-sm bg-black/40 border-white/10 w-full">
                    <option value="">Selecione o lote de torra...</option>
                    {roasts.map((r: any) => (
                      <option key={r.id} value={r.id}>
                        {r.green_coffee?.name} ({r.qty_after_kg.toFixed(2)}kg disponível)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-3 p-4 bg-black/40 rounded-xl border border-[--primary]/20">
                  <div className="flex items-center justify-between mb-1">
                    <label className="data-label font-bold text-[--primary] tracking-widest uppercase">Composição do Blend</label>
                    <span className="text-[10px] opacity-40 italic">Selecione os lotes e defina o peso</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {blendComponents.map((comp, index) => {
                      const perc = totalBlendWeight > 0 ? ((comp.qty / totalBlendWeight) * 100).toFixed(1) : '0'
                      return (
                        <div key={index} className="flex gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/5 group transition-all hover:border-white/10">
                          <div className="flex-1">
                            <select 
                              value={comp.roastId}
                              onChange={(e) => {
                                const newComps = [...blendComponents]
                                newComps[index].roastId = e.target.value
                                setBlendComponents(newComps)
                              }}
                              required={isBlend}
                              className="text-[11px] p-2 bg-black/40 border-none w-full"
                            >
                              <option value="">Selecionar Lote...</option>
                              {roasts.map((r: any) => (
                                <option key={r.id} value={r.id}>
                                  {r.green_coffee?.name} ({r.qty_after_kg.toFixed(2)}kg)
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="relative">
                              <input 
                                type="number"
                                step="0.01"
                                value={comp.qty || ''}
                                placeholder="0.00"
                                onChange={(e) => {
                                  const newComps = [...blendComponents]
                                  newComps[index].qty = parseFloat(e.target.value) || 0
                                  setBlendComponents(newComps)
                                }}
                                required={isBlend}
                                className="text-[12px] p-2 bg-black/40 font-mono w-28 pr-10 border-none rounded-md"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-30 text-[--primary]">KG</span>
                            </div>
                            <div className="min-w-[45px] text-center">
                               <span className="text-[11px] font-bold text-[--primary]">{perc}%</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setBlendComponents(blendComponents.filter((_, i) => i !== index))}
                              disabled={blendComponents.length === 1}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[--danger]/5 text-[--danger] hover:bg-[--danger]/20 transition-all disabled:hidden border border-[--danger]/10"
                              title="Remover Lote"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <button 
                    type="button"
                     onClick={() => setBlendComponents([...blendComponents, { roastId: '', qty: 0 }])}
                    className="w-full py-3 bg-[#1a1411] border border-dashed border-[--primary]/40 rounded-lg text-[10px] text-[--primary] font-bold hover:bg-[--primary]/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2 !shadow-none"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Componente ao Blend
                  </button>

                  <div className="flex justify-between items-center px-2 pt-2 mt-1 border-t border-white/5">
                     <span className="text-[10px] uppercase opacity-40 font-bold tracking-wider">Massa Total do Lote</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-lg font-bold text-[--foreground]">{totalBlendWeight.toFixed(2)}</span>
                       <span className="text-[10px] font-bold text-[--primary] uppercase">kg</span>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div className="flex flex-col gap-1">
              <label className="data-label">Formato</label>
              <select name="bean_format" required className="text-sm">
                <option value="Em Grãos">Em Grãos</option>
                <option value="Moído">Moído</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Tamanho (g)</label>
              <select name="package_size_g" required className="text-sm">
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
                placeholder="Ex: 40" 
                required 
                className="text-sm"
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0
                  setNumUnits(val)
                  // Atualizar todos os materiais que tenham a mesma quantidade do lote
                  setSelectedMaterials(prev => prev.map(m => ({ ...m, quantity: val })))
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label font-serif text-[--primary] tracking-wider">Venda (R$)</label>
              <input name="retail_price" type="number" step="0.01" min="0" placeholder="Ex: 45.90" required className="text-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
            <label className="data-label">Pacote de Custos Extra (Opcional)</label>
            <select name="expense_package_id" className="text-sm">
              <option value="">Nenhum custo extra</option>
              {expensePackages.map((ep: any) => (
                <option key={ep.id} value={ep.id}>{ep.name} (R$ {ep.total_cost})</option>
              ))}
            </select>
          </div>

          {/* SEÇÃO DE INSUMOS (ESTOQUE) */}
          <div className="border-t border-white/5 pt-4">
             <div className="flex justify-between items-center mb-3 px-1">
                <div className="flex items-center gap-2">
                   <Box className="w-4 h-4 text-[--primary]" />
                   <h3 className="data-label font-bold text-[--primary] tracking-widest uppercase">Insumos / Embalagens</h3>
                </div>
                <span className="text-[10px] opacity-40 italic">Obrigatório para baixa de estoque</span>
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
                              <option key={inv.id} value={inv.id} disabled={inv.quantity_available <= 0}>
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
                           <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold opacity-30">UN</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeMaterial(index)}
                          className="p-1.5 text-[--danger] hover:bg-[--danger]/10 rounded-md transition-colors opacity-60 hover:opacity-100"
                          title="Remover Insumo"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  type="button"
                  onClick={handleAddMaterial}
                  className="w-full py-2.5 border border-dashed border-[--primary]/30 rounded-lg text-[10px] text-[--primary] font-bold hover:bg-[--primary]/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                   <Plus className="w-3.5 h-3.5" /> Adicionar Insumo Extra
                </button>

                {selectedMaterials.length === 0 && (
                  <p className="text-[10px] text-center text-[--secondary-text] italic opacity-50 py-3 border border-dashed border-white/5 rounded-lg mt-1">
                    Nenhum insumo extra vinculado a este lote.
                  </p>
                )}
             </div>
          </div>


          <div className="px-3 py-2 bg-[--success]/5 rounded-lg text-[9px] text-[--secondary-text] leading-tight flex items-start gap-2 border border-[--success]/20">
             <Package className="w-4 h-4 text-[--success] shrink-0" />
             <p>
                <span className="text-[--success] uppercase font-bold mr-1">Regra de Estoque:</span> 
                Ao criar este lote, o sistema verificará se há café torrado e embalagens suficientes. 
                Embalagens e rótulos selecionados serão **dados baixa automaticamente** do seu estoque.
             </p>
          </div>

          <button type="submit" className="golden-btn py-4 text-lg mt-2 w-full">
            Finalizar e Criar Produtos
          </button>
        </form>
      </Modal>
    </div>
  )
}
