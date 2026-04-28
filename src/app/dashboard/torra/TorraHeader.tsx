'use client'



import { useState } from 'react'
import { Flame, BookOpen, Pencil, Trash2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { createRoastBatch, saveRoastParameters, deleteRoastParameters } from './actions'
import { formatDate } from '@/utils/date-utils'

interface TorraHeaderProps {
  greenLots: any[]
  roastBatches: any[]
}

export default function TorraHeader({ greenLots, roastBatches }: TorraHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isParamModalOpen, setIsParamModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paramError, setParamError] = useState<string | null>(null)
  
  // Estados para Nova Torra
  const [roastParamText, setRoastParamText] = useState('')
  
  // Estados para Registrar Parâmetros
  const [selectedRoastId, setSelectedRoastId] = useState('')
  const [paramText, setParamText] = useState('')

  // Filtra apenas as torras que têm parâmetros para exibir nos cards
  const roastsWithParams = roastBatches?.filter(r => 
    r.roast_parameters && 
    Array.isArray(r.roast_parameters) && 
    r.roast_parameters.length > 0 &&
    r.roast_parameters[0].content
  ) || []

  const handleSaveParameters = async (e: React.FormEvent) => {
    e.preventDefault()
    setParamError(null)
    
    if (!selectedRoastId) {
      setParamError('Selecione um lote de torra.')
      return
    }

    const result = await saveRoastParameters(selectedRoastId, paramText)
    if (result?.success) {
      setIsParamModalOpen(false)
      setParamText('')
      setSelectedRoastId('')
    } else {
      setParamError(result?.error || 'Erro inesperado')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end items-center gap-4 w-full">
        <button 
          onClick={() => {
            setError(null)
            setRoastParamText('')
            setIsModalOpen(true)
          }}
          className="golden-btn flex items-center gap-2 px-6 py-3 text-base"
        >
          <Flame className="w-5 h-5" />
          Registrar Nova Torra
        </button>

        <button 
          onClick={() => {
            setParamError(null)
            setParamText('')
            setSelectedRoastId('')
            setIsParamModalOpen(true)
          }}
          className="golden-btn flex items-center gap-2 px-6 py-3 text-base"
        >
          <BookOpen className="w-5 h-5" />
          Registrar Parâmetros
        </button>
      </div>

      {/* Modal de Nova Torra */}
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
          // Prepara o parâmetro no formato esperado pelo banco
          const params = roastParamText ? [{ id: '1', title: 'Registro de Torra', content: roastParamText }] : []
          formData.set('roast_parameters', JSON.stringify(params))
          
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

          <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
            <label className="data-label">Parâmetros de Torra (Texto Livre)</label>
            <textarea 
              value={roastParamText}
              onChange={(e) => setRoastParamText(e.target.value)}
              placeholder="Ex: temperatura inicial: 185°&#10;velocidade do tambor: 42&#10;&#10;2min: 205°&#10;6min: 210°"
              className="min-h-[150px] text-sm font-mono bg-black/40 border border-white/10 rounded-xl p-3 focus:border-[--primary]/50 outline-none resize-none text-[--foreground]"
            />
          </div>

          <button type="submit" className="golden-btn py-4 text-lg mt-2 w-full">
            Finalizar e Salvar Produção
          </button>
        </form>
      </Modal>

      {/* Modal de Registrar Parâmetros */}
      <Modal 
        isOpen={isParamModalOpen} 
        onClose={() => {
          setIsParamModalOpen(false)
          setParamError(null)
        }} 
        title="Registrar Parâmetros de Torra"
      >
        <form onSubmit={handleSaveParameters} className="flex flex-col gap-6">
          {paramError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs font-semibold">
              ⚠️ {paramError}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="data-label">Selecione o Lote de Torra</label>
            <select 
              value={selectedRoastId} 
              onChange={(e) => {
                setSelectedRoastId(e.target.value)
                // Carrega o texto existente se houver
                const roast = roastBatches.find(r => r.id === e.target.value)
                if (roast?.roast_parameters?.[0]?.content) {
                  setParamText(roast.roast_parameters[0].content)
                } else {
                  setParamText('')
                }
              }} 
              required
            >
              <option value="">Selecione...</option>
              {roastBatches.map((r: any) => (
                <option key={r.id} value={r.id}>
                  Lote #{r.id.slice(-6).toUpperCase()} - {r.green_coffee?.name || r.green_coffee_name} ({formatDate(r.date)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="data-label">Parâmetros de Torra (Texto Livre)</label>
            <textarea 
              value={paramText}
              onChange={(e) => setParamText(e.target.value)}
              placeholder="Ex: temperatura inicial: 185°&#10;velocidade do tambor: 42&#10;&#10;2min: 205°&#10;6min: 210°"
              className="min-h-[150px] text-sm font-mono bg-black/40 border border-white/10 rounded-xl p-3 focus:border-[--primary]/50 outline-none resize-none text-[--foreground]"
            />
          </div>

          <button type="submit" className="golden-btn py-4 text-lg mt-2 w-full">
            Salvar Parâmetros
          </button>
        </form>
      </Modal>

      {/* Cards de Parâmetros Embaixo */}
      {roastsWithParams.length > 0 && (
        <div className="flex flex-col gap-3 mt-6">
          <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Parâmetros Registrados</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[--primary]/20">
            {roastsWithParams.map((r: any) => (
              <div 
                key={r.id} 
                onClick={() => {
                  setSelectedRoastId(r.id)
                  setParamText(r.roast_parameters[0].content)
                  setIsParamModalOpen(true)
                }}
                className="flex-shrink-0 w-[280px] glass-panel overflow-hidden hover:border-[--primary]/50 transition-all cursor-pointer"
              >
                <div className="px-4 py-2 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
                  <span className="text-[10px] font-serif font-bold text-[--primary] uppercase tracking-wider">
                    REGISTRO DE TORRA L: #{r.id.slice(-6).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRoastId(r.id)
                        setParamText(r.roast_parameters[0].content)
                        setIsParamModalOpen(true)
                      }}
                      className="action-icon-btn text-[--primary] hover:opacity-80 transition-opacity"
                      title="Editar Parâmetros"
                    >
                      <Pencil className="action-icon w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (confirm('Deseja realmente excluir estes parâmetros de torra?')) {
                          await deleteRoastParameters(r.id)
                        }
                      }}
                      className="action-icon-btn text-[--danger] hover:opacity-80 transition-opacity"
                      title="Excluir Parâmetros"
                    >
                      <Trash2 className="action-icon w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 text-xs text-[--secondary-text] font-mono h-[120px] overflow-y-auto whitespace-pre-wrap leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                  {r.roast_parameters[0].content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
