import { getClients } from './actions'
import ClientPageHeader from './ClientPageHeader'
import ClientList from './ClientList'

export default async function ClientesPage() {
  const clients = await getClients()

  return (
    <div className="flex flex-col gap-10">
      <ClientPageHeader />

      {/* Listagem de Clientes - Base */}
      <ClientList clients={clients} />
    </div>
  )
}
