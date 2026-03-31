import { getRoastBatchesAvailable, getPackages, createPackages, deletePackage } from './actions'
import { getExpensePackages } from '../custos/actions'
import PackageList from './PackageList'
import PacotesHeader from './PacotesHeader'

export const dynamic = 'force-dynamic'

export default async function PacotesPage() {
  const roasts = await getRoastBatchesAvailable()
  const packages = await getPackages()
  const expensePackages = await getExpensePackages()

  return (
    <div className="flex flex-col gap-8 text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Embalamento de Café</h1>
          <p className="text-[--secondary-text] mt-1 italic opacity-60">Geração de pacotes a partir de lotes torrados e integração de custos.</p>
        </div>
      </div>

      <PacotesHeader roasts={roasts} expensePackages={expensePackages} />

      {/* Histórico / Relatório de Pacotes */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="glass-panel overflow-hidden border-t-4 border-[--primary] shadow-2xl">
           <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40 flex justify-between items-center">
            <h2 className="font-serif text-[--primary] text-xl">Estoque Disponível / Produtos Finais</h2>
           </div>
           
           <PackageList 
              packages={packages} 
              roasts={roasts} 
              expensePackages={expensePackages} 
           />
        </div>
      </div>
    </div>
  )
}
