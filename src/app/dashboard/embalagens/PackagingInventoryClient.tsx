'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil, Box, Calculator, Search } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { addPackagingLot, updateInventoryItem, deleteInventoryItem } from './actions'

export default function PackagingInventoryClient({ inventory }: { inventory: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Form State para Cálculo em Tempo Real (Novo Lote)
  const [formQty, setFormQty] = useState('')
  const [formTotal, setFormTotal] = useState('')
  const unitCostCalc = (parseFloat(formTotal) || 0) / (parseInt(formQty) || 1)

  const filteredItems = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="golden-btn flex items-center gap-2 px-4 py-2 text-sm"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          Registrar Lote
        </button>

        <div className="flex-1 max-w-md relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--primary] opacity-40 group-focus-within:opacity-100 transition-opacity" />
          <input 
            type="text"
            placeholder="Buscar insumo..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs focus:border-[--primary]/50 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20">
        <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40">
           <h2 className="font-serif text-[--primary] text-sm tracking-widest uppercase">
             Estoque de Insumos e Materiais
           </h2>
        </div>
        
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[--primary]/20">
          <table className="w-full border-collapse">
            <thead className="text-[10px] capitalize tracking-widest text-[--secondary-text] opacity-60 font-sans border-b border-white/10 bg-black/20">
              <tr>
                <th className="p-2 text-left font-bold opacity-40">Insumo</th>
                <th className="p-2 text-center font-bold opacity-40">Qtd Disp.</th>
                <th className="p-2 text-center font-bold opacity-40">Custo Unit.</th>
                <th className="p-2 text-center font-bold opacity-40">Vlr Total</th>
                <th className="p-2 text-center font-bold opacity-40 w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="font-sans">
              {filteredItems.map((item, index) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.08] transition-colors group" style={{ backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}>
                  <td className="p-2">
                    <span className="text-sm font-semibold text-[--foreground] block">{item.name}</span>
                  </td>
                  <td className="p-2 border-l border-white/5 text-center">
                    <span className={`text-sm font-bold ${item.quantity_available < 50 ? 'text-[--danger]' : 'text-[--primary]'}`}>
                      {item.quantity_available}
                    </span>
                    <span className="text-[10px] opacity-40 italic ml-1">un</span>
                  </td>
                  <td className="p-2 border-l border-white/5 text-center">
                    <span className="text-sm font-mono text-[--primary]">R$ {item.unit_cost.toFixed(3)}</span>
                  </td>
                  <td className="p-2 border-l border-white/5 text-center">
                    <span className="text-sm font-mono text-[--success]">R$ {(item.quantity_available * item.unit_cost).toFixed(2)}</span>
                  </td>
                  <td className="p-2 border-l border-white/5">
                    <div className="flex justify-center items-center gap-1">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="action-icon-btn text-[--primary]"
                        title="Editar"
                      >
                        <Pencil className="action-icon" />
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm('Deseja excluir este insumo do estoque?')) {
                            await deleteInventoryItem(item.id)
                          }
                        }}
                        className="action-icon-btn text-[--danger]"
                        title="Excluir"
                      >
                        <Trash2 className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[--secondary-text] italic opacity-40 text-xs">
                    Nenhum insumo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Lote */}
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
            <input name="name" placeholder="Ex: Pacote 250g Kraft" required className="text-sm" list="common-packaging" />
            <datalist id="common-packaging">
              <option value="Pacote 250g" /><option value="Pacote 500g" /><option value="Pacote 1kg" />
              <option value="Rótulo Adesivo" /><option value="Válvula Desgaseificadora" />
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="data-label">Quantidade</label>
              <input 
                name="quantity" type="number" min="1" required 
                value={formQty} onChange={e => setFormQty(e.target.value)}
                className="text-sm" placeholder="Ex: 1000"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Custo Total (R$)</label>
              <input 
                name="total_cost" type="number" step="0.01" min="0" required 
                value={formTotal} onChange={e => setFormTotal(e.target.value)}
                className="text-sm" placeholder="Ex: 150.00"
              />
            </div>
          </div>

          <div className="bg-[--primary]/10 border border-[--primary]/20 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-4 h-4 text-[--primary]" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-[--primary]/60">Custo Unitário</span>
                <span className="text-sm font-serif text-[--primary]">R$ {unitCostCalc.toFixed(3)}</span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="golden-btn py-3 text-sm mt-2 w-full disabled:opacity-50">
            {loading ? 'Calculando...' : 'Finalizar e Gerar Despesa'}
          </button>
        </form>
      </Modal>

      {/* Modal: Editar Item */}
      <Modal 
        isOpen={editingItem !== null} 
        onClose={() => setEditingItem(null)} 
        title="Ajustar Insumo"
      >
        {editingItem && (
          <form action={async (formData) => {
            setLoading(true)
            await updateInventoryItem(formData)
            setLoading(false)
            setEditingItem(null)
          }} className="flex flex-col gap-6">
            <input type="hidden" name="id" value={editingItem.id} />
            <div className="flex flex-col gap-1">
              <label className="data-label">Nome do Insumo</label>
              <input name="name" defaultValue={editingItem.name} required className="text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="data-label">Estoque Atual</label>
                <input name="quantity_available" type="number" defaultValue={editingItem.quantity_available} required className="text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="data-label">Custo Unitário (R$)</label>
                <input name="unit_cost" type="number" step="0.001" defaultValue={editingItem.unit_cost} required className="text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="golden-btn py-3 text-sm mt-2 w-full disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
