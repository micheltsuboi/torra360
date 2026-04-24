'use client'

import { useState } from 'react'
import { Building2, Calendar, CheckCircle2, XCircle, Plus, Search, Loader2 } from 'lucide-react'
import { createTenant, toggleTenantStatus } from './actions'

interface Tenant {
  id: string
  name: string
  active: boolean
  created_at: string
  userCount: number
  totalRevenue: number
}

export default function AdminClient({ initialTenants }: { initialTenants: Tenant[] }) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants)
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [search, setSearch] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setIsCreating(true)
    try {
      const newTenant = await createTenant(newName)
      setTenants([
        { 
          ...newTenant, 
          active: true, 
          userCount: 0, 
          totalRevenue: 0 
        } as Tenant, 
        ...tenants
      ])
      setNewName('')
    } catch (error) {
      console.error('Erro ao criar empresa:', error)
      alert('Erro ao criar empresa')
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setLoadingId(id)
    try {
      await toggleTenantStatus(id, !currentStatus)
      setTenants(tenants.map(t => t.id === id ? { ...t, active: !currentStatus } : t))
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status')
    } finally {
      setLoadingId(null)
    }
  }

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-10">
      {/* Cadastro de Empresa */}
      <div className="glass-panel p-8 border-t-2 border-[--primary]/30 wood-texture bg-black/40 relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="font-serif text-[--primary] text-lg tracking-widest uppercase flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 shadow-glow" />
            Cadastrar Nova Empresa
          </h2>
          <form onSubmit={handleCreate} className="flex gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Torrefação Estrela do Sul"
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-5 py-3 text-sm focus:outline-none focus:border-[--primary]/50 transition-all placeholder:opacity-30"
              required
            />
            <button
              type="submit"
              disabled={isCreating}
              className="primary-btn px-8 flex items-center gap-2 disabled:opacity-50 min-w-[160px] justify-center"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Cadastrar</span>
            </button>
          </form>
        </div>
      </div>

      {/* Lista de Empresas */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20">
        <div className="px-8 py-6 border-b border-[--card-border] wood-texture bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[--primary]" />
            <h2 className="font-serif text-[--primary] text-lg tracking-widest uppercase">
              Gestão de Empresas <span className="opacity-30 ml-2">({tenants.length})</span>
            </h2>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
            <input 
              type="text"
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-full pl-10 pr-6 py-2 text-xs focus:outline-none focus:border-[--primary]/50 w-72 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/40">
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold opacity-60">Empresa / Data Cadastro</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold text-center opacity-60">Usuários</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold text-center opacity-60">Status Atual</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold text-right opacity-60">Controle de Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.03] transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-[--foreground] group-hover:text-[--primary] transition-colors">{t.name}</span>
                      <span className="text-[10px] text-[--secondary-text] opacity-40 flex items-center gap-1.5 uppercase tracking-tighter">
                        <Calendar className="w-3 h-3" />
                        Registrado em {new Date(t.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-mono font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-md">{t.userCount}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[9px] uppercase font-bold px-3 py-1 rounded-full tracking-widest ${
                      t.active 
                        ? 'bg-[--success]/10 text-[--success] border border-[--success]/20' 
                        : 'bg-[--danger]/10 text-[--danger] border border-[--danger]/20'
                    }`}>
                      {t.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleToggleStatus(t.id, t.active)}
                      disabled={loadingId === t.id}
                      className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all flex items-center gap-2 ml-auto border h-fit ${
                        t.active 
                          ? 'border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/20' 
                          : 'border-emerald-500 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20'
                      } disabled:opacity-30`}
                    >
                      {loadingId === t.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : t.active ? (
                        <>
                          <XCircle className="w-3 h-3" />
                          Bloquear Empresa
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Ativar Empresa
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30 italic">
                      <Search className="w-8 h-8 mb-2" />
                      <p>Nenhuma empresa encontrada na busca.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
