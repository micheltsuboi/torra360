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
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '10px', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            background: 'rgba(195, 153, 103, 0.1)', 
            color: 'var(--primary)', 
            border: '1px solid rgba(195, 153, 103, 0.3)', 
            padding: '6px 12px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(195, 153, 103, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(195, 153, 103, 0.1)'}
        >
          <Plus style={{ width: '14px', height: '14px' }} />
          Adicionar Parâmetro
        </button>
      </div>

      {parameters.length === 0 && (
        <div className="text-[10px] text-[--secondary-text] opacity-40 italic p-6 border border-dashed border-white/10 rounded-xl text-center">
          Nenhum parâmetro adicionado. Clique acima para adicionar.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {parameters.map((param, index) => (
          <div key={param.id} className="group bg-black/40 rounded-xl border border-white/5 overflow-hidden transition-all hover:border-[--primary]/20">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
              <input
                value={param.title}
                onChange={(e) => updateParameter(param.id, { title: e.target.value })}
                className="!bg-transparent !border-none !p-0 text-xs font-bold text-[--primary] focus:!ring-0 w-full outline-none"
                placeholder="Título do parâmetro..."
              />
              <button
                type="button"
                onClick={() => removeParameter(param.id)}
                className="action-icon-btn text-[--danger] !opacity-40 hover:!opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
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
