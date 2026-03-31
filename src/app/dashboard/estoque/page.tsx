import { getGreenCoffeeLots } from './actions'
import { getCoffeeTypes, getQualityLevels, getProviders, getOrigins } from '../parametros/actions'
import EstoqueHeader from './EstoqueHeader'
import InventoryList from './InventoryList'

export const dynamic = 'force-dynamic'

export default async function EstoquePage() {
  const lots = await getGreenCoffeeLots()
  const coffeeTypes = await getCoffeeTypes()
  const qualityLevels = await getQualityLevels()
  const providers = await getProviders()
  const origins = await getOrigins()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Café Verde</h1>
          <p className="text-[--secondary-text] mt-1">Gerenciamento de estoque inicial de grãos</p>
        </div>
      </div>

      <EstoqueHeader 
        lots={lots}
        providers={providers}
        origins={origins}
        coffeeTypes={coffeeTypes}
        qualityLevels={qualityLevels}
      />

      <InventoryList lots={lots} />
    </div>
  )
}
