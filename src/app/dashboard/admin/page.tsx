import { getAllTenants } from './actions'
import { Building2, ShieldCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/utils/auth'
import AdminClient from './AdminClient'

export default async function AdminMasterPage() {
  // Verificação de segurança extra no nível da página
  if (!(await isAdmin())) {
    redirect('/dashboard')
  }

  const tenants = await getAllTenants()

  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-700 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[--primary] shadow-glow" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[--primary] opacity-80">Portal do Gestor</span>
          </div>
          <h1 className="text-4xl font-serif text-[--foreground] tracking-tight">Admin Master <span className="text-[--primary] opacity-40">SaaS</span></h1>
          <p className="text-[--secondary-text] mt-2 italic opacity-60">Gerenciamento centralizado da plataforma Torra 360.</p>
        </div>
      </div>

      {/* Stats Simplificado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 flex flex-col gap-3 border-t-2 border-[--primary]/30 relative overflow-hidden group wood-texture">
          <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
            <Building2 className="w-5 h-5 text-[--primary]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Total de Empresas</span>
          </div>
          <div className="text-5xl font-serif text-[--primary] drop-shadow-glow">{tenants.length}</div>
          <div className="text-[10px] text-[--secondary-text] opacity-40 uppercase font-bold tracking-widest">Base global cadastrada</div>
        </div>

        <div className="glass-panel p-8 flex flex-col gap-3 border-t-2 border-[--success]/30 relative overflow-hidden group wood-texture">
          <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-5 h-5 text-[--success]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Operações Ativas</span>
          </div>
          <div className="text-5xl font-serif text-[--success] drop-shadow-glow">{tenants.filter(t => t.active).length}</div>
          <div className="text-[10px] text-[--secondary-text] opacity-40 uppercase font-bold tracking-widest">Licenças em vigor</div>
        </div>
      </div>

      {/* Gestão de Empresas (Client Component) */}
      <AdminClient initialTenants={tenants} />
    </div>
  )
}
