'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, Minus } from 'lucide-react'
import { createBlend } from './actions'

interface Lot {
  id: string
  name: string
  available_qty_kg: number
}

export default function BlendForm({ lots, onComplete }: { lots: Lot[], onComplete?: () => void }) {
  const [name, setName] = useState('')
  const [components, setComponents] = useState<{ lotId: string, qty: number }[]>([
    { lotId: '', qty: 0 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const availableLots = lots.filter(l => l.available_qty_kg > 0)

  const totalQty = useMemo(() => {
    return components.reduce((acc, curr) => acc + (curr.qty || 0), 0)
  }, [components])

  const addComponent = () => {
    setComponents([...components, { lotId: '', qty: 0 }])
  }

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index))
  }

  const updateComponent = (index: number, field: 'lotId' | 'qty', value: string | number) => {
    const newComponents = [...components]
    newComponents[index] = { ...newComponents[index], [field]: value }
    setComponents(newComponents)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || components.some(c => !c.lotId || c.qty <= 0)) {
      setMessage({ type: 'error', text: 'Preencha todos os campos corretamente.' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await createBlend({ name, components })
      if (result.success) {
        setMessage({ type: 'success', text: 'Blend criado com sucesso!' })
        if (onComplete) {
           setTimeout(() => onComplete(), 1000)
        } else {
          setName('')
          setComponents([{ lotId: '', qty: 0 }])
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro ao criar blend.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="data-label">Nome do Novo Blend comercial</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text" 
            placeholder="Ex: Blend Especial de Inverno" 
            required 
            className="text-lg bg-black/40 border-[--card-border]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="data-label">Composição dos Grãos</label>
          
          <div className="flex flex-col gap-2">
            {components.map((comp, index) => {
              const percentage = totalQty > 0 ? ((comp.qty / totalQty) * 100).toFixed(1) : '0'
              const selectedLot = lots.find(l => l.id === comp.lotId)
              
              return (
                <div key={index} className="flex flex-col gap-2 p-2 rounded-xl bg-black/40 border border-[--card-border]/30 relative transition-all hover:bg-black/60 shadow-xl group">
                  <div className="flex flex-col md:flex-row gap-2 items-center">
                    
                    {/* Select Lote */}
                    <div className="flex-1 w-full">
                      <select 
                        value={comp.lotId}
                        onChange={(e) => updateComponent(index, 'lotId', e.target.value)}
                        className="bg-black/60 text-sm border-white/10 w-full"
                        required
                      >
                        <option value="">Selecionar Lote...</option>
                        {availableLots.map(l => (
                          <option key={l.id} value={l.id}>
                            {l.name} ({l.available_qty_kg}kg)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantidade e Controles */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => updateComponent(index, 'qty', Math.max(0, (comp.qty || 0) - 1))}
                          className="qty-btn-premium"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <div className="w-20 relative">
                          <input 
                            type="number" 
                            step="0.01"
                            value={comp.qty || ''}
                            onChange={(e) => updateComponent(index, 'qty', parseFloat(e.target.value) || 0)}
                            placeholder="0.0"
                            className="bg-black/60 border-white/10 text-center text-sm w-full p-2 rounded-lg"
                            required
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[--primary] font-bold opacity-40">KG</span>
                        </div>

                        <button 
                          type="button"
                          onClick={() => updateComponent(index, 'qty', (comp.qty || 0) + 1)}
                          className="qty-btn-premium"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="min-w-[60px]   font-mono text-[--primary] text-sm font-bold bg-[--primary]/10 px-2 py-1 rounded">
                        {percentage}%
                      </div>

                      {/* Lixeira */}
                      {components.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeComponent(index)}
                          className="p-2 text-[--danger] hover:bg-[--danger]/10 rounded-full transition-all"
                          title="Remover Item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {selectedLot && comp.qty > selectedLot.available_qty_kg && (
                    <p className="text-[--danger] text-[10px] capitalize font-bold text-center bg-[--danger]/10 py-1 rounded">
                      Quantidade excede o disponível ({selectedLot.available_qty_kg}kg)
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <button 
            type="button" 
            onClick={addComponent}
            className="flex items-center justify-center gap-2 text-[--primary] border border-dashed border-[--primary]/30 py-3 rounded-xl hover:bg-[--primary]/5 transition-all text-xs font-bold capitalize tracking-widest"
          >
            <Plus className="w-4 h-4" /> Adicionar Outro Lote
          </button>
        </div>

        <div className="mt-8 p-6 bg-black/60 rounded-2xl border border-[--primary]/20 flex justify-between items-center shadow-2xl">
            <div className="flex flex-col">
              <span className="data-label">Total do Blend Final</span>
              <span className="text-3xl font-bold text-[--primary] font-serif">{totalQty.toFixed(2)} <span className="text-sm font-sans">kg</span></span>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || totalQty <= 0}
              className="golden-btn px-10 py-5 text-lg"
            >
              {isSubmitting ? 'Processando...' : 'Finalizar Blend'}
            </button>
        </div>

        {message && (
          <p className={`text-center text-sm font-medium mt-2 p-2 rounded bg-white/5 border border-white/5 ${message.type === 'error' ? 'text-[--danger]' : 'text-[--success]'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  )
}
