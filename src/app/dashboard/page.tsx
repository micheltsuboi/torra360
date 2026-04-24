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
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-[--foreground]">Visão Geral</h1>
        <p className="text-[--secondary-text] opacity-60">Resumo da sua torrefação</p>
      </div>

      {/* Top Section: Main Chart and Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Principal (Rendimento Últimas Torras) */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-20 bg-[--primary]/5 blur-3xl rounded-full -mr-10 -mt-10" />
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h2 className="text-xl font-serif text-[--foreground] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[--primary]" /> Taxa de Rendimento (Últimas Torras)
              </h2>
              <p className="text-sm text-[--secondary-text]">Média: {averageYieldStr}%</p>
            </div>
            <div className="text-[--primary] bg-[--primary]/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[--primary]/20">
              Ideal: &gt; 80%
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-4 min-h-[200px] mt-4 relative z-10">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => {
                const yieldP = parseFloat(roast.yield_percentage || ((roast.qty_after_kg / roast.qty_before_kg) * 100).toString())
                const height = Math.min(100, Math.max(15, yieldP))
                
                let colorClass = 'bg-[--primary]'
                let textClass = 'text-[--primary]'
                let glowClass = 'shadow-[0_0_15px_rgba(195,153,103,0.3)]'
                
                if (yieldP < 78) { colorClass = 'bg-[--danger]'; textClass = 'text-[--danger]'; glowClass = 'shadow-[0_0_15px_rgba(128,61,61,0.4)]'; }
                else if (yieldP >= 78 && yieldP < 82) { colorClass = 'bg-[--warning]'; textClass = 'text-[--warning]'; glowClass = 'shadow-[0_0_15px_rgba(199,176,116,0.4)]'; }
                else { colorClass = 'bg-[--success]'; textClass = 'text-[--success]'; glowClass = 'shadow-[0_0_15px_rgba(103,142,108,0.4)]'; }

                return (
                  <div key={roast.id || idx} className="flex-1 flex flex-col items-center group max-w-[100px]">
                    <div className="relative w-full flex flex-col justify-end h-[140px] bg-white/5 rounded-t-lg border-x border-t border-white/5 overflow-hidden">
                      <div className={`absolute top-2 w-full text-center font-bold text-[10px] ${textClass} z-20`}>
                        {yieldP.toFixed(1)}%
                      </div>
                      <div 
                        className={`w-full ${colorClass} ${glowClass} transition-all duration-700 ease-out relative`} 
                        style={{ height: `${height}%` }}
                      >
                         <div className="w-full h-full bg-gradient-to-t from-black/40 to-white/10" />
                      </div>
                    </div>
                    <div className="mt-3 text-center w-full">
                      <p className="text-[9px] font-bold text-[--foreground] truncate uppercase tracking-tighter">{roast.green_coffee?.name || 'Lote'}</p>
                      <p className="text-[8px] text-[--secondary-text] opacity-40">{formatDate(roast.date)}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="w-full flex items-center justify-center text-[--secondary-text] italic h-full opacity-30">Nenhum lote torrado.</div>
            )}
          </div>
        </div>

        {/* Lotes Recentes */}
        <div className="glass-panel p-0 flex flex-col overflow-hidden border-t-2 border-[--primary]/20">
          <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <h2 className="font-serif text-sm uppercase tracking-widest text-[--primary]">Lotes Recentes</h2>
            <span className="text-[10px] font-bold py-1 px-3 bg-white/5 rounded-full border border-white/10">{latestFive.length}</span>
          </div>
          <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[300px] scrollbar-thin">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => (
                <div key={roast.id || idx} className="flex items-center gap-3 group hover:translate-x-1 transition-all">
                  <div className="w-10 h-10 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center shrink-0 group-hover:border-[--primary]/50 transition-colors">
                    <span className="text-[10px] font-bold text-[--primary]">TR</span>
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-xs font-bold text-[--foreground] truncate uppercase tracking-tight">{roast.green_coffee?.name || 'Lote de Café'}</h4>
                     <p className="text-[9px] text-[--secondary-text] opacity-60 font-mono">{formatDate(roast.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-[--success]">{roast.qty_after_kg}kg</span>
                  </div>
                </div>
              ))
            ) : (
               <p className="text-xs text-[--secondary-text] text-center italic mt-4">Nenhum registro.</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards Row (4 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Faturamento */}
        <div className="glass-panel p-5 border-l-4 border-l-[--primary] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 bg-[--primary]/5 rounded-full -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-500" />
           <div className="flex justify-between items-start mb-2">
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[--secondary-text]">Faturamento 30 Dias</span>
             <TrendingUp className="w-4 h-4 text-[--primary] opacity-40" />
           </div>
           <div className="flex items-baseline gap-1">
             <span className="text-xl font-serif text-[--primary]">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           </div>
           <p className="text-[9px] text-[--success] mt-2 flex items-center gap-1 font-bold">
             <ArrowUpRight className="w-3 h-3" /> {stats.revenueChange}% vs anterior
           </p>
        </div>

        {/* A Receber */}
        <div className="glass-panel p-5 border-l-4 border-l-[--warning] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 bg-[--warning]/5 rounded-full -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-500" />
           <div className="flex justify-between items-start mb-2">
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[--secondary-text]">A Receber</span>
             <Clock className="w-4 h-4 text-[--warning] opacity-40" />
           </div>
           <div className="flex items-baseline gap-1">
             <span className="text-xl font-serif text-[--warning]">R$ {stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           </div>
           <p className="text-[9px] text-[--secondary-text] mt-2 opacity-60">Saldo pendente em aberto</p>
        </div>

        {/* Base Clientes */}
        <div className="glass-panel p-5 border-l-4 border-l-[--success] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 bg-[--success]/5 rounded-full -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-500" />
           <div className="flex justify-between items-start mb-2">
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[--secondary-text]">Base Clientes</span>
             <Users className="w-4 h-4 text-[--success] opacity-40" />
           </div>
           <div className="flex items-baseline gap-1">
             <span className="text-xl font-serif text-[--foreground]">{clients.length}</span>
             <span className="text-[10px] text-[--secondary-text] opacity-40 font-bold uppercase">Cadastrados</span>
           </div>
           <p className="text-[9px] text-[--success] mt-2 font-bold uppercase tracking-widest">Ativos no sistema</p>
        </div>

        {/* Vendas */}
        <div className="glass-panel p-5 border-l-4 border-l-[--primary] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 bg-[--primary]/5 rounded-full -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-500" />
           <div className="flex justify-between items-start mb-2">
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[--secondary-text]">Vendas 30 Dias</span>
             <ShoppingBag className="w-4 h-4 text-[--primary] opacity-40" />
           </div>
           <div className="flex items-baseline gap-1">
             <span className="text-xl font-serif text-[--foreground]">{stats.salesCount}</span>
             <span className="text-[10px] text-[--secondary-text] opacity-40 font-bold uppercase">Pedidos</span>
           </div>
           <p className="text-[9px] text-[--primary] mt-2 font-bold uppercase tracking-widest">Volume comercial</p>
        </div>
      </div>

      {/* Bottom Section: Yield Trend and Total Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Rendimento Final (Line Chart Style) */}
        <div className="glass-panel p-6 lg:col-span-2 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-20 bg-[--success]/5 blur-3xl rounded-full -mr-10 -mt-10" />
           <h2 className="text-lg font-serif text-[--foreground] mb-8 flex items-center gap-2 relative z-10">
             <Activity className="w-5 h-5 text-[--success]" /> Histórico de Rendimento
           </h2>
           
           <div className="h-[180px] w-full relative z-10 px-2 flex items-end">
             {/* Simple SVG Line Chart */}
             <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
               {/* Grid lines */}
               <line x1="0" y1="20" x2="100" y2="20" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
               <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
               <line x1="0" y1="80" x2="100" y2="80" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
               
               {/* Path */}
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
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                   />
                   {/* Gradient Fill under the line */}
                   <path 
                     d={`M ${recentRoasts.slice(0, 10).reverse().map((r, i) => {
                       const y = 100 - parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100));
                       const x = (i / (Math.min(10, recentRoasts.length) - 1)) * 100;
                       return `${x},${y}`
                     }).join(' L ')} L 100,100 L 0,100 Z`}
                     fill="url(#chartGradient)"
                     className="opacity-20"
                   />
                   <defs>
                     <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="var(--success)" />
                       <stop offset="100%" stopColor="transparent" />
                     </linearGradient>
                   </defs>
                 </>
               )}
             </svg>
             
             {/* X-Axis Dates */}
             <div className="absolute bottom-[-20px] left-0 w-full flex justify-between px-2 text-[8px] text-[--secondary-text] opacity-40 uppercase font-bold tracking-widest">
                {recentRoasts.slice(0, 10).reverse().map((r, i) => (
                  <span key={i}>{formatDate(r.date).split('/')[0]}/{formatDate(r.date).split('/')[1]}</span>
                ))}
             </div>
           </div>
        </div>

        {/* Quantidade em Estoque */}
        <div className="glass-panel p-6 flex flex-col justify-between border-t-2 border-[--primary]/20">
           <div className="flex justify-between items-start">
             <h2 className="font-serif text-sm uppercase tracking-widest text-[--primary]">Total em Estoque</h2>
             <Package className="w-5 h-5 text-[--primary] opacity-40" />
           </div>
           
           <div className="flex flex-col gap-6 mt-4">
             <div className="flex justify-between items-end border-b border-white/5 pb-3">
               <div>
                 <p className="text-[9px] uppercase tracking-widest text-[--secondary-text] font-bold mb-1">Café Verde</p>
                 <p className="text-2xl font-serif text-[--foreground]">{totalGreenStock.toFixed(1)} <span className="text-sm opacity-40">kg</span></p>
               </div>
               <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-[--primary] w-[70%]" />
               </div>
             </div>
             
             <div className="flex justify-between items-end">
               <div>
                 <p className="text-[9px] uppercase tracking-widest text-[--secondary-text] font-bold mb-1">Café Embalado</p>
                 <p className="text-2xl font-serif text-[--primary]">{totalRoastedUnits} <span className="text-sm opacity-40">unid</span></p>
               </div>
               <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-[--success] w-[45%]" />
               </div>
             </div>
           </div>

           <div className="mt-8 p-3 bg-black/40 rounded-lg border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-[--primary]/10 rounded-lg">
                <Activity className="w-4 h-4 text-[--primary]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-[--secondary-text] opacity-60">Status Geral</span>
                <span className="text-[10px] font-bold text-[--success]">Estoque Abastecido</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
