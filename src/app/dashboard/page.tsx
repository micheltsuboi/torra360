import { getRoastBatches } from './torra/actions'
import { getFinancialStats } from './financeiro/actions'
import { getClients } from './clientes/actions'
import { getGreenCoffeeLots } from './estoque/actions'
import { getPackages } from './pacotes/actions'
import { formatDate } from '@/utils/date-utils'
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Package, 
  Activity,
  ArrowUpRight
} from 'lucide-react'

export default async function DashboardIndex() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString()
  
  // Paralelizar chamadas para performance
  const [recentRoasts, stats, clients, greenLots, packages] = await Promise.all([
    getRoastBatches(),
    getFinancialStats(thirtyDaysAgo),
    getClients(),
    getGreenCoffeeLots(),
    getPackages()
  ])

  const latestFive = recentRoasts.slice(0, 5)

  // Cálculos para o Estoque
  const totalGreenStock = greenLots.reduce((acc, lot) => acc + (lot.available_qty_kg || 0), 0)
  const totalRoastedUnits = packages.reduce((acc, pkg) => acc + (pkg.quantity_units || 0), 0)

  // Calculate yield rates for the bar chart
  const averageYieldStr = latestFive.length > 0 
    ? (latestFive.reduce((acc: number, r: any) => acc + parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100)), 0) / latestFive.length).toFixed(1)
    : "0.0"

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-serif text-[--foreground]">Visão Geral</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[--secondary-text] opacity-60 font-bold">Resumo da sua torrefação</p>
      </div>

      {/* Top Section: Main Chart and Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico Principal (Rendimento Últimas Torras) */}
        <div className="glass-panel p-0 flex flex-col relative overflow-hidden border-t-2 border-[--primary]/20">
          <div className="p-2.5 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-[--primary]" />
              <h2 className="font-serif text-[10px] uppercase tracking-widest text-[--primary]">Taxa de Rendimento</h2>
            </div>
            <div className="text-[8px] font-bold py-0.5 px-2 bg-white/5 rounded-full border border-white/10 opacity-60">
              IDEAL: &gt; 80%
            </div>
          </div>
          
          <div className="p-4 flex-1 flex flex-col relative">
            <div className="absolute top-0 right-0 p-10 bg-[--primary]/5 blur-3xl rounded-full -mr-5 -mt-5" />
            <div className="mb-4">
               <p className="text-[8px] uppercase tracking-widest text-[--secondary-text] font-bold opacity-40">Média Global</p>
               <p className="text-lg font-serif text-[--primary] leading-none">{averageYieldStr}%</p>
            </div>

            <div className="flex items-end justify-between gap-1.5 h-[60px] mt-auto relative z-10">
              {latestFive.length > 0 ? (
                latestFive.map((roast: any, idx: number) => {
                  const yieldP = parseFloat(roast.yield_percentage || ((roast.qty_after_kg / roast.qty_before_kg) * 100).toString())
                  const height = Math.min(100, Math.max(15, yieldP))
                  
                  let colorClass = 'bg-[--primary]'
                  let textClass = 'text-[--primary]'
                  
                  if (yieldP < 78) { colorClass = 'bg-[--danger]'; textClass = 'text-[--danger]'; }
                  else if (yieldP >= 78 && yieldP < 82) { colorClass = 'bg-[--warning]'; textClass = 'text-[--warning]'; }
                  else { colorClass = 'bg-[--success]'; textClass = 'text-[--success]'; }

                  return (
                    <div key={roast.id || idx} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full flex flex-col justify-end h-[50px] bg-white/5 rounded-t-sm border-x border-t border-white/5 overflow-hidden">
                        <div className={`absolute top-0.5 w-full text-center font-bold text-[7px] ${textClass} z-20`}>
                          {yieldP.toFixed(0)}%
                        </div>
                        <div 
                          className={`w-full ${colorClass} transition-all duration-700 ease-out relative`} 
                          style={{ height: `${height}%` }}
                        >
                           <div className="w-full h-full bg-gradient-to-t from-black/40 to-white/10" />
                        </div>
                      </div>
                      <div className="mt-1 text-center w-full">
                        <p className="text-[7px] font-bold text-[--foreground] truncate uppercase tracking-tighter opacity-80">{roast.green_coffee?.name || 'Lote'}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="w-full flex items-center justify-center text-[--secondary-text] italic h-full opacity-30 text-[9px] uppercase tracking-widest">Vazio.</div>
              )}
            </div>
          </div>
        </div>

        {/* Lotes Recentes */}
        <div className="glass-panel p-0 flex flex-col overflow-hidden border-t-2 border-[--primary]/20">
          <div className="p-2.5 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-3 h-3 text-[--primary]" />
              <h2 className="font-serif text-[10px] uppercase tracking-widest text-[--primary]">Lotes Recentes</h2>
            </div>
            <span className="text-[8px] font-bold py-0.5 px-2 bg-white/5 rounded-full border border-white/10">{latestFive.length}</span>
          </div>
          <div className="p-3 flex flex-col gap-2 overflow-y-auto max-h-[160px] scrollbar-thin">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => (
                <div key={roast.id || idx} className="flex items-center gap-2.5 group hover:translate-x-1 transition-all border-b border-white/5 pb-1.5 last:border-0">
                  <div className="w-6 h-6 rounded border border-white/10 bg-black/40 flex items-center justify-center shrink-0">
                    <span className="text-[7px] font-bold text-[--primary]">TR</span>
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-[9px] font-bold text-[--foreground] truncate uppercase tracking-tight">{roast.green_coffee?.name || 'Lote'}</h4>
                     <p className="text-[7px] text-[--secondary-text] opacity-40 font-mono">{formatDate(roast.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-bold text-[--success]">{roast.qty_after_kg}kg</span>
                  </div>
                </div>
              ))
            ) : (
               <p className="text-[9px] text-[--secondary-text] text-center italic mt-4 uppercase tracking-widest opacity-30">Vazio.</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards Row (4 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Faturamento */}
        <div className="glass-panel p-0 border-t-2 border-t-[--primary]/20 relative overflow-hidden group">
           <div className="p-2 border-b border-white/5 wood-texture bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-1.5">
               <TrendingUp className="w-3 h-3 text-[--primary]" />
               <span className="text-[9px] font-bold uppercase tracking-widest text-[--primary]">Faturamento</span>
             </div>
             <ArrowUpRight className="w-2.5 h-2.5 text-[--success] opacity-60" />
           </div>
           <div className="p-4">
             <div className="flex items-baseline gap-1">
               <span className="text-lg font-serif text-[--foreground]">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             </div>
             <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
               <span className="text-[7px] font-bold uppercase tracking-widest text-[--secondary-text] opacity-40">Período 30 dias</span>
               <span className="text-[7px] text-[--success] font-bold uppercase tracking-widest">+{stats.revenueChange}%</span>
             </div>
           </div>
        </div>

        {/* A Receber */}
        <div className="glass-panel p-0 border-t-2 border-t-[--warning]/20 relative overflow-hidden group">
           <div className="p-2 border-b border-white/5 wood-texture bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-1.5">
               <Clock className="w-3 h-3 text-[--warning]" />
               <span className="text-[9px] font-bold uppercase tracking-widest text-[--warning]">A Receber</span>
             </div>
           </div>
           <div className="p-4">
             <div className="flex items-baseline gap-1">
               <span className="text-lg font-serif text-[--warning]">R$ {stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             </div>
             <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
               <span className="text-[7px] font-bold uppercase tracking-widest text-[--secondary-text] opacity-40">Saldo Pendente</span>
               <span className="text-[7px] text-[--secondary-text] font-bold uppercase tracking-widest opacity-60">Aberto</span>
             </div>
           </div>
        </div>

        {/* Base Clientes */}
        <div className="glass-panel p-0 border-t-2 border-t-[--success]/20 relative overflow-hidden group">
           <div className="p-2 border-b border-white/5 wood-texture bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-1.5">
               <Users className="w-3 h-3 text-[--success]" />
               <span className="text-[9px] font-bold uppercase tracking-widest text-[--success]">Base Clientes</span>
             </div>
           </div>
           <div className="p-4">
             <div className="flex items-baseline gap-1">
               <span className="text-lg font-serif text-[--foreground]">{clients.length}</span>
               <span className="text-[8px] text-[--secondary-text] opacity-40 font-bold uppercase ml-1.5 tracking-widest">Ativos</span>
             </div>
             <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
               <span className="text-[7px] font-bold uppercase tracking-widest text-[--secondary-text] opacity-40">Novos Cadastros</span>
               <span className="text-[7px] text-[--success] font-bold uppercase tracking-widest">Estável</span>
             </div>
           </div>
        </div>

        {/* Vendas */}
        <div className="glass-panel p-0 border-t-2 border-t-[--primary]/20 relative overflow-hidden group">
           <div className="p-2 border-b border-white/5 wood-texture bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-1.5">
               <ShoppingBag className="w-3 h-3 text-[--primary]" />
               <span className="text-[9px] font-bold uppercase tracking-widest text-[--primary]">Vendas</span>
             </div>
           </div>
           <div className="p-4">
             <div className="flex items-baseline gap-1">
               <span className="text-lg font-serif text-[--foreground]">{stats.salesCount}</span>
               <span className="text-[8px] text-[--secondary-text] opacity-40 font-bold uppercase ml-1.5 tracking-widest">Pedidos</span>
             </div>
             <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
               <span className="text-[7px] font-bold uppercase tracking-widest text-[--secondary-text] opacity-40">Volume Comercial</span>
               <span className="text-[7px] text-[--primary] font-bold uppercase tracking-widest">Monitorado</span>
             </div>
           </div>
        </div>
      </div>

      {/* Bottom Section: Yield Trend and Total Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Rendimento Final (Line Chart Style) - BEM MAIS DISCRETO */}
        <div className="glass-panel p-0 relative overflow-hidden border-t-2 border-[--success]/20">
          <div className="p-2.5 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-[--success]" />
              <h2 className="font-serif text-[10px] uppercase tracking-widest text-[--success]">Tendência de Rendimento</h2>
            </div>
            <span className="text-[7px] uppercase tracking-widest text-[--secondary-text] font-bold opacity-30 font-mono">Últimos 10 registros</span>
          </div>
          
          <div className="p-4 relative z-10 flex flex-col items-center justify-center min-h-[80px]">
             <div className="h-[30px] w-full relative z-10 px-1">
               <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                 {/* No grid lines for discretion */}
                 {recentRoasts.length > 1 && (
                   <>
                     <path 
                       d={`M ${recentRoasts.slice(0, 10).reverse().map((r, i) => {
                         const y = 100 - parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100));
                         const x = (i / (Math.min(10, recentRoasts.length) - 1)) * 100;
                         return `${x},${y}`
                       }).join(' L ')}`}
                       fill="none"
                       stroke="var(--success)"
                       strokeWidth="1.5"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       className="drop-shadow-[0_0_3px_rgba(34,197,94,0.3)]"
                     />
                   </>
                 )}
               </svg>
             </div>
             <div className="mt-3 flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[7px] uppercase font-bold text-[--secondary-text] opacity-40">Mínimo</span>
                  <span className="text-[9px] font-bold text-[--danger]">74.2%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[7px] uppercase font-bold text-[--secondary-text] opacity-40">Máximo</span>
                  <span className="text-[9px] font-bold text-[--success]">92.8%</span>
                </div>
             </div>
          </div>
        </div>

        {/* Quantidade em Estoque - PADRONIZADO */}
        <div className="glass-panel p-0 flex flex-col border-t-2 border-[--primary]/20">
          <div className="p-2.5 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className="w-3 h-3 text-[--primary]" />
              <h2 className="font-serif text-[10px] uppercase tracking-widest text-[--primary]">Total em Estoque</h2>
            </div>
            <span className="text-[8px] uppercase tracking-widest text-[--secondary-text] font-bold opacity-60">Saldos</span>
          </div>
           
           <div className="p-4 flex flex-col gap-3">
             <div className="flex justify-between items-center border-b border-white/5 pb-2">
               <div>
                 <p className="text-[9px] uppercase tracking-widest text-[--foreground] font-bold">Café Verde</p>
                 <p className="text-[8px] uppercase text-[--secondary-text] font-bold opacity-40">Matéria-prima disponível</p>
               </div>
               <div className="text-right">
                 <span className="text-base font-serif text-[--foreground]">{totalGreenStock.toFixed(1)}</span>
                 <span className="text-[8px] opacity-40 tracking-widest uppercase ml-1">kg</span>
               </div>
             </div>
             
             <div className="flex justify-between items-center border-b border-white/5 pb-2">
               <div>
                 <p className="text-[9px] uppercase tracking-widest text-[--primary] font-bold">Café Embalado</p>
                 <p className="text-[8px] uppercase text-[--secondary-text] font-bold opacity-40">Produtos prontos</p>
               </div>
               <div className="text-right">
                 <span className="text-base font-serif text-[--primary]">{totalRoastedUnits}</span>
                 <span className="text-[8px] opacity-40 tracking-widest uppercase ml-1">unid</span>
               </div>
             </div>

             <div className="mt-1 p-2 bg-black/40 rounded-sm border border-white/5 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-2.5 h-2.5 text-[--success]" />
                  <span className="text-[8px] uppercase font-bold text-[--secondary-text] opacity-60 tracking-widest">Status de Operação</span>
                </div>
                <span className="text-[8px] font-bold text-[--success] uppercase tracking-tight">Estoque Abastecido</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
