'use client'

import { useState } from 'react'
import { Plus, Trash2, MapPin, Truck, Coffee, Star, Pencil } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { 
  createProvider, deleteProvider, updateProvider,
  createOrigin, deleteOrigin, updateOrigin,
  createCoffeeType, deleteCoffeeType, updateCoffeeType,
  createQualityLevel, deleteQualityLevel, updateQualityLevel
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
  const [editingItem, setEditingItem] = useState<{ id: string, name: string, type: ModalType } | null>(null)

  const sections = [
    { id: 'provider', title: 'Fornecedores', data: providers, icon: Truck, action: createProvider, deleteAction: deleteProvider, updateAction: updateProvider, placeholder: 'Ex: Fazenda Santa Clara' },
    { id: 'origin', title: 'Origens', data: origins, icon: MapPin, action: createOrigin, deleteAction: deleteOrigin, updateAction: updateOrigin, placeholder: 'Ex: Sul de Minas' },
    { id: 'type', title: 'Tipos de Café', data: coffeeTypes, icon: Coffee, action: createCoffeeType, deleteAction: deleteCoffeeType, updateAction: updateCoffeeType, placeholder: 'Ex: Arábica' },
    { id: 'quality', title: 'Qualidades', data: qualityLevels, icon: Star, action: createQualityLevel, deleteAction: deleteQualityLevel, updateAction: updateQualityLevel, placeholder: 'Ex: Especial' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      {sections.map((section) => (
        <div key={section.id} className="glass-panel overflow-hidden border-t-2 border-[--primary]/30 flex flex-col shadow-lg">
          <div className="p-2 border-b border-[--card-border] bg-black/40 flex justify-between items-center wood-texture">
            <div className="flex items-center gap-2">
              <section.icon className="w-4 h-4 text-[--primary]" />
              <h2 className="font-serif text-base text-[--primary] tracking-widest uppercase">{section.title}</h2>
            </div>
            <button 
               onClick={() => setActiveModal(section.id as ModalType)}
               className="p-1.5 bg-[--primary]/10 text-[--primary] rounded-full hover:bg-[--primary]/20 transition-all active:scale-90"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="p-2 flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
            {section.data.length > 0 ? (
              section.data.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-2 px-3 rounded-lg bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                  <span className="text-sm font-medium text-[--foreground] opacity-80 group-hover:opacity-100 transition-opacity">{item.name}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingItem({ id: item.id, name: item.name, type: section.id as ModalType })}
                      className="action-icon-btn text-[--primary]"
                    >
                      <Pencil className="action-icon" />
                    </button>
                    <form action={section.deleteAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="action-icon-btn text-[--danger]">
                        <Trash2 className="action-icon" />
                      </button>
                    </form>
                  </div>
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

      {/* Modal para Criação */}
      {sections.map((section) => (
        <Modal
          key={`modal-create-${section.id}`}
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

      {/* Modal para Edição */}
      <Modal
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        title={`Editar: ${sections.find(s => s.id === editingItem?.type)?.title}`}
      >
        {editingItem && (
          <form action={async (formData) => {
            const section = sections.find(s => s.id === editingItem.type)
            if (section) {
              await section.updateAction(formData)
            }
            setEditingItem(null)
          }} className="flex flex-col gap-6">
            <input type="hidden" name="id" value={editingItem.id} />
            <div className="flex flex-col gap-1">
              <label className="data-label">Nome / Descrição</label>
              <input 
                 name="name" 
                 type="text" 
                 defaultValue={editingItem.name} 
                 required 
                 autoFocus
                 className="text-xl"
              />
            </div>
            <button type="submit" className="golden-btn py-5 text-xl w-full">
              Salvar Alterações
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
