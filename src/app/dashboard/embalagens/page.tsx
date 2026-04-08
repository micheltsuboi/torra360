import { getPackagingInventory } from './actions'
import PackagingInventoryClient from './PackagingInventoryClient'
import { Box, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EmbalagensPage() {
  const inventory = await getPackagingInventory()

  return (
    <div className="flex flex-col gap-8 text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Gestão de Embalagens</h1>
          <p className="text-[--secondary-text] mt-1 italic opacity-60">Controle de estoque de insumos e integração de despesas.</p>
        </div>
      </div>

      <PackagingInventoryClient inventory={inventory} />
    </div>
  )
}
