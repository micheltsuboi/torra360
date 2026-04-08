import { getFinancialStats, getRecentTransactions, getExpensesList, getPendingSales } from './actions'
import FinanceChart from './FinanceChart'
import FinanceDashboardClient from './FinanceDashboardClient'
import { Receipt, ArrowRight, TrendingUp } from 'lucide-react'

export default async function FinancePage({
  searchParams,
}: {
  searchParams: { startDate?: string; endDate?: string }
}) {
  const startDate = searchParams.startDate
  const endDate = searchParams.endDate

  const stats = await getFinancialStats(startDate, endDate)
  const recentSales = await getRecentTransactions(startDate, endDate)
  const recentExpenses = await getExpensesList(startDate, endDate)
  const pendingSales = await getPendingSales()

  return (
    <div className="flex flex-col gap-8 text-[--foreground] pb-10">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/5 pb-6 gap-4">
        <div>
           <h1 className="text-3xl font-serif text-[--foreground]">Controle Financeiro</h1>
           <p className="text-[--secondary-text] mt-1 text-sm opacity-60">Visão geral das finanças da Torra 360</p>
        </div>

        {/* Filtros de Data */}
        <form className="flex flex-wrap items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/5">
           <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-[--secondary-text] ml-1 mb-1">Início</span>
              <input 
                type="date" 
                name="startDate" 
                defaultValue={startDate}
                className="bg-black/40 border border-white/10 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[--primary]/50 transition-all"
              />
           </div>
           <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-[--secondary-text] ml-1 mb-1">Fim</span>
              <input 
                type="date" 
                name="endDate" 
                defaultValue={endDate}
                className="bg-black/40 border border-white/10 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[--primary]/50 transition-all"
              />
           </div>
           <button 
             type="submit"
             className="mt-4 md:mt-0 px-4 py-2 bg-[--primary]/10 hover:bg-[--primary]/20 border border-[--primary]/20 rounded-lg text-xs text-[--primary] font-bold transition-all"
           >
             Filtrar Período
           </button>
           {(startDate || endDate) && (
             <a 
               href="/dashboard/financeiro"
               className="text-[10px] text-[--secondary-text] hover:text-[--danger] transition-all underline underline-offset-4"
             >
               Limpar
             </a>
           )}
        </form>

        <div className="flex gap-4">
           <button className="bg-black/40 px-4 py-2 rounded-lg border border-white/5 text-[--secondary-text] text-[10px] uppercase tracking-widest font-bold hover:bg-black/60 transition-all">Exportar PDF</button>
        </div>
      </div>

      {/* Stats e Modais de Gestão (Pendências e Despesas) */}
      <FinanceDashboardClient 
        stats={stats} 
        pendingSales={pendingSales} 
        expensesList={recentExpenses}
      />

      {/* Gráfico Visual */}
      <FinanceChart stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Vendas Recentes */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--success]/20 flex flex-col">
          <div className="p-4 border-b border-[--card-border] wood-texture backdrop-blur-sm bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-[--success]" />
               <h2 className="text-sm text-[--primary] font-serif uppercase tracking-widest">Vendas Confirmadas (Pagas)</h2>
             </div>
             <a href="/dashboard/comercial" className="text-[10px] text-[--secondary-text] hover:text-[--primary] transition-all flex items-center gap-1 group">
               Ver todas <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
             </a>
          </div>
          <div className="flex-1 overflow-x-auto">
             <table className="w-full text-xs">
                <thead className="bg-white/5 text-[--secondary-text] uppercase tracking-tighter text-[10px]">
                   <tr>
                      <th className="p-3 text-left">Data</th>
                      <th className="p-3 text-left">Cliente</th>
                      <th className="p-3 text-right">Valor final</th>
                   </tr>
                </thead>
                <tbody>
                   {recentSales.filter((s:any) => s.payment_status === 'paid').map((sale: any) => (
                      <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                         <td className="p-3 opacity-60">{new Date(sale.date).toLocaleDateString()}</td>
                         <td className="p-3 font-bold text-[--primary]">{sale.clients?.name || 'Venda Avulsa'}</td>
                         <td className="p-3 text-right font-mono text-[--success]">R$ {sale.final_amount.toFixed(2)}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Despesas Recentes */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--danger]/20 flex flex-col">
           <div className="p-4 border-b border-[--card-border] wood-texture backdrop-blur-sm bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <Receipt className="w-4 h-4 text-[--danger]" />
               <h2 className="text-sm text-[--primary] font-serif uppercase tracking-widest">Despesas Registradas</h2>
             </div>
             <a href="/dashboard/custos" className="text-[10px] text-[--secondary-text] hover:text-[--primary] transition-all flex items-center gap-1 group">
               Gerenciar <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
             </a>
          </div>
          <div className="flex-1 overflow-x-auto">
             <table className="w-full text-xs">
                <thead className="bg-white/5 text-[--secondary-text] uppercase tracking-tighter text-[10px]">
                   <tr>
                      <th className="p-3 text-left">Data</th>
                      <th className="p-3 text-left">Descrição</th>
                      <th className="p-3 text-right">Valor</th>
                   </tr>
                </thead>
                <tbody>
                   {recentExpenses.map((exp: any) => (
                      <tr key={exp.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                         <td className="p-3 opacity-60">{new Date(exp.date).toLocaleDateString()}</td>
                         <td className="p-3">{exp.notes || exp.category || 'Despesa'}</td>
                         <td className="p-3 text-right font-mono text-[--danger]">R$ {exp.amount.toFixed(2)}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

      </div>

    </div>
  )
}
