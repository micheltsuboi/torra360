import SalesHistoryClient from './SalesHistoryClient'
import { getPDVData, getSalesHistory } from './actions'
import PDVComponent from './PDVComponent'
import { Suspense } from 'react'
import { GlobalSkeleton } from '@/components/ui/Skeletons'

// 1. Data Fetcher assíncrono (Processa a frio no Postgres, transmitido separadamente à Vercel)
async function ComercialDataFetcher() {
  const { clients, products } = await getPDVData()
  const salesHistory = await getSalesHistory()

  return (
    <>
      {/* PDV Module */}
      <div className="h-[600px] w-full">
         <PDVComponent clients={clients} products={products} />
      </div>

      {/* Históricos Grid */}
      <div className="flex flex-col gap-8 mt-10">
        <SalesHistoryClient salesHistory={salesHistory} />
      </div>
    </>
  )
}

// 2. Componente de Página (Entrega Imediata e Skeleton Non-Blocking)
export default function ComercialPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Fixo (Carrega instantaneamente) */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">PDV & Comercial</h1>
          <p className="text-[--secondary-text] mt-1 text-sm opacity-60">Frente de Caixa (Ponto de Venda) e Histórico de Operações</p>
        </div>
      </div>

      {/* Area Sujeita a Latência do Banco protegida com Skeleton Suspense Boundary */}
      <Suspense fallback={<GlobalSkeleton />}>
        <ComercialDataFetcher />
      </Suspense>
    </div>
  )
}

