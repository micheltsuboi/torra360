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
    <div className={`flex flex-col rounded-lg border transition-all ${isFocused ? 'border-[--primary] ring-1 ring-[--primary]/20' : 'border-white/10'} bg-black/40 overflow-hidden`}>
      <div className="flex items-center gap-1 p-1 border-b border-white/5 bg-white/5">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1.5 rounded hover:bg-white/10 text-[--secondary-text] hover:text-[--primary] transition-colors"
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1.5 rounded hover:bg-white/10 text-[--secondary-text] hover:text-[--primary] transition-colors"
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1.5 rounded hover:bg-white/10 text-[--secondary-text] hover:text-[--primary] transition-colors"
          title="Lista"
        >
          <List className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('foreColor', '#c39967')}
          className="p-1.5 rounded hover:bg-white/10 text-[--primary] transition-colors"
          title="Cor Dourada"
        >
          <Palette className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('foreColor', '#ffffff')}
          className="p-1.5 rounded hover:bg-white/10 text-white transition-colors"
          title="Cor Branca"
        >
          <Type className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="p-3 min-h-[100px] text-sm focus:outline-none text-[--foreground] prose prose-invert max-w-none"
        placeholder={placeholder}
      />
      {(!value || value === '<br>') && !isFocused && (
        <div className="absolute top-[45px] left-3 text-white/20 text-xs pointer-events-none">
          {placeholder || 'Digite os parâmetros aqui...'}
        </div>
      )}
    </div>
  )
}
