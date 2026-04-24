import { getAllTenants, getAllUsers } from './actions'
import { Users, Building2, TrendingUp, Calendar, ShieldCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/utils/auth'

export default async function AdminMasterPage() {
  // Verificação de segurança extra no nível da página
  if (!(await isAdmin())) {
    redirect('/dashboard')
  }

  const [tenants, allUsers] = await Promise.all([
    getAllTenants(),
    getAllUsers()
  ])

  const totalSaaSRevenue = tenants.reduce((acc, t) => acc + t.totalRevenue, 0)

  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[--primary] shadow-glow" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[--primary] opacity-80">Portal do Gestor</span>
          </div>
          <h1 className="text-4xl font-serif text-[--foreground] tracking-tight">Admin Master <span className="text-[--primary] opacity-40">SaaS</span></h1>
          <p className="text-[--secondary-text] mt-2 italic opacity-60">Visão global da plataforma Torra 360.</p>
        </div>
      </div>

      {/* Stats SaaS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-6 flex flex-col gap-2 border-t-2 border-[--primary]/30 relative overflow-hidden group">
          <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <Building2 className="w-4 h-4 text-[--primary]" />
            <span className="text-xs uppercase tracking-widest font-bold">Total de Tenants</span>
          </div>
          <div className="text-4xl font-serif text-[--primary]">{tenants.length}</div>
          <div className="text-[10px] text-[--secondary-text] opacity-40 uppercase font-bold tracking-tighter">Empresas Cadastradas</div>
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Building2 className="w-16 h-16" />
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-2 border-t-2 border-[--success]/30 relative overflow-hidden group">
          <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <TrendingUp className="w-4 h-4 text-[--success]" />
            <span className="text-xs uppercase tracking-widest font-bold">Faturamento Global</span>
          </div>
          <div className="text-4xl font-serif text-[--success]">R$ {totalSaaSRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-[--secondary-text] opacity-40 uppercase font-bold tracking-tighter">Volume total de vendas no SaaS</div>
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <TrendingUp className="w-16 h-16" />
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-2 border-t-2 border-blue-500/30 relative overflow-hidden group">
          <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs uppercase tracking-widest font-bold">Usuários Totais</span>
          </div>
          <div className="text-4xl font-serif text-blue-400">{allUsers.length}</div>
          <div className="text-[10px] text-[--secondary-text] opacity-40 uppercase font-bold tracking-tighter">Colaboradores ativos na rede</div>
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Users className="w-16 h-16" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Tabela de Tenants */}
        <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20">
          <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40 flex items-center justify-between">
            <h2 className="font-serif text-[--primary] text-lg tracking-widest uppercase flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Gestão de Empresas
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold">Tenant / Empresa</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold text-center">Usuários</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold text-right">Receita Acumulada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[--foreground] group-hover:text-[--primary] transition-colors">{t.name}</span>
                        <span className="text-[10px] text-[--secondary-text] opacity-40 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Desde {new Date(t.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-mono font-bold bg-white/5 px-2 py-1 rounded">{t.userCount}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-[--success]">R$ {t.totalRevenue.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela de Usuários Recentes */}
        <div className="glass-panel overflow-hidden border-t-2 border-blue-500/20">
          <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40 flex items-center justify-between">
            <h2 className="font-serif text-blue-400 text-lg tracking-widest uppercase flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuários Globais
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold">Usuário</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold">Organização</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold text-right">Papel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allUsers.slice(0, 10).map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[--foreground]">{u.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-[--secondary-text] opacity-60">{u.tenants?.[0]?.name || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded ${
                        u.role === 'admin' ? 'bg-[--primary]/20 text-[--primary]' : 'bg-white/5 text-[--secondary-text]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
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
