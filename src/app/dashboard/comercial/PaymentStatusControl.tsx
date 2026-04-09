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
      <div className="flex items-center gap-1.5 text-[10px] bg-[--success]/10 text-[--success] px-2 py-1 rounded-full border border-[--success]/20 font-bold capitalize">
        <CheckCircle2 className="w-3 h-3" />
        {sale.payment_method}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-[10px] bg-[--warning]/10 text-[--warning] px-2 py-1 rounded-full border border-[--warning]/20 font-bold whitespace-nowrap">
        <Clock className="w-3 h-3" />
        Pendente
      </div>
      
      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
        <select 
          value={selectedMethod} 
          onChange={(e) => setSelectedMethod(e.target.value)}
          disabled={isPending}
          className="bg-transparent text-[10px] font-bold text-[--primary] outline-none cursor-pointer focus:ring-0"
        >
          <option value="Pix" className="bg-[#110D0B]">Pix</option>
          <option value="Crédito" className="bg-[#110D0B]">Crédito</option>
          <option value="Débito" className="bg-[#110D0B]">Débito</option>
          <option value="Dinheiro" className="bg-[#110D0B]">Dinheiro</option>
        </select>
        
        <button 
          onClick={handleConfirm}
          disabled={isPending}
          className="bg-[--success]/20 hover:bg-[--success]/40 text-[--success] p-1 rounded transition-all disabled:opacity-50"
          title="Marcar como Pago"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  )
}
