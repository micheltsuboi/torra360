'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import FinanceStats from './FinanceStats'
import { Clock, CheckCircle2 } from 'lucide-react'
import { markSaleAsPaid } from './actions'

interface FinanceDashboardClientProps {
  stats: any
  pendingSales: any[]
}

export default function FinanceDashboardClient({ stats, pendingSales }: FinanceDashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

    const onNewExpense = () => {
      window.location.href = '/dashboard/custos'
    }

    return (
      <>
        <FinanceStats 
          stats={stats} 
          onOpenPending={() => setIsModalOpen(true)} 
          onNewExpense={onNewExpense}
        />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Contas a Receber / Pendências"
      >
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-[--primary]/10 rounded-lg border border-[--primary]/20 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[--primary]" />
            <div>
              <p className="text-[10px] text-[--secondary-text] uppercase tracking-widest font-bold">Total Pendente</p>
              <p className="text-lg font-serif text-[--primary]">R$ {stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-[--primary]/20">
            <table className="w-full text-xs">
              <thead className="bg-white/5 text-[--secondary-text] uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="p-3 text-left">Data</th>
                  <th className="p-3 text-left">Cliente</th>
                  <th className="p-3 text-right">Valor</th>
                  <th className="p-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {pendingSales.map((sale: any) => (
                  <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5 transition-all font-sans">
                    <td className="p-3 opacity-60 text-[9px]">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="p-3 font-bold text-[--foreground] text-sm">{sale.clients?.name || 'Venda Avulsa'}</td>
                    <td className="p-3 text-right font-mono text-[--primary]">R$ {sale.final_amount.toFixed(2)}</td>
                    <td className="p-3">
                      <form 
                        action={async (formData: FormData) => {
                          const method = formData.get('method') as string
                          await markSaleAsPaid(sale.id, method)
                          // Se o modal deve fechar após um recebimento, poderíamos fazer aqui 
                          // ou assumir que o usuário pode querer receber vários de uma vez.
                        }}
                        className="flex items-center justify-center gap-2"
                      >
                        <select name="method" required className="bg-black/40 border border-white/10 text-[10px] rounded p-1 text-[--primary] outline-none">
                          <option value="Pix">Pix</option>
                          <option value="Crédito">Crédito</option>
                          <option value="Débito">Débito</option>
                          <option value="Dinheiro">Dinheiro</option>
                        </select>
                        <button type="submit" className="bg-[--success]/20 hover:bg-[--success]/40 text-[--success] p-1.5 rounded-lg transition-all" title="Confirmar Recebimento">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {pendingSales.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-[--secondary-text]">Nenhuma pendência encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  )
}
