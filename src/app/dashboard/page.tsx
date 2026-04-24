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
      <div className="flex flex-col gap-1.5 px-1">
        <h1 className="text-2xl font-serif text-[--foreground]">Visão Geral</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[--secondary-text] opacity-40 font-bold">Monitoramento de rendimento e controle comercial em tempo real</p>
      </div>

      {/* Top Section: Main Chart and Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico Principal (Rendimento Últimas Torras) */}
        <div className="glass-panel p-0 flex flex-col relative overflow-hidden border-t-2 border-[--primary]/20">
          <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[--primary]" />
              <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Taxa de Rendimento</h2>
            </div>
            <div className="text-[9px] font-bold py-0.5 px-3 bg-[--primary]/10 rounded-full border border-[--primary]/20 text-[--primary]">
              IDEAL: &gt; 80%
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col relative">
            <div className="absolute top-0 right-0 p-12 bg-[--primary]/5 blur-3xl rounded-full -mr-6 -mt-6" />
            <div className="mb-6">
               <p className="text-[9px] font-bold text-[--secondary-text] opacity-40 uppercase tracking-widest">Média Global de Eficiência</p>
               <p className="text-2xl font-serif text-[--primary] leading-none mt-1">{averageYieldStr}%</p>
            </div>

            <div className="flex items-end justify-between gap-3 h-[70px] mt-auto relative z-10">
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
                      <div className="relative w-full flex flex-col justify-end h-[60px] bg-white/5 rounded-t border-x border-t border-white/5 overflow-hidden group-hover:bg-white/[0.08] transition-colors">
                        <div className={`absolute top-1 w-full text-center font-bold text-[8px] ${textClass} z-20`}>
                          {yieldP.toFixed(0)}%
                        </div>
                        <div 
                          className={`w-full ${colorClass} transition-all duration-700 ease-out relative`} 
                          style={{ height: `${height}%` }}
                        >
                           <div className="w-full h-full bg-gradient-to-t from-black/40 to-white/10 opacity-60" />
                        </div>
                      </div>
                      <div className="mt-1.5 text-center w-full px-0.5">
                        <p className="text-[8px] font-bold text-[--foreground] truncate uppercase tracking-tighter opacity-60">{roast.green_coffee?.name || 'Lote'}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="w-full flex items-center justify-center text-[--secondary-text] italic h-full opacity-30 text-[10px] uppercase tracking-widest">Nenhuma torra recente</div>
              )}
            </div>
          </div>
        </div>

        {/* Lotes Recentes - ESTILO ROAST LIST */}
        <div className="glass-panel p-0 flex flex-col overflow-hidden border-t-2 border-[--primary]/20">
          <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 text-[--primary]" />
              <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Lotes Recentes</h2>
            </div>
            <span className="text-[10px] font-bold py-0.5 px-3 bg-white/5 rounded-full border border-white/10 text-[--primary]/60">{latestFive.length}</span>
          </div>
          <div className="p-0 flex flex-col overflow-y-auto max-h-[220px] scrollbar-thin">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => (
                <div key={roast.id || idx} className="flex items-center gap-4 p-3 border-b border-white/5 hover:bg-white/[0.08] transition-colors group">
                  <div className="w-9 h-9 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center shrink-0 group-hover:border-[--primary]/50 transition-colors">
                    <span className="text-[9px] font-bold text-[--primary]">TR</span>
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-[11px] font-bold text-[--foreground] truncate uppercase tracking-tight">{roast.green_coffee?.name || 'Lote de Café'}</h4>
                     <p className="text-[9px] font-bold text-[--secondary-text] opacity-40 capitalize tracking-tight">Sessão em {formatDate(roast.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-[--success] leading-none">{roast.qty_after_kg.toFixed(1)}kg</div>
                    <div className="text-[9px] font-bold text-[--secondary-text] opacity-30 uppercase tracking-tighter mt-0.5">Peso Final</div>
                  </div>
                </div>
              ))
            ) : (
               <p className="text-[10px] text-[--secondary-text] text-center italic p-10 uppercase tracking-widest opacity-30">Nenhum registro encontrado</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards Row (4 cards) - ESTILO ROAST LIST HIERARCHY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Faturamento */}
        <div className="glass-panel p-0 border-t-2 border-t-[--primary]/20 relative overflow-hidden group">
           <div className="p-3 border-b border-white/5 wood-texture bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <TrendingUp className="w-3.5 h-3.5 text-[--primary]" />
               <span className="font-serif text-[--primary] text-base tracking-widest uppercase">Faturamento</span>
             </div>
             <ArrowUpRight className="w-3 h-3 text-[--success]" />
           </div>
           <div className="p-5">
             <div className="flex items-baseline gap-1.5">
               <span className="text-xl font-bold text-[--foreground]">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             </div>
             <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-0.5">
               <span className="text-[9px] font-bold text-[--secondary-text] opacity-40 uppercase tracking-widest">Acumulado 30 dias</span>
               <span className="text-[10px] text-[--success] font-bold uppercase tracking-tight">Crescimento de {stats.revenueChange}%</span>
             </div>
           </div>
        </div>

        {/* A Receber */}
        <div className="glass-panel p-0 border-t-2 border-t-[--warning]/20 relative overflow-hidden group">
           <div className="p-3 border-b border-white/5 wood-texture bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <Clock className="w-3.5 h-3.5 text-[--warning]" />
               <span className="font-serif text-[--warning] text-base tracking-widest uppercase">A Receber</span>
             </div>
           </div>
           <div className="p-5">
             <div className="flex items-baseline gap-1.5">
               <span className="text-xl font-bold text-[--warning]">R$ {stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             </div>
             <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-0.5">
               <span className="text-[9px] font-bold text-[--secondary-text] opacity-40 uppercase tracking-widest">Saldo Pendente</span>
               <span className="text-[10px] text-[--secondary-text] font-bold uppercase tracking-tight opacity-60">Faturas em Aberto</span>
             </div>
           </div>
        </div>

        {/* Base Clientes */}
        <div className="glass-panel p-0 border-t-2 border-t-[--success]/20 relative overflow-hidden group">
           <div className="p-3 border-b border-white/5 wood-texture bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <Users className="w-3.5 h-3.5 text-[--success]" />
               <span className="font-serif text-[--success] text-base tracking-widest uppercase">Clientes</span>
             </div>
           </div>
           <div className="p-5">
             <div className="flex items-baseline gap-1.5">
               <span className="text-xl font-bold text-[--foreground]">{clients.length}</span>
               <span className="text-[10px] font-bold text-[--secondary-text] opacity-30 uppercase tracking-widest">Ativos</span>
             </div>
             <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-0.5">
               <span className="text-[9px] font-bold text-[--secondary-text] opacity-40 uppercase tracking-widest">Base de Dados</span>
               <span className="text-[10px] text-[--success] font-bold uppercase tracking-tight">Status Operacional</span>
             </div>
           </div>
        </div>

        {/* Vendas */}
        <div className="glass-panel p-0 border-t-2 border-t-[--primary]/20 relative overflow-hidden group">
           <div className="p-3 border-b border-white/5 wood-texture bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <ShoppingBag className="w-3.5 h-3.5 text-[--primary]" />
               <span className="font-serif text-[--primary] text-base tracking-widest uppercase">Vendas</span>
             </div>
           </div>
           <div className="p-5">
             <div className="flex items-baseline gap-1.5">
               <span className="text-xl font-bold text-[--foreground]">{stats.salesCount}</span>
               <span className="text-[10px] font-bold text-[--secondary-text] opacity-30 uppercase tracking-widest">Pedidos</span>
             </div>
             <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-0.5">
               <span className="text-[9px] font-bold text-[--secondary-text] opacity-40 uppercase tracking-widest">Volume Comercial</span>
               <span className="text-[10px] text-[--primary] font-bold uppercase tracking-tight">Período Mensal</span>
             </div>
           </div>
        </div>
      </div>

      {/* Bottom Section: Yield Trend and Total Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Rendimento Final (Line Chart Style) */}
        <div className="glass-panel p-0 relative overflow-hidden border-t-2 border-[--success]/20">
          <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[--success]" />
              <h2 className="font-serif text-[--success] text-base tracking-widest uppercase">Tendência de Rendimento</h2>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-[--secondary-text] font-bold opacity-30">Sparkline</span>
          </div>
          
          <div className="p-6 relative z-10 flex flex-col items-center justify-center min-h-[100px]">
             <div className="h-[35px] w-full relative z-10 px-2">
               <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
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
                       className="drop-shadow-[0_0_5px_rgba(34,197,94,0.3)]"
                     />
                   </>
                 )}
               </svg>
             </div>
             <div className="mt-5 flex gap-10">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase font-bold text-[--secondary-text] opacity-40 tracking-widest">Performance Mínima</span>
                  <span className="text-sm font-bold text-[--danger] mt-0.5">74.2%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase font-bold text-[--secondary-text] opacity-40 tracking-widest">Performance Máxima</span>
                  <span className="text-sm font-bold text-[--success] mt-0.5">92.8%</span>
                </div>
             </div>
          </div>
        </div>

        {/* Quantidade em Estoque - PADRONIZADO ROAST LIST STYLE */}
        <div className="glass-panel p-0 flex flex-col border-t-2 border-[--primary]/20">
          <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-[--primary]" />
              <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Total em Estoque</h2>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-[--secondary-text] font-bold opacity-30">Status Geral</span>
          </div>
           
           <div className="p-0">
             <div className="flex justify-between items-center p-4 border-b border-white/5 hover:bg-white/[0.05] transition-colors">
               <div>
                 <p className="text-[11px] font-bold text-[--foreground] uppercase tracking-tight">Café Verde</p>
                 <p className="text-[9px] font-bold text-[--secondary-text] opacity-40 uppercase tracking-widest mt-0.5">Matéria-prima em sacas</p>
               </div>
               <div className="text-right">
                 <span className="text-lg font-bold text-[--foreground]">{totalGreenStock.toFixed(1)}</span>
                 <span className="text-[10px] font-bold opacity-30 tracking-widest uppercase ml-1.5">kg</span>
               </div>
             </div>
             
             <div className="flex justify-between items-center p-4 border-b border-white/5 hover:bg-white/[0.05] transition-colors">
               <div>
                 <p className="text-[11px] font-bold text-[--primary] uppercase tracking-tight">Café Embalado</p>
                 <p className="text-[9px] font-bold text-[--secondary-text] opacity-40 uppercase tracking-widest mt-0.5">Produtos finalizados</p>
               </div>
               <div className="text-right">
                 <span className="text-lg font-bold text-[--primary]">{totalRoastedUnits}</span>
                 <span className="text-[10px] font-bold opacity-30 tracking-widest uppercase ml-1.5">unid</span>
               </div>
             </div>

             <div className="m-4 p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[--success]/10 rounded-full">
                    <Activity className="w-3.5 h-3.5 text-[--success]" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[--secondary-text] opacity-40 uppercase tracking-widest block">Status do Sistema</span>
                    <span className="text-[10px] font-bold text-[--success] uppercase tracking-tight">Operação Estabilizada</span>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
