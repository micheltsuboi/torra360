import TorraHeader from './TorraHeader'
import RoastList from './RoastList'

export const dynamic = 'force-dynamic'

export default async function TorraPage() {
  // Testando com arrays vazios para descartar erro de banco de dados
  const greenLots: any[] = []
  const roastBatches: any[] = []

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-serif text-[--foreground]">Produção de Torra (Debug)</h1>
          <p className="text-[--secondary-text] mt-1 italic opacity-60">Se você vir isso, os componentes estão OK, o problema é nas Actions.</p>
        </div>
      </div>

      <TorraHeader greenLots={greenLots} />
      <RoastList roastBatches={roastBatches} />
    </div>
  )
}
