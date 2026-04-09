'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { markSaleAsPaid } from './actions'

interface Sale {
  id: string
  payment_status: string
  payment_method: string
}

export default function PaymentStatusControl({ sale }: { sale: Sale }) {
  const [isPending, startTransition] = useTransition()
  const [selectedMethod, setSelectedMethod] = useState('Pix')
  const isPaid = sale.payment_status === 'paid'

  const handleConfirm = async () => {
    if (!confirm(`Confirmar recebimento via ${selectedMethod}?`)) return
    
    startTransition(async () => {
      try {
        await markSaleAsPaid(sale.id, selectedMethod)
      } catch (error) {
        alert('Erro ao confirmar pagamento')
      }
    })
  }

  if (isPaid) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 text-[11px] bg-[--success]/10 text-[--success] px-2 py-0.5 rounded-full border border-[--success]/20 font-bold capitalize whitespace-nowrap">
          <CheckCircle2 className="w-3 h-3" />
          {sale.payment_method}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-2">
      <div className="flex items-center gap-1.5 text-[11px] bg-[--warning]/10 text-[--warning] px-2 py-0.5 rounded-full border border-[--warning]/20 font-bold whitespace-nowrap">
        <Clock className="w-3 h-3" />
        Pendente
      </div>
      
      <div className="flex items-center gap-1 bg-black/40 p-0.5 px-1.5 rounded-lg border border-white/5 shadow-inner">
        <select 
          value={selectedMethod} 
          onChange={(e) => setSelectedMethod(e.target.value)}
          disabled={isPending}
          className="bg-transparent text-[11px] font-bold text-[--primary] outline-none cursor-pointer focus:ring-0 !p-0 border-none h-6"
        >
          <option value="Pix" className="bg-[#110D0B]">Pix</option>
          <option value="Crédito" className="bg-[#110D0B]">Crédito</option>
          <option value="Débito" className="bg-[#110D0B]">Débito</option>
          <option value="Dinheiro" className="bg-[#110D0B]">Dinheiro</option>
        </select>
        
        <button 
          onClick={handleConfirm}
          disabled={isPending}
          className="text-[--success] hover:scale-110 transition-all disabled:opacity-50 p-1"
          title="Confirmar Recebimento"
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  )
}
