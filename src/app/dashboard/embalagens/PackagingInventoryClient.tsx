'use client'

import { useState } from 'react'
import { Plus, Trash2, Box, Calculator, Coins } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { addPackagingLot, deleteInventoryItem } from './actions'

export default function PackagingInventoryClient({ inventory }: { inventory: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formQty, setFormQty] = useState('')
  const [formTotal, setFormTotal] = useState('')

  const unitCost = (parseFloat(formTotal) || 0) / (parseInt(formQty) || 1)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="golden-btn flex items-center gap-2 px-8 py-4 text-lg"
        >
          <Plus className="w-6 h-6" />
          Registrar Lote de Embalagens
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((item) => (
          <div key={item.id} className="glass-panel group relative overflow-hidden">
            <div className="p-4 border-b border-[--card-border] card-texture-header flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-[--primary]" />
                <h3 className="font-serif text-[--primary] uppercase tracking-widest text-xs font-bold">{item.name}</h3>
              </div>
              <button 
                onClick={async () => {
                  if (confirm('Excluir este item do estoque?')) {
                    await deleteInventoryItem(item.id)
                  }
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[--danger]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-[--secondary-text] mb-1">Disponível em Estoque</p>
                <p className="text-3xl font-serif text-[--foreground]">{item.quantity_available} <span className="text-sm opacity-40 italic">unid</span></p>
              </div>
              
              <div className="w-full flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-tighter text-[--secondary-text] opacity-60">Custo Unitário</p>
                  <p className="text-sm font-mono text-[--primary]">R$ {item.unit_cost.toFixed(3)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-tighter text-[--secondary-text] opacity-60">Valor em Estoque</p>
                  <p className="text-sm font-mono text-[--success]">R$ {(item.quantity_available * item.unit_cost).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-[#C39967]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
        {inventory.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
             <Box className="w-12 h-12 text-[--primary] opacity-10 m-auto mb-4" />
             <p className="text-[--secondary-text] italic">Nenhuma embalagem cadastrada no sistema.</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Novo Lote de Insumos"
      >
        <form action={async (formData) => {
          setLoading(true)
          await addPackagingLot(formData)
          setLoading(false)
          setIsModalOpen(false)
          setFormQty('')
          setFormTotal('')
        }} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="data-label">Nome do Insumo</label>
            <input 
              name="name" 
              placeholder="Ex: Pacote 250g Kraft" 
              required 
              className="text-sm"
              list="common-packaging"
            />
            <datalist id="common-packaging">
              <option value="Pacote 250g" />
              <option value="Pacote 500g" />
              <option value="Pacote 1kg" />
              <option value="Rótulo Adesivo" />
              <option value="Válvula Desgaseificadora" />
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="data-label">Quantidade Comprada</label>
              <input 
                name="quantity" 
                type="number" 
                min="1" 
                required 
                value={formQty}
                onChange={e => setFormQty(e.target.value)}
                className="text-sm"
                placeholder="Ex: 1000"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Valor Total do Lote (R$)</label>
              <input 
                name="total_cost" 
                type="number" 
                step="0.01" 
                min="0" 
                required 
                value={formTotal}
                onChange={e => setFormTotal(e.target.value)}
                className="text-sm"
                placeholder="Ex: 1500.00"
              />
            </div>
          </div>

          <div className="bg-[--primary]/10 border border-[--primary]/20 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-[--primary]" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[--primary]/60">Custo Unitário Calculado</span>
                <span className="text-lg font-serif text-[--primary]">R$ {unitCost.toFixed(3)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-60">
               <Coins className="w-4 h-4 text-[--success]" />
               <span className="text-[9px] uppercase font-bold">Lançar Despesa</span>
            </div>
          </div>

          <div className="px-3 py-2 bg-white/5 rounded-lg text-[9px] text-[--secondary-text] leading-tight italic">
             Nota: Ao finalizar, o sistema atualizará seu estoque disponível e registrará automaticamente 
             o valor total como uma despesa no seu controle financeiro do mês.
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="golden-btn py-4 text-lg mt-2 w-full disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Finalizar Entrada'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
