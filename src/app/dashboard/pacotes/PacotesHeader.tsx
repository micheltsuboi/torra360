'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { createPackages } from './actions'

interface PacotesHeaderProps {
  roasts: any[]
  expensePackages: any[]
}

export default function PacotesHeader({ roasts, expensePackages }: PacotesHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <button 
          onClick={() => {
            setError(null)
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
          const result = await createPackages(formData)
          if (result?.success) {
            setIsModalOpen(false)
          } else {
            setError(result?.error || 'Erro inesperado')
          }
        }} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}
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
            <label className="data-label font-serif text-[--primary] tracking-wider">Lote Torrado De Origem</label>
            <select name="roast_batch_id" required className="text-sm bg-black/40 border-white/10">
              <option value="">Selecione um Lote Torrado...</option>
              {roasts.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.green_coffee?.name} • {new Date(r.date).toLocaleDateString()} ({r.qty_after_kg}kg disp.)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="data-label">Formato Do Café</label>
              <select name="bean_format" required className="text-sm">
                <option value="Em Grãos">Em Grãos</option>
                <option value="Moído">Moído</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Tamanho Da Embalagem</label>
              <select name="package_size_g" required className="text-sm">
                <option value="250">250g (Padrão)</option>
                <option value="500">500g</option>
                <option value="1000">1kg</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="data-label">Quantidade De Pacotes</label>
              <input name="quantity_units" type="number" min="1" placeholder="Ex: 40" required className="text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Valor De Venda (R$)</label>
              <input name="retail_price" type="number" step="0.01" min="0" placeholder="Ex: 45.90" required className="text-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="data-label">Pacote De Custos Adicionais</label>
            <select name="expense_package_id" className="text-sm">
              <option value="">Nenhum custo adicional</option>
              {expensePackages.map((ep: any) => (
                <option key={ep.id} value={ep.id}>
                  {ep.name} (R$ {ep.total_cost.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-[10px] text-[--secondary-text] leading-relaxed">
             <span className="text-[--primary] font-serif uppercase tracking-widest text-[11px] block mb-1">📊 Inteligência</span> 
             O sistema deduzirá automaticamente o peso do lote torrado selecionado 
             e calculará o custo unitário por pacote baseado no café verde + custos operacionais.
          </div>

          <button type="submit" className="golden-btn py-5 text-xl mt-2 w-full font-serif tracking-widest uppercase">
            Finalizar E Criar Produtos
          </button>
        </form>
      </Modal>
    </div>
  )
}
