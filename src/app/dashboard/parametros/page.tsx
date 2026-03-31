import { 
  getCoffeeTypes, 
  getQualityLevels, 
  getProviders,
  getOrigins,
} from './actions'
import ParametrosClient from './ParametrosClient'

export default async function ParametrosPage() {
  const coffeeTypes = await getCoffeeTypes()
  const qualityLevels = await getQualityLevels()
  const providers = await getProviders()
  const origins = await getOrigins()

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-serif text-[--foreground]">Configurações / Parâmetros</h1>
          <p className="text-[--secondary-text] mt-1 italic opacity-60">Personalize os dados mestres do seu torrefadora para agilizar novos cadastros.</p>
        </div>
      </div>

      <ParametrosClient 
        providers={providers}
        origins={origins}
        coffeeTypes={coffeeTypes}
        qualityLevels={qualityLevels}
      />
    </div>
  )
}
