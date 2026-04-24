import { getRoastBatches } from './torra/actions'
import { getFinancialStats } from './financeiro/actions'
import { getClients } from './clientes/actions'
import { getGreenCoffeeLots } from './estoque/actions'
import { getPackages } from './pacotes/actions'
import { formatDate } from '@/utils/date-utils'
import { isAdmin } from '@/utils/auth'
import { redirect } from 'next/navigation'
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
  // Redireciona se for Admin Master
  if (await isAdmin()) {
    redirect('/dashboard/admin')
  }

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
    <div className="flex flex-col gap-12 mt-4 pb-12 w-full">
      {/* Título da Página Discreto */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-2xl font-serif text-[--foreground] tracking-tight">Visão Geral</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[--secondary-text] opacity-30 font-medium">Controle operacional e comercial em tempo real</p>
      </div>

      {/* BLOCO SUPERIOR: Performance e Lotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Card: Taxa de Rendimento */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 flex flex-col">
          <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Taxa de Rendimento</h2>
            <div className="text-[10px] font-bold py-0.5 px-3 bg-[--primary]/10 rounded-full border border-[--primary]/20 text-[--primary] uppercase tracking-wider">
              Meta: &gt; 80%
            </div>
          </div>
          
          <div className="p-8 flex-1 flex flex-col relative">
            <div className="mb-6">
               <p className="text-[10px] font-normal text-[--secondary-text] opacity-40 uppercase tracking-[0.2em]">Média Global de Eficiência</p>
               <div className="flex items-baseline gap-1 mt-1">
                 <span className="text-4xl font-serif text-[--primary] leading-none">{averageYieldStr.split('.')[0]}</span>
                 <span className="text-xl font-serif text-[--primary] opacity-40">.{averageYieldStr.split('.')[1]}%</span>
               </div>
            </div>

            <div className="flex items-end justify-between gap-4 h-[80px] mt-auto relative z-10">
              {latestFive.length > 0 ? (
                latestFive.map((roast: any, idx: number) => {
                  const yieldP = parseFloat(roast.yield_percentage || ((roast.qty_after_kg / roast.qty_before_kg) * 100).toString())
                  const height = Math.min(100, Math.max(20, yieldP))
                  
                  let colorClass = 'bg-[--primary]'
                  let textClass = 'text-[--primary]'
                  
                  if (yieldP < 78) { colorClass = 'bg-[--danger]'; textClass = 'text-[--danger]'; }
                  else if (yieldP >= 78 && yieldP < 82) { colorClass = 'bg-[--warning]'; textClass = 'text-[--warning]'; }
                  else { colorClass = 'bg-[--success]'; textClass = 'text-[--success]'; }

                  return (
                    <div key={roast.id || idx} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full flex flex-col justify-end h-[60px] bg-white/[0.03] rounded-t-lg border-x border-t border-white/5 overflow-hidden group-hover:bg-white/[0.08] transition-all">
                        <div className={`absolute top-1.5 w-full text-center font-bold text-[9px] ${textClass} z-20`}>
                          {yieldP.toFixed(0)}%
                        </div>
                        <div 
                          className={`w-full ${colorClass} transition-all duration-1000 ease-out relative`} 
                          style={{ height: `${height}%` }}
                        >
                           <div className="w-full h-full bg-gradient-to-t from-black/60 to-white/10 opacity-40" />
                        </div>
                      </div>
                      <div className="mt-2 text-center w-full px-1">
                        <p className="text-[8px] font-medium text-[--foreground] truncate uppercase tracking-widest opacity-20 group-hover:opacity-40 transition-opacity">{roast.green_coffee?.name || 'Lote'}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="w-full flex items-center justify-center text-[--secondary-text] italic h-full opacity-20 text-[10px] uppercase tracking-widest">Aguardando dados...</div>
              )}
            </div>
          </div>
        </div>

        {/* Card: Lotes Recentes */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 flex flex-col">
          <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Lotes Recentes</h2>
            <span className="text-[10px] font-bold py-0.5 px-2 bg-white/5 rounded border border-white/10 text-[--primary]/60 uppercase tracking-widest">{latestFive.length}</span>
          </div>
          <div className="p-0 flex flex-col overflow-y-auto max-h-[320px] scrollbar-thin">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => (
                <div key={roast.id || idx} className="flex items-center gap-5 px-6 py-4 border-b border-white/5 hover:bg-white/[0.05] transition-colors group">
                  <div className="w-10 h-10 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center shrink-0 group-hover:border-[--primary]/40 transition-colors">
                    <span className="text-[10px] font-bold text-[--primary]">TR</span>
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-[12px] font-bold text-[--foreground] truncate uppercase tracking-wide">{roast.green_coffee?.name || 'Lote de Café'}</h4>
                     <p className="text-[10px] font-normal text-[--secondary-text] opacity-30 capitalize mt-0.5">Torrado em {formatDate(roast.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-[--success] leading-none tracking-tight">{roast.qty_after_kg.toFixed(1)}kg</div>
                    <div className="text-[9px] font-normal text-[--secondary-text] opacity-20 uppercase tracking-widest mt-1">Peso Líquido</div>
                  </div>
                </div>
              ))
            ) : (
               <div className="p-20 text-center text-[--secondary-text] italic opacity-20 text-[10px] uppercase tracking-widest">Nenhum registro</div>
            )}
          </div>
        </div>
      </div>

      {/* BLOCO CENTRAL: Cartões de Resumo (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Faturamento */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 flex flex-col">
          <div className="p-3 border-b border-white/5 wood-texture bg-black/40 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[--primary]" />
            <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Faturamento</h2>
          </div>
          <div className="px-6 py-6 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-3xl font-bold text-[--foreground] tracking-tight">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-1">
              <span className="text-[9px] font-normal text-[--secondary-text] opacity-40 uppercase tracking-widest">Acumulado 30 dias</span>
              <span className="text-[10px] text-[--success] font-medium uppercase tracking-wide">+{stats.revenueChange}% Crescimento</span>
            </div>
          </div>
        </div>

        {/* A Receber */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--warning]/20 flex flex-col">
          <div className="p-3 border-b border-white/5 wood-texture bg-black/40 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[--warning]" />
            <h2 className="font-serif text-[--warning] text-base tracking-widest uppercase">A Receber</h2>
          </div>
          <div className="px-6 py-6 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-3xl font-bold text-[--warning] tracking-tight">R$ {stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-1">
              <span className="text-[9px] font-normal text-[--secondary-text] opacity-40 uppercase tracking-widest">Saldo Pendente</span>
              <span className="text-[10px] text-[--secondary-text] font-medium uppercase tracking-wide opacity-40">Faturas em Aberto</span>
            </div>
          </div>
        </div>

        {/* Clientes */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--success]/20 flex flex-col">
          <div className="p-3 border-b border-white/5 wood-texture bg-black/40 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[--success]" />
            <h2 className="font-serif text-[--success] text-base tracking-widest uppercase">Clientes</h2>
          </div>
          <div className="px-6 py-6 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[--foreground] leading-none">{clients.length}</span>
              <span className="text-[10px] font-medium text-[--secondary-text] opacity-30 uppercase tracking-widest">Ativos</span>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-1">
              <span className="text-[9px] font-normal text-[--secondary-text] opacity-40 uppercase tracking-widest">Base de Dados</span>
              <span className="text-[10px] text-[--success] font-medium uppercase tracking-wide">Status Ativo</span>
            </div>
          </div>
        </div>

        {/* Vendas */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 flex flex-col">
          <div className="p-3 border-b border-white/5 wood-texture bg-black/40 flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[--primary]" />
            <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Vendas</h2>
          </div>
          <div className="px-6 py-6 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[--foreground] leading-none">{stats.salesCount}</span>
              <span className="text-[10px] font-medium text-[--secondary-text] opacity-30 uppercase tracking-widest">Pedidos</span>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-1">
              <span className="text-[9px] font-normal text-[--secondary-text] opacity-40 uppercase tracking-widest">Volume Comercial</span>
              <span className="text-[10px] text-[--primary] font-medium uppercase tracking-wide">Ciclo Mensal</span>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO INFERIOR: Tendência e Estoque */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gráfico de Tendência (Reduzido e Discreto) */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--success]/20 flex flex-col">
          <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[--success]" />
              <h2 className="font-serif text-[--success] text-base tracking-widest uppercase">Tendência de Rendimento</h2>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-[--secondary-text] opacity-30 font-medium">Histórico Recente</span>
          </div>
          
          <div className="p-8 flex flex-col">
             <div className="h-[50px] w-full relative">
               <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                 {recentRoasts.length > 1 && (
                   <>
                     <defs>
                       <linearGradient id="yieldArea" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="var(--success)" stopOpacity="0.1" />
                         <stop offset="100%" stopColor="var(--success)" stopOpacity="0" />
                       </linearGradient>
                     </defs>
                     <path 
                       d={`M 0,100 L ${recentRoasts.slice(0, 10).reverse().map((r, i) => {
                         const y = 100 - parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100));
                         const x = (i / (Math.min(10, recentRoasts.length) - 1)) * 100;
                         return `${x},${y}`
                       }).join(' L ')} L 100,100 Z`}
                       fill="url(#yieldArea)"
                     />
                     <path 
                       d={`M ${recentRoasts.slice(0, 10).reverse().map((r, i) => {
                         const y = 100 - parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100));
                         const x = (i / (Math.min(10, recentRoasts.length) - 1)) * 100;
                         return `${x},${y}`
                       }).join(' L ')}`}
                       fill="none"
                       stroke="var(--success)"
                       strokeWidth="2.5"
                       strokeLinecap="round"
                       className="opacity-60"
                     />
                     {recentRoasts.slice(0, 10).reverse().map((r, i) => {
                        const y = 100 - parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100));
                        const x = (i / (Math.min(10, recentRoasts.length) - 1)) * 100;
                        return (
                          <circle key={i} cx={x} cy={y} r="1.5" fill="var(--success)" className="opacity-80" />
                        )
                     })}
                   </>
                 )}
               </svg>
             </div>
             <div className="mt-8 flex justify-center gap-10">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase font-bold text-[--secondary-text] opacity-30 tracking-widest">Mínima</span>
                  <span className="text-sm font-bold text-[--danger] opacity-60">74.2%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase font-bold text-[--secondary-text] opacity-30 tracking-widest">Máxima</span>
                  <span className="text-sm font-bold text-[--success] opacity-60">92.8%</span>
                </div>
             </div>
          </div>
        </div>

        {/* Card: Estoque Total */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 flex flex-col">
          <div className="p-3 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-[--primary]" />
              <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Total em Estoque</h2>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-[--secondary-text] opacity-30 font-medium">Posição Atual</span>
          </div>
           
           <div className="p-0">
             <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 hover:bg-white/[0.03] transition-colors">
               <div>
                 <p className="text-[12px] font-bold text-[--foreground] uppercase tracking-wide">Café Verde</p>
                 <p className="text-[9px] font-normal text-[--secondary-text] opacity-30 uppercase tracking-widest mt-0.5">Matéria-prima disponível</p>
               </div>
               <div className="text-right">
                 <span className="text-2xl font-bold text-[--foreground] tracking-tight">{totalGreenStock.toFixed(1)}</span>
                 <span className="text-[10px] font-medium opacity-20 uppercase ml-2 tracking-widest">kg</span>
               </div>
             </div>
             
             <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 hover:bg-white/[0.03] transition-colors">
               <div>
                 <p className="text-[12px] font-bold text-[--primary] uppercase tracking-wide">Café Embalado</p>
                 <p className="text-[9px] font-normal text-[--secondary-text] opacity-30 uppercase tracking-widest mt-0.5">Produtos finalizados</p>
               </div>
               <div className="text-right">
                 <span className="text-2xl font-bold text-[--primary] tracking-tight">{totalRoastedUnits}</span>
                 <span className="text-[10px] font-medium opacity-20 uppercase ml-2 tracking-widest">unid</span>
               </div>
             </div>

             <div className="mx-8 my-5 p-4 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-[--success] opacity-40" />
                  <div>
                    <span className="text-[9px] font-normal text-[--secondary-text] opacity-30 uppercase tracking-widest block">Status de Dados</span>
                    <span className="text-[10px] font-bold text-[--success] uppercase tracking-wider block">Sistema Sincronizado</span>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
