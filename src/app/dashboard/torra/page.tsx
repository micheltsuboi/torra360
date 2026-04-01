import { getAvailableGreenLots, getRoastBatches } from './actions'
import TorraHeader from './TorraHeader'
import RoastList from './RoastList'

export const dynamic = 'force-dynamic'

export default async function TorraPage() {
  const greenLots = await getAvailableGreenLots()
  const roastBatches: any[] = [] // Mantém desativado por enquanto

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-serif text-[--foreground]">Produção de Torra (Debug 2)</h1>
          <p className="text-[--secondary-text] mt-1 italic opacity-60">Testando carregamento do Header...</p>
        </div>
      </div>

      <TorraHeader greenLots={greenLots} />
      <RoastList roastBatches={roastBatches} />
    </div>
  )
}
