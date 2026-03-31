'use client'

import { useState } from 'react'
import { Plus, Trash2, MapPin, Truck, Coffee, Star } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { 
  createProvider, deleteProvider,
  createOrigin, deleteOrigin,
  createCoffeeType, deleteCoffeeType,
  createQualityLevel, deleteQualityLevel
} from './actions'

interface ParametrosClientProps {
  providers: any[]
  origins: any[]
  coffeeTypes: any[]
  qualityLevels: any[]
}

type ModalType = 'provider' | 'origin' | 'type' | 'quality' | null

export default function ParametrosClient({ 
  providers, origins, coffeeTypes, qualityLevels 
}: ParametrosClientProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const sections = [
    { id: 'provider', title: 'Fornecedores', data: providers, icon: Truck, action: createProvider, deleteAction: deleteProvider, placeholder: 'Ex: Fazenda Santa Clara' },
    { id: 'origin', title: 'Origens', data: origins, icon: MapPin, action: createOrigin, deleteAction: deleteOrigin, placeholder: 'Ex: Sul de Minas' },
    { id: 'type', title: 'Tipos de Café', data: coffeeTypes, icon: Coffee, action: createCoffeeType, deleteAction: deleteCoffeeType, placeholder: 'Ex: Arábica' },
    { id: 'quality', title: 'Qualidades', data: qualityLevels, icon: Star, action: createQualityLevel, deleteAction: deleteQualityLevel, placeholder: 'Ex: Especial' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      {sections.map((section) => (
        <div key={section.id} className="glass-panel overflow-hidden border-t-2 border-[--primary]/30 flex flex-col shadow-lg">
          <div className="p-4 border-b border-[--card-border] bg-black/40 flex justify-between items-center wood-texture">
            <div className="flex items-center gap-2">
              <section.icon className="w-5 h-5 text-[--primary]" />
              <h2 className="font-serif text-lg text-[--primary]">{section.title}</h2>
            </div>
            <button 
               onClick={() => setActiveModal(section.id as ModalType)}
               className="p-1.5 bg-[--primary]/10 text-[--primary] rounded-full hover:bg-[--primary]/20 transition-all active:scale-90"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
            {section.data.length > 0 ? (
              section.data.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                  <span className="text-sm font-medium text-[--foreground] opacity-80 group-hover:opacity-100 transition-opacity">{item.name}</span>
                  <form action={section.deleteAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="text-[--danger] p-1.5 hover:bg-[--danger]/10 rounded-full transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-xs text-[--secondary-text] italic opacity-40">
                Nenhum registro encontrado.
              </div>
            )}
          </div>
        </div>
      ))}

      {sections.map((section) => (
        <Modal
          key={`modal-${section.id}`}
          isOpen={activeModal === section.id}
          onClose={() => setActiveModal(null)}
          title={`Novo item: ${section.title}`}
        >
          <form action={async (formData) => {
            await section.action(formData)
            setActiveModal(null)
          }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="data-label">Nome / Descrição</label>
              <input 
                 name="name" 
                 type="text" 
                 placeholder={section.placeholder} 
                 required 
                 autoFocus
                 className="text-xl"
              />
            </div>
            <button type="submit" className="golden-btn py-5 text-xl w-full">
              Confirmar Cadastro
            </button>
          </form>
        </Modal>
      ))}
    </div>
  )
}
