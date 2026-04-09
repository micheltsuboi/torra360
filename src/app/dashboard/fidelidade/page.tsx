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
        <div className="p-3 border-b border-[--card-border] wood-texture backdrop-blur-sm bg-black/40 flex justify-between items-center">
           <div className="flex items-center gap-2">
             <UserCheck className="w-4 h-4 text-[--primary]" />
             <h2 className="text-sm text-[--primary] font-serif uppercase tracking-widest">Saldo de Cashback por Cliente</h2>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-sm border-collapse">
              <thead className="text-[10px] capitalize tracking-widest text-[--secondary-text] opacity-60 font-sans border-b border-white/10 bg-black/20">
                 <tr>
                    <th className="p-4 text-center font-bold opacity-40">Cliente</th>
                    <th className="p-4 text-center font-bold opacity-40">Contato</th>
                    <th className="p-4 text-center font-bold opacity-40">Total Acumulado</th>
                    <th className="p-4 text-center font-bold opacity-40">Total Resgatado</th>
                    <th className="p-4 text-center font-bold opacity-40">Saldo Disponível</th>
                 </tr>
              </thead>
               <tbody className="text-center font-sans">
                 {report.map((client: any, index: number) => (
                    <tr key={client.id} className="border-b border-white/5 hover:bg-white/[0.08] transition-colors group" style={{ backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}>
                       <td className="p-4 font-bold text-[--foreground]">{client.name}</td>
                       <td className="p-4 opacity-60 text-xs border-l border-white/5">
                          <div className="flex items-center justify-center gap-2">
                             <span>{client.phone || '-'}</span>
                             {client.phone && (
                                <a 
                                  href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-white hover:scale-125 transition-transform opacity-70 hover:opacity-100"
                                  title="Abrir WhatsApp"
                                >
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
