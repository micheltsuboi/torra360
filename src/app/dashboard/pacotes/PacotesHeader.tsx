'use client'

import { useState } from 'react'
import { ShoppingBag, Beaker, Minus } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { createPackages } from './actions'

import { Plus, Trash, Box, Package } from 'lucide-react'

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
          
          <div className="grid grid-cols-2 gap-4">
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
          <div className="flex flex-col gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="is_blend" 
                checked={isBlend} 
                onChange={(e) => setIsBlend(e.target.checked)}
                className="w-4 h-4 accent-[--primary]"
              />
              <label htmlFor="is_blend" className="data-label !mb-0 flex items-center gap-2 cursor-pointer">
                <Beaker className="w-4 h-4 text-[--primary]" />
                Este lote é um Blend (Mistura de Lotes)?
              </label>
            </div>

            {!isBlend ? (
              <div className="flex flex-col gap-1">
                <label className="data-label font-serif text-[--primary] tracking-wider">Lote Torrado Único</label>
                <select name="roast_batch_id" required={!isBlend} className="text-sm bg-black/40 border-white/10 w-full">
                  <option value="">Selecione...</option>
                  {roasts.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.green_coffee?.name} ({r.qty_after_kg.toFixed(2)}kg disp.)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-3 bg-black/40 rounded-xl border border-[--primary]/20">
                <label className="data-label font-serif text-[--primary] tracking-wider mb-1">Composição do Blend</label>
                
                {blendComponents.map((comp, index) => {
                  const perc = totalBlendWeight > 0 ? ((comp.qty / totalBlendWeight) * 100).toFixed(1) : '0'
                  return (
                    <div key={index} className="flex flex-col md:flex-row gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/5 group">
                      <div className="flex-1 w-full">
                        <select 
                          value={comp.roastId}
                          onChange={(e) => {
                            const newComps = [...blendComponents]
                            newComps[index].roastId = e.target.value
                            setBlendComponents(newComps)
                          }}
                          required={isBlend}
                          className="text-[11px] p-1.5 bg-black/60 w-full"
                        >
                          <option value="">Selecionar Lote...</option>
                          {roasts.map((r: any) => (
                            <option key={r.id} value={r.id}>
                              {r.green_coffee?.name} ({r.qty_after_kg.toFixed(2)}kg disp.)
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
                            className="text-[11px] p-1.5 bg-black/60 font-mono w-20 pr-6"
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] opacity-40">KG</span>
                        </div>
                        <div className="min-w-[45px] text-center text-[--primary] text-[9px] font-bold bg-[--primary]/10 px-1 py-1 rounded border border-[--primary]/20">
                          {perc}%
                        </div>
                        {blendComponents.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => setBlendComponents(blendComponents.filter((_, i) => i !== index))}
                            className="p-1 text-[--danger] hover:bg-[--danger]/10 rounded"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}

                <button 
                  type="button"
                  onClick={() => setBlendComponents([...blendComponents, { roastId: '', qty: 0 }])}
                  className="w-full py-2 border border-dashed border-[--primary]/30 rounded-lg text-[10px] text-[--primary] font-bold hover:bg-[--primary]/10 transition-all uppercase"
                >
                  <Plus className="w-3 h-3 inline mr-1" /> Adicionar Componente
                </button>

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                   <span className="text-[10px] uppercase opacity-40 font-bold">Peso Total do Blend</span>
                   <span className="text-sm font-bold text-[--primary]">{totalBlendWeight.toFixed(2)} kg</span>
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
                            <option key={inv.id} value={inv.id} disabled={inv.quantity_available <= 0}>
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
                         title="Remover Insumo"
                       >
                         <Trash className="action-icon" />
                       </button>
                    </div>
                  </div>
                ))}
                {selectedMaterials.length === 0 && (
                  <p className="text-[10px] text-center text-[--secondary-text] italic opacity-50 py-2 border border-dashed border-white/5 rounded">
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
