'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
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
          className="golden-btn flex items-center gap-2 px-8 py-4 text-lg"
        >
          <ShoppingBag className="w-6 h-6" />
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
          // Adicionar materiais selecionados ao formData como string JSON
          formData.append('materials', JSON.stringify(selectedMaterials))
          
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
            <div className="flex flex-col gap-1">
              <label className="data-label font-serif text-[--primary] tracking-wider">Lote Torrado</label>
              <select name="roast_batch_id" required className="text-sm bg-black/40 border-white/10">
                <option value="">Selecione...</option>
                {roasts.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.green_coffee?.name} ({r.qty_after_kg}kg disp.)
                  </option>
                ))}
              </select>
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
              <label className="data-label">Venda (R$)</label>
              <input name="retail_price" type="number" step="0.01" min="0" placeholder="Ex: 45.90" required className="text-sm" />
            </div>
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
                  className="text-[10px] bg-[--primary]/20 text-[--primary] px-2 py-1 rounded hover:bg-[--primary]/40 transition-all flex items-center gap-1"
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
                         className="text-red-500 hover:scale-110 transition-transform"
                       >
                         <Trash className="w-4 h-4" />
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
