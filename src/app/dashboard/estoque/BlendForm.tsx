'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, Calculator } from 'lucide-react'
import { createBlend } from './actions'

interface Lot {
  id: string
  name: string
  available_qty_kg: number
}

export default function BlendForm({ lots }: { lots: Lot[] }) {
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
        setName('')
        setComponents([{ lotId: '', qty: 0 }])
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
    <div className="p-6 h-fit bg-black/20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[--secondary-text] uppercase font-bold">Nome do Novo Blend</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text" 
            placeholder="Ex: Blend Especial de Inverno" 
            required 
            className="bg-black/40 border-[--card-border]"
          />
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <label className="text-xs text-[--secondary-text] uppercase font-bold">Composição do Blend</label>
          
          {components.map((comp, index) => {
            const percentage = totalQty > 0 ? ((comp.qty / totalQty) * 100).toFixed(1) : '0'
            const selectedLot = lots.find(l => l.id === comp.lotId)
            
            return (
              <div key={index} className="flex flex-col gap-2 p-3 rounded bg-white/5 border border-white/5 relative group transition-colors hover:bg-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <select 
                      value={comp.lotId}
                      onChange={(e) => updateComponent(index, 'lotId', e.target.value)}
                      className="bg-black/60 text-sm border-white/10"
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
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      step="0.01"
                      value={comp.qty || ''}
                      onChange={(e) => updateComponent(index, 'qty', parseFloat(e.target.value))}
                      placeholder="Qtd (kg)"
                      className="bg-black/60 text-sm flex-1 border-white/10"
                      required
                    />
                    <div className="w-16 text-right font-mono text-[--primary] text-xs font-bold">
                      {percentage}%
                    </div>
                  </div>
                </div>

                {components.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeComponent(index)}
                    className="absolute -right-2 -top-2 bg-[--danger] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                
                {selectedLot && comp.qty > selectedLot.available_qty_kg && (
                  <p className="text-[--danger] text-[10px] uppercase font-bold mt-1">Quantidade excede o disponível ({selectedLot.available_qty_kg}kg)</p>
                )}
              </div>
            )
          })}

          <button 
            type="button" 
            onClick={addComponent}
            className="flex items-center justify-center gap-2 py-2 border border-dashed border-[--primary]/30 text-[--primary] text-xs hover:bg-[--primary]/10 transition-colors rounded uppercase tracking-widest font-bold"
          >
            <Plus className="w-3 h-3" /> Adicionar Lote ao Blend
          </button>
        </div>

        <div className="mt-4 p-4 bg-black/60 rounded border border-white/10 flex justify-between items-center shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-[--secondary-text] font-bold">Total do Blend Final</span>
              <span className="text-xl font-bold text-[--success]">{totalQty.toFixed(2)} kg</span>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || totalQty <= 0}
              className="primary-btn h-fit py-2 px-8 uppercase text-xs tracking-widest transition-transform hover:scale-105 active:scale-95"
            >
              {isSubmitting ? 'Processando...' : 'Finalizar Blend'}
            </button>
        </div>

        {message && (
          <p className={`text-center text-sm font-medium mt-2 ${message.type === 'error' ? 'text-[--danger]' : 'text-[--success]'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  )
}
