'use client'

import { useState, useTransition } from 'react'
import { DollarSign, Trash2, Loader2, CheckCircle2, RefreshCcw } from 'lucide-react'
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
  const [activeModal, setActiveModal] = useState<'payment' | null>(null)
  
  const [discountInput, setDiscountInput] = useState(sale.discount_amount || 0)
  const [paymentMethod, setPaymentMethod] = useState(sale.payment_method === 'À receber' ? 'Pix' : sale.payment_method)

  const currentFinalAmount = Math.max(0, sale.total_amount - discountInput)
  const isPaid = sale.payment_status === 'paid'

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

  const handleRevertToPending = async () => {
    if (!confirm('Deseja reverter esta venda para o status "À receber"?')) return
    startTransition(async () => {
      await updateSale(sale.id, {
        payment_status: 'pending',
        payment_method: 'À receber'
      })
      setActiveModal(null)
    })
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2.5">
        <button 
          onClick={() => setActiveModal('payment')} 
          className="action-icon-btn !p-2 text-[--success] shadow-[0_0_12px_rgba(52,211,153,0.3)] hover:shadow-[0_0_16px_rgba(52,211,153,0.5)] bg-[--success]/5 border-[--success]/20 transition-all active:scale-95"
          title="Gerenciar Pagamento"
        >
          <DollarSign className="w-[18px] h-[18px]" />
        </button>

        <button 
          onClick={handleDelete} 
          className="action-icon-btn !p-2 text-[--danger] hover:bg-[--danger]/10 border-transparent hover:border-[--danger]/20 transition-all opacity-40 hover:opacity-100" 
          disabled={isPending}
          title="Excluir"
        >
          {isPending ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Trash2 className="w-[18px] h-[18px]" />}
        </button>
      </div>

      <Modal isOpen={activeModal === 'payment'} onClose={() => setActiveModal(null)} title={isPaid ? "Detalhes do Pagamento" : "Confirmar Recebimento"}>
        <div className="flex flex-col gap-6 font-sans">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-2 text-sm">
             <div className="flex justify-between">
                <span className="opacity-60">Status Atual:</span>
                <span className={`font-bold ${isPaid ? 'text-[--success]' : 'text-[--warning]'}`}>
                   {isPaid ? `Pago via ${sale.payment_method}` : 'Pendente (À receber)'}
                </span>
             </div>
             <div className="flex justify-between border-t border-white/5 pt-2">
                <span className="opacity-60">Valor Original:</span>
                <span className="font-mono">R$ {sale.total_amount.toFixed(2)}</span>
             </div>
          </div>

          {!isPaid ? (
            <>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="data-label text-[--primary] uppercase tracking-widest text-[10px]">Desconto (R$):</label>
                  <input type="number" step="0.01" value={discountInput || ''} onChange={(e) => setDiscountInput(parseFloat(e.target.value) || 0)} className="w-full bg-black/40 border-white/10 h-11 text-sm rounded-lg outline-none font-mono px-3 focus:border-[--primary]/50 shadow-inner" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="data-label text-[--primary] uppercase tracking-widest text-[10px]">Método Final:</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-black/40 border-white/10 h-11 text-sm rounded-lg outline-none font-bold px-2 focus:border-[--primary]/50">
                    <option value="Pix">Pix</option><option value="Crédito">Crédito</option><option value="Débito">Débito</option><option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 flex flex-col items-center gap-2">
                 <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Total a Receber</span>
                 <span className="text-3xl font-serif text-[--success] title-glow">R$ {currentFinalAmount.toFixed(2)}</span>
              </div>
              <button onClick={handleConfirmPayment} disabled={isPending} className="primary-btn w-full py-4 text-sm font-bold bg-gradient-to-r from-[--success] to-emerald-800 border-none capitalize tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.3)]">
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Confirmar Recebimento
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-[--success]/5 rounded-lg border border-[--success]/10 text-center">
                 <p className="text-xs text-[--success] font-medium leading-relaxed">Esta venda já foi marcada como paga.</p>
              </div>
              <button 
                onClick={handleRevertToPending} 
                className="w-full py-4 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-[--secondary-text]"
              >
                <RefreshCcw className="w-4 h-4" /> Reverter para Pendente
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
