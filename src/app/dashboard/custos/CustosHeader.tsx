'use client'

import { useState } from 'react'
import { Plus, Package } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { createExpensePackage } from './actions'

export default function CustosHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="golden-btn flex items-center gap-2 px-8 py-4 text-lg"
        >
          <Package className="w-6 h-6" />
          Novo Pacote de Custos
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Criar Novo Pacote de Insumos"
      >
        <form action={async (formData) => {
          await createExpensePackage(formData)
          setIsModalOpen(false)
        }} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="data-label">Nome do Pacote</label>
            <input 
              name="name" 
              type="text" 
              placeholder="Ex: Embalagem 250g Premium, Kit Filtros..." 
              required 
              className="text-xl"
            />
          </div>

          <div className="p-4 bg-[--primary]/5 rounded-xl border border-[--primary]/10 text-[11px] text-[--secondary-text] uppercase font-bold italic leading-relaxed">
             <span className="text-[--primary]">💡 Estratégia:</span> Crie pacotes que agrupam todos os custos indiretos 
             (embalagem, etiquetas, lacres, fretes) para que o sistema possa calcular a margem de lucro real de cada produto final.
          </div>

          <button type="submit" className="golden-btn py-5 text-xl mt-2 w-full">
            Criar Estrutura de Custo
          </button>
        </form>
      </Modal>
    </div>
  )
}
