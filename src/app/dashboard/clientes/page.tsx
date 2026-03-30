import { getClients, deleteClientRecord } from './actions'
import ClientForm from './ClientForm'
import { Pencil, Trash2 } from 'lucide-react'

export default async function ClientesPage() {
  const clients = await getClients()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Clientes</h1>
          <p className="text-[--secondary-text] mt-1">Gerenciamento de clientes e contatos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Formulário de Cadastro */}
        <div className="glass-panel p-6 h-fit">
          <h2 className="text-xl font-serif mb-6 text-[--primary]">Novo Cliente</h2>
          <ClientForm />
        </div>

        {/* Listagem de Clientes */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="glass-panel overflow-hidden">
             <div className="p-4 border-b border-[--card-border] card-texture-header">
              <h2 className="font-serif">Listagem de Clientes</h2>
             </div>
             <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[--secondary-text] text-xs uppercase border-b border-[--card-border]">
                    <th className="p-4 font-medium">Nome</th>
                    <th className="p-4 font-medium">Documento</th>
                    <th className="p-4 font-medium">Contato</th>
                    <th className="p-4 font-medium">Local</th>
                    <th className="p-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {clients && clients.length > 0 ? (
                    clients.map((client: any) => (
                      <tr key={client.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium text-[--primary]">{client.name}</td>
                        <td className="p-4 text-[--secondary-text] whitespace-nowrap">{client.cpf || '-'}</td>
                        <td className="p-4 text-[--secondary-text] whitespace-nowrap">{client.phone || '-'}</td>
                        <td className="p-4 text-[--secondary-text] text-xs">{(client.city || client.state) ? `${client.city || ''} ${client.state ? '- ' + client.state : ''}` : '-'}</td>
                        <td className="p-4 flex items-center justify-end gap-3">
                          <span className="text-[--primary] opacity-60 hover:opacity-100 cursor-pointer bg-transparent border-0 flex items-center justify-center p-0" title="Edição em breve">
                            <Pencil className="w-[12px] h-[12px]" />
                          </span>
                          <form action={deleteClientRecord} className="flex items-center justify-center">
                            <input type="hidden" name="id" value={client.id} />
                            <button type="submit" className="text-[--danger] opacity-60 hover:opacity-100 !bg-transparent !border-0 !p-0 cursor-pointer flex items-center justify-center">
                              <Trash2 className="w-[12px] h-[12px]" />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-[--secondary-text] italic">
                        Nenhum cliente cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
