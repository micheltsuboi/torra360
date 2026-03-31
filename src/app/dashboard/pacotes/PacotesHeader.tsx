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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="golden-btn flex items-center gap-2 px-8 py-4 text-lg"
        >
          <ShoppingBag className="w-6 h-6" />
          Registrar Novo Embalamento
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Novo Lote de Produtos"
      >
        <form action={async (formData) => {
          await createPackages(formData)
          setIsModalOpen(false)
        }} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="data-label">Data de Produção</label>
            <input 
              name="date" 
              type="date" 
              required 
              defaultValue={new Date().toISOString().split('T')[0]} 
              className="text-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="data-label">Lote Torrado de Origem</label>
            <select name="roast_batch_id" required className="text-lg">
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
              <label className="data-label">Formato do Café</label>
              <select name="bean_format" required className="text-lg">
                <option value="Grãos Inteiros">Grãos Inteiros</option>
                <option value="Café Moído">Café Moído</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Tamanho do Pacote (g)</label>
              <select name="package_size_g" required className="text-lg">
                <option value="250">250g (Padrão)</option>
                <option value="500">500g</option>
                <option value="1000">1kg</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="data-label">Quantidade de Pacotes</label>
              <div className="relative">
                <input name="quantity_units" type="number" min="1" placeholder="Ex: 40" required className="text-xl" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-30 capitalize">UNID</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label text-[--primary] !opacity-100">Valor de Venda (R$)</label>
              <div className="relative">
                <input name="retail_price" type="number" step="0.01" min="0" placeholder="Ex: 45.90" required className="text-xl border-[--primary]/30 focus:border-[--primary]" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[--primary]">R$</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="data-label">Pacote de Custos Adicionais</label>
            <select name="expense_package_id" className="text-lg">
              <option value="">Nenhum custo adicional</option>
              {expensePackages.map((ep: any) => (
                <option key={ep.id} value={ep.id}>
                  {ep.name} (R$ {ep.total_cost.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-[--primary]/5 rounded-xl border border-[--primary]/10 text-[11px] text-[--secondary-text] capitalize font-bold italic leading-relaxed">
             <span className="text-[--primary]">📊 Inteligência:</span> O sistema deduzirá automaticamente o peso do lote torrado selecionado 
             e calculará o custo unitário por pacote baseado no café verde + custos operacionais.
          </div>

          <button type="submit" className="golden-btn py-5 text-xl mt-2 w-full">
            Finalizar e Criar Produtos
          </button>
        </form>
      </Modal>
    </div>
  )
}
