'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ErrorModal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const error = searchParams.get('error')

  useEffect(() => {
    if (error === 'tenant_inactive') {
      setIsOpen(true)
    }
  }, [error])

  const handleClose = () => {
    setIsOpen(false)
    // Remove o erro da URL ao fechar o modal
    const params = new URLSearchParams(searchParams.toString())
    params.delete('error')
    router.replace(`/login${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Acesso Suspenso"
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-500/10 rounded-full mb-2">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-bold text-[--foreground] mb-2">Sua organização está inativa</p>
          <p className="text-[--secondary-text]">
            Lamentamos informar que o acesso da sua organização ao Torra 360 foi temporariamente suspenso.
          </p>
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg text-sm italic text-[--secondary-text]">
            "Para regularizar sua situação e restabelecer o acesso, por favor entre em contato com nosso suporte administrativo."
          </div>
        </div>

        <button 
          onClick={handleClose}
          className="primary-btn w-full mt-4"
        >
          Entendi
        </button>
      </div>
    </Modal>
  )
}
