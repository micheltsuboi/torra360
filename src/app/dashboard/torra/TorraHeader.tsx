'use client'

import { useState } from 'react'
import { Flame } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { createRoastBatch } from './actions'

interface TorraHeaderProps {
  greenLots: any[]
}

export default function TorraHeader({ greenLots }: TorraHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="golden-btn flex items-center gap-2 px-8 py-4 text-lg"
        >
          <Flame className="w-6 h-6" />
          Registrar Nova Torra
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nova Sessão de Torra"
      >
        <form action={async (formData) => {
          await createRoastBatch(formData)
          setIsModalOpen(false)
        }} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="data-label">Data da Torra</label>
            <input 
              name="date" 
              type="date" 
              required 
              defaultValue={new Date().toISOString().split('T')[0]} 
              className="text-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="data-label">Lote de Café Verde Utilizado</label>
            <select name="green_coffee_id" required className="text-lg">
              <option value="">Selecione um Lote...</option>
              {greenLots.map((l: any) => (
                <option key={l.id} value={l.id}>{l.name} ({l.available_qty_kg}kg disp.)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-2">
            <div className="flex flex-col gap-1">
              <label className="data-label">Kg Verde (Antes)</label>
              <div className="relative">
                <input name="qty_before_kg" type="number" step="0.01" placeholder="10.0" required className="text-xl pr-10" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold opacity-30">KG</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
               <label className="data-label text-[--primary] !opacity-100">Kg Torrado (Depois)</label>
               <div className="relative">
                 <input name="qty_after_kg" type="number" step="0.01" placeholder="8.4" required className="text-xl pr-10 border-[--primary]/50 shadow-[0_0_15px_rgba(195,153,103,0.1)] focus:border-[--primary]" />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[--primary]">KG</span>
               </div>
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-[11px] text-[--secondary-text] capitalize font-bold italic leading-relaxed">
             <span className="text-[--primary]">💡 Dica:</span> O custo operacional padrão é de R$ 4,00 por Kg torrado. 
             O rendimento e os custos finais serão processados automaticamente pelo sistema.
          </div>

          <button type="submit" className="golden-btn py-5 text-xl mt-2 w-full">
            Finalizar e Salvar Produção
          </button>
        </form>
      </Modal>
    </div>
  )
}
