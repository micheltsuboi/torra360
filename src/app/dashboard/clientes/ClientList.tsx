'use client'

import { useState } from 'react'
import { Pencil, Trash2, Search, MessageCircle } from 'lucide-react'
import { deleteClientRecord } from './actions'

export default function ClientList({ clients }: { clients: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')

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
                      <span className="action-icon-btn text-[--primary] opacity-60" title="Edição em breve">
                        <Pencil className="action-icon" />
                      </span>
                      <form action={deleteClientRecord}>
                        <input type="hidden" name="id" value={client.id} />
                        <button type="submit" className="action-icon-btn text-[--danger] opacity-60">
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
    </div>
  )
}
