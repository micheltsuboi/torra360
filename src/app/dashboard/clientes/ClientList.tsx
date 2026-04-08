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
            <thead>
              <tr className="text-[--secondary-text] text-xs capitalize border-b border-[--card-border]">
                <th className="p-2 font-medium">Nome</th>
                <th className="p-2 font-medium">Documento</th>
                <th className="p-2 font-medium">Contato</th>
                <th className="p-2 font-medium">Local</th>
                <th className="p-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredClients && filteredClients.length > 0 ? (
                filteredClients.map((client: any) => (
                  <tr key={client.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors">
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
                            className="text-[#25D366] hover:scale-110 transition-transform"
                            title="Abrir WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-current opacity-80" />
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
