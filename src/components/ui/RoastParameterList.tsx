'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import RichTextEditor from './RichTextEditor'

interface RoastParameter {
  id: string
  title: string
  content: string
}

interface RoastParameterListProps {
  initialParameters?: RoastParameter[]
  onChange: (parameters: RoastParameter[]) => void
}

export default function RoastParameterList({ initialParameters = [], onChange }: RoastParameterListProps) {
  const [parameters, setParameters] = useState<RoastParameter[]>(initialParameters)

  const addParameter = () => {
    const newParams = [
      ...parameters,
      { id: crypto.randomUUID(), title: `Parâmetro ${parameters.length + 1}`, content: '' }
    ]
    setParameters(newParams)
    onChange(newParams)
  }

  const removeParameter = (id: string) => {
    const newParams = parameters.filter(p => p.id !== id)
    setParameters(newParams)
    onChange(newParams)
  }

  const updateParameter = (id: string, updates: Partial<RoastParameter>) => {
    const newParams = parameters.map(p => p.id === id ? { ...p, ...updates } : p)
    setParameters(newParams)
    onChange(newParams)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-serif uppercase tracking-widest text-[--primary] opacity-80">Parâmetros de Torra</label>
        <button
          type="button"
          onClick={addParameter}
          className="flex items-center gap-1 text-[10px] uppercase tracking-tighter bg-[--primary]/10 hover:bg-[--primary]/20 text-[--primary] px-2 py-1 rounded transition-colors"
        >
          <Plus className="w-3 h-3" />
          Adicionar Parâmetro
        </button>
      </div>

      {parameters.length === 0 && (
        <div className="text-[10px] text-[--secondary-text] opacity-40 italic p-4 border border-dashed border-white/10 rounded-lg text-center">
          Nenhum parâmetro adicionado. Clique acima para adicionar.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {parameters.map((param, index) => (
          <div key={param.id} className="group bg-black/20 rounded-xl border border-white/5 overflow-hidden transition-all hover:border-white/10">
            <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/5">
              <input
                value={param.title}
                onChange={(e) => updateParameter(param.id, { title: e.target.value })}
                className="bg-transparent border-none p-0 text-xs font-bold text-[--primary] focus:ring-0 w-full"
                placeholder="Título do parâmetro..."
              />
              <button
                type="button"
                onClick={() => removeParameter(param.id)}
                className="text-[--danger] opacity-40 hover:opacity-100 transition-opacity p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <RichTextEditor
                value={param.content}
                onChange={(content) => updateParameter(param.id, { content })}
                placeholder="Detalhes da torra (tempo, temperatura, etc)..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
