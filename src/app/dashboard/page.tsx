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
    <div className="flex flex-col gap-12 pb-16 max-w-[1600px] mx-auto">
      {/* Header da Página */}
      <div className="flex flex-col gap-2 px-2">
        <h1 className="text-4xl font-serif text-[--foreground] tracking-tight">Visão Geral</h1>
        <p className="text-[11px] uppercase tracking-[0.5em] text-[--secondary-text] opacity-40 font-medium">Monitoramento analítico da operação</p>
      </div>

      {/* BLOCO SUPERIOR: Performance e Lotes */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Card: Taxa de Rendimento (Barras) */}
        <div className="glass-panel p-0 flex flex-col relative overflow-hidden border-t-2 border-[--primary]/30 shadow-2xl">
          <header className="px-8 py-5 border-b border-white/10 wood-texture bg-black/60 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[--primary]" />
              <h2 className="font-serif text-[--primary] text-lg tracking-[0.1em] uppercase">Taxa de Rendimento</h2>
            </div>
            <div className="text-[10px] font-bold py-1 px-4 bg-[--primary]/10 rounded-full border border-[--primary]/20 text-[--primary] uppercase tracking-widest">
              Meta: 80%+
            </div>
          </header>
          
          <div className="p-8 flex-1 flex flex-col min-h-[280px] relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[--primary]/5 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
            
            <div className="mb-10">
               <p className="text-[10px] font-normal text-[--secondary-text] opacity-60 uppercase tracking-[0.3em]">Eficiência Média Global</p>
               <div className="flex items-baseline gap-2 mt-2">
                 <span className="text-5xl font-serif text-[--primary] tracking-tighter">{averageYieldStr.split('.')[0]}</span>
                 <span className="text-2xl font-serif text-[--primary] opacity-40">.{averageYieldStr.split('.')[1]}%</span>
               </div>
            </div>

            <div className="flex items-end justify-between gap-5 h-[100px] mt-auto relative z-10">
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
                      <div className="relative w-full flex flex-col justify-end h-[80px] bg-white/[0.03] rounded-t-xl border-x border-t border-white/5 overflow-hidden group-hover:bg-white/[0.08] transition-all duration-300">
                        <div className={`absolute top-2 w-full text-center font-bold text-[10px] ${textClass} z-20`}>
                          {yieldP.toFixed(0)}%
                        </div>
                        <div 
                          className={`w-full ${colorClass} transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(0,0,0,0.5)]`} 
                          style={{ height: `${height}%` }}
                        >
                           <div className="w-full h-full bg-gradient-to-t from-black/60 to-white/20 opacity-40" />
                        </div>
                      </div>
                      <div className="mt-3 text-center w-full px-1">
                        <p className="text-[9px] font-medium text-[--foreground] truncate uppercase tracking-widest opacity-30 group-hover:opacity-60 transition-opacity">{roast.green_coffee?.name || 'Lote'}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="w-full flex items-center justify-center text-[--secondary-text] italic h-full opacity-20 text-[11px] uppercase tracking-widest">Aguardando dados...</div>
              )}
            </div>
          </div>
        </div>

        {/* Card: Lotes Recentes */}
        <div className="glass-panel p-0 flex flex-col overflow-hidden border-t-2 border-[--primary]/30 shadow-2xl">
          <header className="px-8 py-5 border-b border-white/10 wood-texture bg-black/60 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[--primary]" />
              <h2 className="font-serif text-[--primary] text-lg tracking-[0.1em] uppercase">Lotes Recentes</h2>
            </div>
            <span className="text-[11px] font-bold py-1 px-4 bg-white/5 rounded-full border border-white/10 text-[--primary]/60 uppercase tracking-widest">{latestFive.length}</span>
          </header>
          <div className="p-0 flex flex-col overflow-y-auto max-h-[350px] scrollbar-thin">
            {latestFive.length > 0 ? (
              latestFive.map((roast: any, idx: number) => (
                <div key={roast.id || idx} className="flex items-center gap-6 px-8 py-5 border-b border-white/5 hover:bg-white/[0.05] transition-colors group">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center shrink-0 group-hover:border-[--primary]/50 transition-all duration-300">
                    <span className="text-[11px] font-bold text-[--primary]">TR</span>
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-[13px] font-bold text-[--foreground] truncate uppercase tracking-wider">{roast.green_coffee?.name || 'Lote de Café'}</h4>
                     <p className="text-[10px] font-normal text-[--secondary-text] opacity-40 capitalize tracking-tight mt-1">Sessão em {formatDate(roast.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-[--success] leading-none tracking-tight">{roast.qty_after_kg.toFixed(1)}kg</div>
                    <div className="text-[10px] font-normal text-[--secondary-text] opacity-30 uppercase tracking-widest mt-1.5">Peso Final</div>
                  </div>
                </div>
              ))
            ) : (
               <div className="flex flex-col items-center justify-center p-24 opacity-20">
                 <Package className="w-12 h-12 mb-4" />
                 <p className="text-[11px] uppercase tracking-widest">Nenhum registro encontrado</p>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* BLOCO CENTRAL: Cartões de Resumo (4 colunas) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Faturamento', value: `R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: '[--primary]', sub: 'Acumulado 30 dias', trend: `Crescimento de ${stats.revenueChange}%`, trendColor: '[--success]' },
          { label: 'A Receber', value: `R$ ${stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: Clock, color: '[--warning]', sub: 'Saldo Pendente', trend: 'Faturas em Aberto', trendColor: '[--secondary-text]' },
          { label: 'Clientes', value: clients.length, labelSuffix: 'Ativos', icon: Users, color: '[--success]', sub: 'Base de Dados', trend: 'Status Operacional', trendColor: '[--success]' },
          { label: 'Vendas', value: stats.salesCount, labelSuffix: 'Pedidos', icon: ShoppingBag, color: '[--primary]', sub: 'Volume Comercial', trend: 'Ciclo Mensal', trendColor: '[--primary]' }
        ].map((item, idx) => (
          <div key={idx} className={`glass-panel p-0 border-t-2 border-t-${item.color}/40 relative overflow-hidden group shadow-xl`}>
             <header className="px-6 py-4 border-b border-white/5 wood-texture bg-black/60 flex justify-between items-center">
               <div className="flex items-center gap-2.5">
                 <item.icon className={`w-4 h-4 text-${item.color}`} />
                 <span className={`font-serif text-${item.color} text-[15px] tracking-[0.1em] uppercase`}>{item.label}</span>
               </div>
               {idx === 0 && <ArrowUpRight className="w-4 h-4 text-[--success] opacity-40" />}
             </header>
             <div className="px-7 py-7">
               <div className="flex items-baseline gap-2">
                 <span className={`text-2xl font-bold text-[--foreground] tracking-tight ${idx > 1 ? 'text-3xl' : ''}`}>{item.value}</span>
                 {item.labelSuffix && <span className="text-[11px] font-medium text-[--secondary-text] opacity-40 uppercase tracking-widest">{item.labelSuffix}</span>}
               </div>
               <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-1.5">
                 <span className="text-[10px] font-normal text-[--secondary-text] opacity-50 uppercase tracking-[0.15em]">{item.sub}</span>
                 <span className={`text-[11px] font-semibold uppercase tracking-wide text-${item.trendColor} ${idx === 1 ? 'opacity-60' : ''}`}>{item.trend}</span>
               </div>
             </div>
          </div>
        ))}
      </section>

      {/* BLOCO INFERIOR: Tendência e Estoque */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Card: Tendência de Rendimento (Gráfico de Área) */}
        <div className="glass-panel p-0 relative overflow-hidden border-t-2 border-[--success]/30 shadow-2xl">
          <header className="px-8 py-5 border-b border-white/10 wood-texture bg-black/60 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[--success]" />
              <h2 className="font-serif text-[--success] text-lg tracking-[0.1em] uppercase">Tendência de Rendimento</h2>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] font-medium opacity-40">Performance Volátil</span>
          </header>
          
          <div className="p-10 relative z-10 flex flex-col min-h-[200px]">
             <div className="h-[80px] w-full relative z-10">
               <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                 {recentRoasts.length > 1 && (
                   <>
                     <defs>
                       <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="var(--success)" stopOpacity="0.15" />
                         <stop offset="100%" stopColor="var(--success)" stopOpacity="0" />
                       </linearGradient>
                     </defs>
                     {/* Area Fill */}
                     <path 
                       d={`M 0,100 L ${recentRoasts.slice(0, 10).reverse().map((r, i) => {
                         const y = 100 - parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100));
                         const x = (i / (Math.min(10, recentRoasts.length) - 1)) * 100;
                         return `${x},${y}`
                       }).join(' L ')} L 100,100 Z`}
                       fill="url(#areaGradient)"
                     />
                     {/* Line Path */}
                     <path 
                       d={`M ${recentRoasts.slice(0, 10).reverse().map((r, i) => {
                         const y = 100 - parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100));
                         const x = (i / (Math.min(10, recentRoasts.length) - 1)) * 100;
                         return `${x},${y}`
                       }).join(' L ')}`}
                       fill="none"
                       stroke="var(--success)"
                       strokeWidth="3"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       className="drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                     />
                     {/* Data Points */}
                     {recentRoasts.slice(0, 10).reverse().map((r, i) => {
                        const y = 100 - parseFloat(r.yield_percentage || ((r.qty_after_kg / r.qty_before_kg) * 100));
                        const x = (i / (Math.min(10, recentRoasts.length) - 1)) * 100;
                        return (
                          <circle key={i} cx={x} cy={y} r="2" fill="var(--background)" stroke="var(--success)" strokeWidth="2" className="transition-all duration-300" />
                        )
                     })}
                   </>
                 )}
               </svg>
             </div>
             <div className="mt-12 flex justify-center gap-16">
                <div className="flex flex-col items-center">
                  <span className="text-[11px] uppercase font-medium text-[--secondary-text] opacity-50 tracking-widest">Mínima</span>
                  <span className="text-xl font-bold text-[--danger] mt-1.5">74.2%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] uppercase font-medium text-[--secondary-text] opacity-50 tracking-widest">Máxima</span>
                  <span className="text-xl font-bold text-[--success] mt-1.5">92.8%</span>
                </div>
             </div>
          </div>
        </div>

        {/* Card: Total em Estoque */}
        <div className="glass-panel p-0 flex flex-col border-t-2 border-[--primary]/30 shadow-2xl">
          <header className="px-8 py-5 border-b border-white/10 wood-texture bg-black/60 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[--primary]" />
              <h2 className="font-serif text-[--primary] text-lg tracking-[0.1em] uppercase">Total em Estoque</h2>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[--secondary-text] font-medium opacity-40">Consolidado</span>
          </header>
           
           <div className="p-0">
             <div className="flex justify-between items-center px-10 py-6 border-b border-white/5 hover:bg-white/[0.03] transition-colors">
               <div>
                 <p className="text-[14px] font-bold text-[--foreground] uppercase tracking-wider">Café Verde</p>
                 <p className="text-[10px] font-normal text-[--secondary-text] opacity-50 uppercase tracking-widest mt-1.5">Matéria-prima em sacas</p>
               </div>
               <div className="text-right">
                 <span className="text-3xl font-bold text-[--foreground] tracking-tighter">{totalGreenStock.toFixed(1)}</span>
                 <span className="text-[12px] font-medium opacity-20 tracking-widest uppercase ml-3">kg</span>
               </div>
             </div>
             
             <div className="flex justify-between items-center px-10 py-6 border-b border-white/5 hover:bg-white/[0.03] transition-colors">
               <div>
                 <p className="text-[14px] font-bold text-[--primary] uppercase tracking-wider">Café Embalado</p>
                 <p className="text-[10px] font-normal text-[--secondary-text] opacity-50 uppercase tracking-widest mt-1.5">Produtos finalizados</p>
               </div>
               <div className="text-right">
                 <span className="text-3xl font-bold text-[--primary] tracking-tighter">{totalRoastedUnits}</span>
                 <span className="text-[12px] font-medium opacity-20 tracking-widest uppercase ml-3">unid</span>
               </div>
             </div>

             <div className="mx-10 my-8 p-5 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-[--success]/10 rounded-full border border-[--success]/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <Activity className="w-5 h-5 text-[--success]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-normal text-[--secondary-text] opacity-50 uppercase tracking-[0.2em] block">Status do Sistema</span>
                    <span className="text-[12px] font-bold text-[--success] uppercase tracking-[0.1em] mt-1 block">Operação Estabilizada</span>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>
    </div>
  )
}
