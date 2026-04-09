'use client'

import { useState } from 'react'
import { Pencil, Trash2, Search, MessageCircle } from 'lucide-react'
import { deleteClientRecord, updateClientRecord } from './actions'
import Modal from '@/components/ui/Modal'

export default function ClientList({ clients }: { clients: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingClient, setEditingClient] = useState<any | null>(null)

  const filteredClients = clients?.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.state?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de Busca Externa - De fora a fora */}
      <div className="flex items-center bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner w-full">
        <div className="flex items-center w-full bg-black/60 rounded-lg border border-white/10 px-4 gap-3 focus-within:border-[--primary]/50 transition-all">
          <Search className="w-5 h-5 text-[--primary] opacity-60 shrink-0" />
          <input 
            type="text"
            placeholder="Buscar por nome, documento, telefone ou local..."
            className="!py-3 !bg-transparent !border-none !p-0 focus:!ring-0 w-full !text-sm font-sans outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-t-2 border-[--primary]/20">
        <div className="p-3 border-b border-[--card-border] card-texture-header bg-black/20">
          <h2 className="font-serif text-[--primary] text-base tracking-widest uppercase">Listagem de Clientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-[10px] capitalize tracking-widest text-[--secondary-text] opacity-60 font-sans border-b border-white/10 bg-black/20">
              <tr>
                <th className="p-2 font-bold opacity-40 text-left">Nome</th>
                <th className="p-2 font-bold opacity-40 text-left">Documento</th>
                <th className="p-2 font-bold opacity-40 text-left">Contato</th>
                <th className="p-2 font-bold opacity-40 text-left">Local</th>
                <th className="p-2 font-bold opacity-40 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="font-sans">
              {filteredClients && filteredClients.length > 0 ? (
                filteredClients.map((client: any, index: number) => (
                  <tr key={client.id} className="border-b border-white/5 hover:bg-white/[0.08] transition-colors group" style={{ backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}>
                    <td className="p-2 font-medium text-[--primary]">{client.name}</td>
                    <td className="p-2 text-[--secondary-text] whitespace-nowrap">{client.cpf || '-'}</td>
                    <td className="p-2 text-[--secondary-text] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {client.phone || '-'}
                        {client.phone && (
                          <a 
                            href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white hover:scale-110 transition-transform opacity-70 hover:opacity-100"
                            title="Abrir WhatsApp"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-[--secondary-text] text-xs">{(client.city || client.state) ? `${client.city || ''} ${client.state ? '- ' + client.state : ''}` : '-'}</td>
                    <td className="p-2 flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setEditingClient(client)}
                        className="action-icon-btn text-[--primary]" 
                        title="Editar"
                      >
                        <Pencil className="action-icon" />
                      </button>
                      <form action={deleteClientRecord}>
                        <input type="hidden" name="id" value={client.id} />
                        <button type="submit" className="action-icon-btn text-[--danger]">
                          <Trash2 className="action-icon" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-[--secondary-text] italic">
                    {searchTerm ? 'Nenhum cliente encontrado para esta busca.' : 'Nenhum cliente cadastrado.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição */}
      <Modal 
        isOpen={editingClient !== null} 
        onClose={() => setEditingClient(null)} 
        title="Editar Cliente"
      >
        {editingClient && (
          <form action={async (formData) => {
            await updateClientRecord(formData)
            setEditingClient(null)
          }} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={editingClient.id} />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text]">Nome Completo</label>
                <input name="name" defaultValue={editingClient.name} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text]">CPF / CNPJ</label>
                <input name="cpf" defaultValue={editingClient.cpf} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text]">Telefone</label>
                <input name="phone" defaultValue={editingClient.phone} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text]">Data de Nascimento</label>
                <input name="birth_date" type="date" defaultValue={editingClient.birth_date} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[--secondary-text]">Endereço</label>
              <input name="address" defaultValue={editingClient.address} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text]">Cidade</label>
                <input name="city" defaultValue={editingClient.city} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text]">Estado (UF)</label>
                <input name="state" defaultValue={editingClient.state} maxLength={2} />
              </div>
            </div>

            <button type="submit" className="golden-btn py-4 mt-2">
              Salvar Alterações
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
