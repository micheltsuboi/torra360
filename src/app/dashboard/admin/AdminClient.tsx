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
    <div className="flex flex-col gap-8">
      {/* Cadastro de Empresa */}
      <div className="glass-panel p-6 border-t-2 border-[--primary]/30 bg-black/20">
        <h2 className="font-serif text-[--primary] text-lg tracking-widest uppercase flex items-center gap-2 mb-6">
          <Plus className="w-5 h-5" />
          Cadastrar Nova Empresa
        </h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome da Torrefação / Empresa"
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[--primary]/50 transition-colors"
            required
          />
          <button
            type="submit"
            disabled={isCreating}
            className="bg-[--primary] hover:bg-[--primary]/80 text-black font-bold px-6 py-2 rounded-lg text-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Cadastrar
          </button>
        </form>
      </div>

      {/* Lista de Empresas */}
      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20">
        <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40 flex items-center justify-between">
          <h2 className="font-serif text-[--primary] text-lg tracking-widest uppercase flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Gestão de Empresas ({tenants.length})
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input 
              type="text"
              placeholder="Buscar empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[--primary]/50 w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold">Empresa</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold text-center">Usuários</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold text-center">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[--secondary-text] font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTenants.map((t) => (
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
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded ${
                      t.active ? 'bg-[--success]/20 text-[--success]' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {t.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(t.id, t.active)}
                      disabled={loadingId === t.id}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ml-auto ${
                        t.active 
                          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                          : 'bg-[--success]/10 text-[--success] hover:bg-[--success]/20'
                      }`}
                    >
                      {loadingId === t.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : t.active ? (
                        <>
                          <XCircle className="w-3 h-3" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Ativar
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[--secondary-text] opacity-40 italic">
                    Nenhuma empresa encontrada.
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
