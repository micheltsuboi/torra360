'use client'

import { useState, useTransition } from 'react'
import { Pencil, DollarSign, Trash2, Loader2, Tag, CheckCircle2 } from 'lucide-react'
import { deleteSale, updateSale } from './actions'
import Modal from '@/components/ui/Modal'

interface Sale {
  id: string
  total_amount: number
  discount_amount: number
  final_amount: number
  payment_method: string
  payment_status: string
  client?: { name: string }
}

export default function SaleActions({ sale }: { sale: Sale }) {
  const [isPending, startTransition] = useTransition()
  const [activeModal, setActiveModal] = useState<'edit' | 'payment' | null>(null)
  
  const [discountInput, setDiscountInput] = useState(sale.discount_amount || 0)
  const [paymentMethod, setPaymentMethod] = useState(sale.payment_method === 'À receber' ? 'Pix' : sale.payment_method)

  const currentFinalAmount = Math.max(0, sale.total_amount - discountInput)

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) return
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', sale.id)
      await deleteSale(formData)
    })
  }

  const handleConfirmPayment = async () => {
    if (!confirm(`Confirmar recebimento?`)) return
    startTransition(async () => {
      await updateSale(sale.id, {
        discount_amount: discountInput,
        final_amount: currentFinalAmount,
        payment_method: paymentMethod,
        payment_status: 'paid'
      })
      setActiveModal(null)
    })
  }

  return (
    <>
      <div className="flex items-center justify-center gap-1.5">
        <button onClick={() => setActiveModal('edit')} className="action-icon-btn text-[--primary]"><Pencil className="action-icon" /></button>
        {sale.payment_status === 'pending' && (
          <button onClick={() => setActiveModal('payment')} className="action-icon-btn text-[--success]"><DollarSign className="action-icon" /></button>
        )}
        <button onClick={handleDelete} className="action-icon-btn text-[--danger]" disabled={isPending}>
          {isPending ? <Loader2 className="action-icon animate-spin" /> : <Trash2 className="action-icon" />}
        </button>
      </div>

      <Modal isOpen={activeModal === 'payment'} onClose={() => setActiveModal(null)} title="Confirmar Recebimento">
        <div className="flex flex-col gap-6 font-sans">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-2 text-sm">
             <div className="flex justify-between"><span>Original:</span><span className="font-mono">R$ {sale.total_amount.toFixed(2)}</span></div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="data-label text-[--primary] uppercase tracking-widest text-[10px]">Desconto (R$):</label>
              <input type="number" step="0.01" value={discountInput || ''} onChange={(e) => setDiscountInput(parseFloat(e.target.value) || 0)} className="w-full bg-black/40 border-white/10 h-11 text-sm rounded-lg outline-none font-mono px-3" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="data-label text-[--primary] uppercase tracking-widest text-[10px]">Método:</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-black/40 border-white/10 h-11 text-sm rounded-lg outline-none font-bold px-2">
                <option value="Pix">Pix</option><option value="Crédito">Crédito</option><option value="Débito">Débito</option><option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 flex flex-col items-center gap-2">
             <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Total Final</span>
             <span className="text-3xl font-serif text-[--success] title-glow">R$ {currentFinalAmount.toFixed(2)}</span>
          </div>
          <button onClick={handleConfirmPayment} disabled={isPending} className="primary-btn w-full py-4 text-sm font-bold bg-gradient-to-r from-[--success] to-emerald-800 border-none capitalize tracking-widest flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Confirmar
          </button>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'edit'} onClose={() => setActiveModal(null)} title="Editar Detalhes">
        <div className="p-8 text-center text-xs opacity-50 italic">Edição de itens em breve. Use o Pagamento para valores.</div>
      </Modal>
    </>
  )
}
