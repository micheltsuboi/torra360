'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import FinanceStats from './FinanceStats'
import { Clock, CheckCircle2, Receipt, Trash2, Pencil, Plus, Calendar, Tag, Info, DollarSign, Type } from 'lucide-react'
import { formatDate } from '@/utils/date-utils'
import { markSaleAsPaid, createExpense, updateExpense, deleteExpense } from './actions'

interface FinanceDashboardClientProps {
  stats: any
  pendingSales: any[]
  expensesList: any[]
}

export default function FinanceDashboardClient({ stats, pendingSales, expensesList }: FinanceDashboardClientProps) {
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false)
  const [isListModalOpen, setIsListModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)

  const handleCreateNew = () => {
    setEditingExpense(null)
    setIsFormModalOpen(true)
  }

  const handleEdit = (expense: any) => {
    setEditingExpense(expense)
    setIsFormModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      await deleteExpense(id)
    }
  }

  // Função para limpar observações repetitivas (Ex: "Compra de Insumo: Pacote Kraft (1000 un)" -> "1000 un")
  const cleanNotes = (notes: string) => {
    if (!notes) return ''
    return notes.replace(/Compra de Insumo:.*?\(|\)$|Compra de Insumo:/gi, '').trim()
  }

  return (
    <>
      <FinanceStats 
        stats={stats} 
        onOpenPending={() => setIsPendingModalOpen(true)} 
        onNewExpense={handleCreateNew}
        onOpenExpenses={() => setIsListModalOpen(true)}
      />

      {/* 1. Modal de Contas a Receber */}
      <Modal 
        isOpen={isPendingModalOpen} 
        onClose={() => setIsPendingModalOpen(false)} 
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
                    <td className="p-3 opacity-60 text-[9px]">{formatDate(sale.date)}</td>
                    <td className="p-3 font-bold text-[--foreground] text-sm">{sale.clients?.name || 'Venda Avulsa'}</td>
                    <td className="p-3 text-right font-mono text-[--primary]">R$ {sale.final_amount.toFixed(2)}</td>
                    <td className="p-3">
                      <form 
                        action={async (formData: FormData) => {
                          const method = formData.get('method') as string
                          await markSaleAsPaid(sale.id, method)
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

      {/* 2. Modal de Listagem de Despesas */}
      <Modal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title="Gerenciamento de Despesas"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[--danger]" />
              <span className="text-sm font-serif uppercase tracking-widest text-[--primary]">Lista de Despesas</span>
            </div>
            <button 
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[--primary]/10 hover:bg-[--primary]/20 border border-[--primary]/20 rounded-lg text-[10px] text-[--primary] font-bold transition-all"
            >
              <Plus className="w-3 h-3" /> Nova Despesa
            </button>
          </div>

          <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-white/10">
            <table className="w-full text-xs">
              <thead className="bg-white/5 text-[--secondary-text] uppercase tracking-tighter text-[10px]">
                <tr>
                  <th className="p-3 text-left">Data</th>
                  <th className="p-3 text-left">Título / Categoria</th>
                  <th className="p-3 text-right">Valor</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {expensesList.map((exp: any) => {
                  // Fallback para despesas antigas: se não tem description, tenta tirar do notes
                  const title = exp.description || (exp.notes?.includes('Compra de Insumo') ? exp.notes.split(':')[1]?.split('(')[0]?.trim() : 'Despesa Geral')
                  const displayNotes = exp.description ? exp.notes : cleanNotes(exp.notes)

                  return (
                    <tr key={exp.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="p-3 opacity-60 text-[10px]">{formatDate(exp.date)}</td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-[--foreground]">{title}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-[--secondary-text] uppercase">{exp.category || 'Geral'}</span>
                             {displayNotes && <span className="text-[10px] opacity-40 italic">— {displayNotes}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono text-[--danger] font-bold">R$ {exp.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-0.5">
                          <button 
                            onClick={() => handleEdit(exp)}
                            className="action-icon-btn text-[--primary]"
                            title="Editar"
                          >
                            <Pencil className="action-icon" />
                          </button>
                          <button 
                            onClick={() => handleDelete(exp.id)}
                            className="action-icon-btn text-[--danger]"
                            title="Excluir"
                          >
                            <Trash2 className="action-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {expensesList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-[--secondary-text]">Nenhuma despesa para o período.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* 3. Modal de Formulário de Despesa */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
      >
        <form 
          action={async (formData: FormData) => {
            if (editingExpense) {
              await updateExpense(formData)
            } else {
              await createExpense(formData)
            }
            setIsFormModalOpen(false)
          }}
          className="flex flex-col gap-4 p-2"
        >
          {editingExpense && <input type="hidden" name="id" value={editingExpense.id} />}
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[--secondary-text] ml-1 flex items-center gap-1">
              <Type className="action-icon" /> Título / Descrição
            </label>
            <input 
              type="text" 
              name="description" 
              required 
              placeholder="Ex: Aluguel Unidade Matriz"
              defaultValue={editingExpense?.description || (editingExpense?.notes?.includes('Compra de Insumo') ? editingExpense.notes.split(':')[1]?.split('(')[0]?.trim() : '')}
              className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 focus:border-[--primary]/50 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[--secondary-text] ml-1 flex items-center gap-1">
                <Calendar className="action-icon" /> Data
              </label>
              <input 
                type="date" 
                name="date" 
                required 
                defaultValue={editingExpense?.date || new Date().toISOString().split('T')[0]}
                className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[--secondary-text] ml-1 flex items-center gap-1">
                <DollarSign className="action-icon" /> Valor
              </label>
              <input 
                type="number" 
                name="amount" 
                step="0.01" 
                required 
                placeholder="0.00"
                defaultValue={editingExpense?.amount}
                className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[--secondary-text] ml-1 flex items-center gap-1">
              <Tag className="action-icon" /> Categoria
            </label>
            <select 
              name="category" 
              required
              defaultValue={editingExpense?.category || 'Geral'}
              className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5"
            >
              <option value="Luz">Luz</option>
              <option value="Água">Água</option>
              <option value="Gás">Gás</option>
              <option value="Aluguel">Aluguel</option>
              <option value="Marketing">Marketing</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Internet">Internet</option>
              <option value="Pro-labore">Pro-labore</option>
              <option value="Embalagens">Embalagens</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[--secondary-text] ml-1 flex items-center gap-1">
              <Info className="action-icon" /> Observações (Opcional)
            </label>
            <textarea 
              name="notes" 
              rows={2}
              defaultValue={editingExpense?.notes}
              className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 resize-none outline-none focus:border-[--primary]/50 transition-all font-sans"
              placeholder="Detalhes adicionais..."
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="flex-1 px-4 py-3 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5 transition-all text-[--secondary-text]"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-[2] golden-btn py-3 text-xs font-bold"
            >
              {editingExpense ? 'Salvar Alterações' : 'Cadastrar Despesa'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
