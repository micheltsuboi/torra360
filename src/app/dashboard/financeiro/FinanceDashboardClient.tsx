'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import FinanceStats from './FinanceStats'
import { Clock, CheckCircle2, Receipt, Trash2, Pencil, Plus, Calendar, Tag, Info, DollarSign, Type, TrendingUp, ArrowRight } from 'lucide-react'
import { formatDate } from '@/utils/date-utils'
import { markSaleAsPaid, createExpense, updateExpense, deleteExpense, createIncome } from './actions'

interface FinanceDashboardClientProps {
  stats: any
  pendingSales: any[]
  expensesList: any[]
  recentSales: any[]
  recentExpenses: any[]
}

export default function FinanceDashboardClient({ 
  stats, 
  pendingSales, 
  expensesList,
  recentSales,
  recentExpenses 
}: FinanceDashboardClientProps) {
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false)
  const [isListModalOpen, setIsListModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
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

  // Função para limpar observações repetitivas
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
        onNewIncome={() => setIsIncomeModalOpen(true)}
        onOpenExpenses={() => setIsListModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Vendas Recentes */}
        <div className="glass-panel overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h2 className="font-serif text-[--primary] flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" /> Vendas Recentes
            </h2>
            <a href="/dashboard/comercial" className="text-[9px] capitalize tracking-widest text-[--secondary-text] hover:text-[--primary] transition-all flex items-center gap-1">Ver tudo <ArrowRight className="w-3 h-3" /></a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="text-[--secondary-text] capitalize tracking-widest bg-black/20 font-sans text-[9px] border-b border-white/5">
                <tr>
                  <th className="px-4 py-2 text-left font-bold opacity-40">Data</th>
                  <th className="px-4 py-2 text-left font-bold opacity-40">Cliente</th>
                  <th className="px-4 py-2 text-right font-bold opacity-40">Valor</th>
                </tr>
              </thead>
              <tbody className="font-sans">
                {recentSales.map((sale: any) => (
                  <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="px-4 py-2 opacity-50">{formatDate(sale.date)}</td>
                    <td className="px-4 py-2 font-medium text-[--foreground]">{sale.clients?.name || 'Venda Avulsa'}</td>
                    <td className="px-4 py-2 text-right font-mono text-[--primary] font-bold">R$ {sale.final_amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Despesas Recentes */}
        <div className="glass-panel overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h2 className="font-serif text-[--danger] flex items-center gap-2 text-sm">
              <Receipt className="w-4 h-4" /> Últimas Despesas
            </h2>
            <button 
              onClick={() => setIsListModalOpen(true)}
              className="text-[9px] capitalize tracking-widest text-[--danger] bg-[--danger]/10 border border-[--danger]/20 px-2 py-1 rounded-lg hover:bg-[--danger]/20 transition-all flex items-center gap-1 font-bold"
            >
              Gerenciar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="text-[--secondary-text] capitalize tracking-widest bg-black/20 font-sans text-[9px] border-b border-white/5">
                <tr>
                  <th className="px-4 py-2 text-left font-bold opacity-40">Data</th>
                  <th className="px-4 py-2 text-left font-bold opacity-40">Gasto</th>
                  <th className="px-4 py-2 text-right font-bold opacity-40">Valor</th>
                </tr>
              </thead>
              <tbody className="font-sans">
                {recentExpenses.map((exp: any) => (
                  <tr key={exp.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="px-4 py-2 opacity-50">{formatDate(exp.date)}</td>
                    <td className="px-4 py-2 text-[--foreground]">{exp.description || exp.category || 'Despesa'}</td>
                    <td className="px-4 py-2 text-right font-mono text-[--danger] font-bold">R$ {exp.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
              <p className="text-[10px] text-[--secondary-text] capitalize tracking-widest font-bold">Total Pendente</p>
              <p className="text-lg font-serif text-[--primary]">R$ {stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-[--primary]/20">
            <table className="w-full text-[11px]">
              <thead className="bg-white/5 text-[--secondary-text] capitalize tracking-widest text-[9px] font-sans border-b border-white/5">
                <tr>
                  <th className="px-4 py-2 text-left font-bold opacity-40">Data</th>
                  <th className="px-4 py-2 text-left font-bold opacity-40">Cliente</th>
                  <th className="px-4 py-2 text-right font-bold opacity-40">Valor</th>
                  <th className="px-4 py-2 text-center font-bold opacity-40">Ação</th>
                </tr>
              </thead>
              <tbody className="font-sans">
                {pendingSales.map((sale: any) => (
                  <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5 transition-all font-sans">
                    <td className="px-4 py-2 opacity-50 text-[10px]">{formatDate(sale.date)}</td>
                    <td className="px-4 py-2 font-bold text-[--foreground]">{sale.clients?.name || 'Venda Avulsa'}</td>
                    <td className="px-4 py-2 text-right font-mono text-[--primary] font-bold">R$ {sale.final_amount.toFixed(2)}</td>
                    <td className="px-4 py-2">
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
              <span className="text-sm font-serif capitalize tracking-widest text-[--primary]">Lista de Despesas</span>
            </div>
            <button 
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[--primary]/10 hover:bg-[--primary]/20 border border-[--primary]/20 rounded-lg text-[10px] text-[--primary] font-bold transition-all"
            >
              <Plus className="w-3 h-3" /> Nova Despesa
            </button>
          </div>

          <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-white/10">
            <table className="w-full text-[11px]">
              <thead className="bg-white/5 text-[--secondary-text] capitalize tracking-widest text-[9px] font-sans border-b border-white/5">
                <tr>
                  <th className="px-4 py-2 text-left font-bold opacity-40">Data</th>
                  <th className="px-4 py-2 text-left font-bold opacity-40">Título / Categoria</th>
                  <th className="px-4 py-2 text-right font-bold opacity-40">Valor</th>
                  <th className="px-4 py-2 text-center font-bold opacity-40">Ações</th>
                </tr>
              </thead>
              <tbody className="font-sans">
                {expensesList.map((exp: any) => {
                  const title = exp.description || (exp.notes?.includes('Compra de Insumo') ? exp.notes.split(':')[1]?.split('(')[0]?.trim() : 'Despesa Geral')
                  const displayNotes = exp.description ? exp.notes : cleanNotes(exp.notes)

                  return (
                    <tr key={exp.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="px-4 py-2 opacity-50 text-[10px]">{formatDate(exp.date)}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-[--foreground] leading-tight">{title}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <span className="text-[8px] px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-[--secondary-text] capitalize font-bold">{exp.category || 'Geral'}</span>
                             {displayNotes && <span className="text-[9px] opacity-40 italic">— {displayNotes}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-[--danger] font-bold">R$ {exp.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">
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
            <label className="text-[10px] capitalize font-bold text-[--secondary-text] ml-1 flex items-center gap-1 font-sans">
              <Type className="action-icon" /> Título / Descrição
            </label>
            <input 
              type="text" 
              name="description" 
              required 
              placeholder="Ex: Aluguel Unidade Matriz"
              defaultValue={editingExpense?.description || (editingExpense?.notes?.includes('Compra de Insumo') ? editingExpense.notes.split(':')[1]?.split('(')[0]?.trim() : '')}
              className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 focus:border-[--primary]/50 outline-none transition-all font-sans text-[--foreground]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] capitalize font-bold text-[--secondary-text] ml-1 flex items-center gap-1 font-sans">
                <Calendar className="action-icon" /> Data
              </label>
              <input 
                type="date" 
                name="date" 
                required 
                defaultValue={editingExpense?.date || new Date().toISOString().split('T')[0]}
                className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 font-sans text-[--foreground]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] capitalize font-bold text-[--secondary-text] ml-1 flex items-center gap-1 font-sans">
                <DollarSign className="action-icon" /> Valor
              </label>
              <input 
                type="number" 
                name="amount" 
                step="0.01" 
                required 
                placeholder="0.00"
                defaultValue={editingExpense?.amount}
                className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 font-mono text-[--foreground]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] capitalize font-bold text-[--secondary-text] ml-1 flex items-center gap-1 font-sans">
              <Tag className="action-icon" /> Categoria
            </label>
            <select 
              name="category" 
              required
              defaultValue={editingExpense?.category || 'Geral'}
              className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 text-[--foreground]"
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
            <label className="text-[10px] capitalize font-bold text-[--secondary-text] ml-1 flex items-center gap-1 font-sans">
              <Info className="action-icon" /> Observações (Opcional)
            </label>
            <textarea 
              name="notes" 
              rows={2}
              defaultValue={editingExpense?.notes}
              className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 resize-none outline-none focus:border-[--primary]/50 transition-all font-sans text-[--foreground]"
              placeholder="Detalhes adicionais..."
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="flex-1 px-4 py-3 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5 transition-all text-[--secondary-text] font-sans"
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

      {/* 4. Modal de Aporte / Receita */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        title="Registrar Aporte Financeiro"
      >
        <form 
          action={async (formData: FormData) => {
            await createIncome(formData)
            setIsIncomeModalOpen(false)
          }}
          className="flex flex-col gap-4 p-2"
        >
          <div className="p-3 mb-2 bg-[--primary]/10 border border-[--primary]/20 rounded-lg text-xs text-[--primary] font-sans text-center leading-relaxed">
             Aportes são entradas manuais de capital. Eles serão computados integralmente no seu faturamento mensal atual.
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] capitalize font-bold text-[--secondary-text] ml-1 flex items-center gap-1 font-sans">
                <Calendar className="action-icon" /> Data do Aporte
              </label>
              <input 
                type="date" 
                name="date" 
                required 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 font-sans text-[--foreground]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] capitalize font-bold text-[--secondary-text] ml-1 flex items-center gap-1 font-sans">
                <DollarSign className="action-icon" /> Valor da Entrada
              </label>
              <input 
                type="number" 
                name="amount" 
                step="0.01" 
                required 
                placeholder="0.00"
                className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 font-mono text-[--success]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] capitalize font-bold text-[--secondary-text] ml-1 flex items-center gap-1 font-sans">
              <Tag className="action-icon" /> Forma / Método
            </label>
            <select 
              name="payment_method" 
              required
              defaultValue="Pix"
              className="bg-black/40 border border-white/10 text-sm rounded-lg p-2.5 text-[--foreground]"
            >
              <option value="Pix">Pix (Transferência Bancária)</option>
              <option value="Dinheiro">Dinheiro Físico/Caixa</option>
              <option value="Crédito">Outros Meios</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              type="button"
              onClick={() => setIsIncomeModalOpen(false)}
              className="flex-1 px-4 py-3 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5 transition-all text-[--secondary-text] font-sans"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-[2] golden-btn py-3 text-xs font-bold bg-[--primary]/20 text-[--primary] border-[--primary]/30"
            >
              Confirmar Aporte
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
