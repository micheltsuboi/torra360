import { getClients } from './actions'
import ClientForm from './ClientForm'
import ClientList from './ClientList'

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

      <div className="flex flex-col gap-10">
        
        {/* Formulário de Cadastro - Topo */}
        <div className="glass-panel p-6 h-fit max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-serif mb-6 text-[--primary]">Novo Cliente</h2>
          <ClientForm />
        </div>

        {/* Listagem de Clientes - Base */}
        <ClientList clients={clients} />
        
      </div>
    </div>
  )
}
