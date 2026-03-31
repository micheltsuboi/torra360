'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import ClientForm from './ClientForm'

export default function ClientPageHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center mb-8 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Clientes</h1>
          <p className="text-[--secondary-text] mt-1 italic opacity-60">Gerencie sua base de contatos e histórico de compras.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="golden-btn flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Cadastrar Novo Cliente"
      >
        <div className="max-w-xl mx-auto">
          <ClientForm onSuccess={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </>
  )
}
