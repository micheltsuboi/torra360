'use client'

import { useState } from 'react'
import { Flame } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { createRoastBatch } from './actions'
import RoastParameterList from '@/components/ui/RoastParameterList'

interface TorraHeaderProps {
  greenLots: any[]
}

export default function TorraHeader({ greenLots }: TorraHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parameters, setParameters] = useState<any[]>([])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <button 
          onClick={() => {
            setError(null)
            setParameters([])
            setIsModalOpen(true)
          }}
          className="golden-btn flex items-center gap-2 px-8 py-4 text-lg"
        >
          <Flame className="w-6 h-6" />
          Registrar Nova Torra
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setError(null)
        }} 
        title="Nova Sessão de Torra"
      >
        <form action={async (formData) => {
          setError(null)
          const result = await createRoastBatch(formData)
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

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="data-label">Data da Torra</label>
              <input 
                name="date" 
                type="date" 
                required 
                defaultValue={new Date().toISOString().split('T')[0]} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Lote de Café Verde</label>
              <select name="green_coffee_id" required>
                <option value="">Selecione...</option>
                {greenLots.map((l: any) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.available_qty_kg}kg disp.)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="data-label">Kg Verde (Antes)</label>
              <input name="qty_before_kg" type="number" step="0.01" placeholder="10.0" required />
            </div>
            <div className="flex flex-col gap-1">
               <label className="data-label text-[--primary] !opacity-100">Kg Torrado (Depois)</label>
               <input name="qty_after_kg" type="number" step="0.01" placeholder="8.4" required className="border-[--primary]/50 shadow-[0_0_15px_rgba(195,153,103,0.1)] focus:border-[--primary]" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="data-label">Custo Operacional (R$/kg)</label>
              <input name="operational_cost" type="number" step="0.01" defaultValue="4.00" required />
            </div>
          </div>

          <div className="px-3 py-2 bg-white/5 rounded-lg text-[9px] text-[--secondary-text] leading-tight opacity-70">
            <span className="text-[--primary] uppercase tracking-tighter mr-1">Nota:</span> Rendimento e custos processados automaticamente com base no custo operacional informado.
          </div>

          <div className="border-t border-white/5 pt-4">
            <RoastParameterList onChange={setParameters} />
            <input type="hidden" name="roast_parameters" value={JSON.stringify(parameters)} />
          </div>

          <button type="submit" className="golden-btn py-4 text-lg mt-2 w-full">
            Finalizar e Salvar Produção
          </button>
        </form>
      </Modal>
    </div>
  )
}
