'use client'

import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, List, Type, Palette } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Sincroniza o valor inicial
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [])

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className={`relative flex flex-col rounded-lg border transition-all ${isFocused ? 'border-[--primary] ring-1 ring-[--primary]/20' : 'border-white/10'} bg-black/40 overflow-hidden`}>
      <div className="flex items-center gap-3 p-2 border-b border-white/5 bg-white/5">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
          className="action-icon-btn"
          title="Negrito"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
          className="action-icon-btn"
          title="Itálico"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
          className="action-icon-btn"
          title="Lista"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3.5 bg-white/10 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('foreColor', '#c39967'); }}
          className="action-icon-btn text-[--primary] !opacity-80 hover:!opacity-100"
          title="Cor Dourada"
        >
          <Palette className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('foreColor', '#ffffff'); }}
          className="action-icon-btn text-white !opacity-80 hover:!opacity-100"
          title="Cor Branca"
        >
          <Type className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="p-3 min-h-[100px] text-sm focus:outline-none text-[--foreground] custom-rich-text relative z-10"
        />
        {(!value || value === '<br>' || value === '') && !isFocused && (
          <div className="absolute top-3 left-3 text-white/20 text-xs pointer-events-none z-0">
            {placeholder || 'Digite os parâmetros aqui...'}
          </div>
        )}
      </div>
    </div>
  )
}
