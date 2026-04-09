'use client'

import { useState } from 'react'
import { Box, Plus } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { createGreenCoffeeLot } from './actions'

interface EstoqueHeaderProps {
  lots: any[]
  providers: any[]
  origins: any[]
  coffeeTypes: any[]
  qualityLevels: any[]
}

export default function EstoqueHeader({ 
  lots, 
  providers, 
  origins, 
  coffeeTypes, 
  qualityLevels 
}: EstoqueHeaderProps) {
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setIsLoteModalOpen(true)}
          className="golden-btn flex items-center gap-2 px-6 py-3"
        >
          <Box className="w-5 h-5" />
          Novo Lote de Café Verde
        </button>
      </div>

      {/* Modal: Entrada de Lote */}
      <Modal 
        isOpen={isLoteModalOpen} 
        onClose={() => setIsLoteModalOpen(false)} 
        title="Entrada de Novo Lote"
      >
        <form action={async (formData) => {
          await createGreenCoffeeLot(formData)
          setIsLoteModalOpen(false)
        }} className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="data-label">Nome do Lote</label>
            <input name="name" type="text" placeholder="Ex: Lote Especial Sul de Minas" required />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="data-label">Qtd Total (kg)</label>
              <input name="total_qty_kg" type="number" step="0.01" placeholder="20" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Custo Total (R$)</label>
              <input name="total_cost" type="number" step="0.01" placeholder="1500.00" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="data-label">Fornecedor</label>
              <select name="provider" required>
                <option value="">Selecione...</option>
                {providers.map((p: any) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Origem</label>
              <select name="origin" required>
                <option value="">Selecione...</option>
                {origins.map((o: any) => (
                  <option key={o.id} value={o.name}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="data-label">Tipo Café</label>
              <select name="coffee_type">
                {coffeeTypes.map((ct: any) => (
                  <option key={ct.id} value={ct.name}>{ct.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Qualidade</label>
              <select name="quality_level">
                {qualityLevels.map((ql: any) => (
                  <option key={ql.id} value={ql.name}>{ql.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
               <div className="flex flex-col gap-1">
                  <label className="data-label">Pontuação</label>
                  <input name="score" type="text" placeholder="84+" />
               </div>
               <div className="flex flex-col gap-1">
                  <label className="data-label">Peneira</label>
                  <input name="sieve" type="text" placeholder="15/16" />
               </div>
          </div>

          <button type="submit" className="golden-btn mt-4 w-full py-4 text-lg">
            Finalizar Cadastro do Lote
          </button>
        </form>
      </Modal>
    </div>
  )
}

