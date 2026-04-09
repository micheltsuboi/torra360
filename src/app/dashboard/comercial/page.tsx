import SalesHistoryClient from './SalesHistoryClient'
import { getPDVData, getSalesHistory } from './actions'
import PDVComponent from './PDVComponent'

export default async function ComercialPage() {
  const { clients, products } = await getPDVData()
  const salesHistory = await getSalesHistory()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">PDV & Comercial</h1>
          <p className="text-[--secondary-text] mt-1 text-sm opacity-60">Frente de Caixa (Ponto de Venda) e Histórico de Operações</p>
        </div>
      </div>

      {/* PDV Module */}
      <div className="h-[600px] w-full">
         <PDVComponent clients={clients} products={products} />
      </div>

      {/* Históricos Grid */}
      <div className="flex flex-col gap-8 mt-10">
        <SalesHistoryClient salesHistory={salesHistory} />
      </div>

    </div>
  )
}
