import { getLoyaltyStats, getCustomerLoyaltyReport } from './actions'
import FidelityStats from './FidelityStats'
import { Star, Gift, Search, ArrowRight, UserCheck, MessageCircle } from 'lucide-react'

export default async function FidelityPage() {
  const stats = await getLoyaltyStats()
  const report = await getCustomerLoyaltyReport()

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
           <h1 className="text-3xl font-serif text-[--foreground]">Programa de Fidelidade</h1>
           <p className="text-[--secondary-text] mt-1">Gere recompensa para seus clientes e acompanhe os resgates de cashback.</p>
        </div>
      </div>

      {/* Cards de Métricas e Configuração Admin */}
      <FidelityStats stats={stats} />

      {/* Relatório de Clientes */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20 flex flex-col mt-4">
        <div className="p-3 border-b border-[--card-border] card-texture-header bg-black/40 flex justify-between items-center">
           <div className="flex items-center gap-2">
             <UserCheck className="w-4 h-4 text-[--primary]" />
             <h2 className="title-glow text-base text-[--primary] font-serif uppercase tracking-widest">Saldo de Cashback por Cliente</h2>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-sm border-collapse">
              <thead className="bg-white/5 text-[--secondary-text] uppercase tracking-tighter text-[10px] border-b border-white/10">
                 <tr>
                    <th className="p-4 text-center">Cliente</th>
                    <th className="p-4 text-center border-l border-white/5">Contato</th>
                    <th className="p-4 text-center border-l border-white/5">Total Acumulado</th>
                    <th className="p-4 text-center border-l border-white/5">Total Resgatado</th>
                    <th className="p-4 text-center border-l border-white/5 bg-[--primary]/5">Saldo Disponível</th>
                 </tr>
              </thead>
              <tbody className="text-center">
                 {report.map((client: any) => (
                    <tr key={client.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                       <td className="p-4 font-bold text-[--foreground]">{client.name}</td>
                       <td className="p-4 opacity-60 text-xs border-l border-white/5">
                          <div className="flex items-center justify-center gap-2">
                             <span>{client.phone || '-'}</span>
                             {client.phone && (
                                <a 
                                  href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#25D366] hover:scale-125 transition-transform"
                                  title="Abrir WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4 fill-current" />
                                </a>
                             )}
                          </div>
                       </td>
                       <td className="p-4 font-mono text-[--success] border-l border-white/5">R$ {client.earned.toFixed(2)}</td>
                       <td className="p-4 font-mono text-[--danger] border-l border-white/5">R$ {client.redeemed.toFixed(2)}</td>
                       <td className="p-4 font-mono font-bold text-[--primary] bg-[--primary]/5 group-hover:bg-[--primary]/10 transition-colors border-l border-white/5">
                          R$ {client.balance.toFixed(2)}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

    </div>
  )
}
