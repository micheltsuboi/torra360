import { getRoastBatches, getAvailableGreenLots } from './actions'
import TorraHeader from './TorraHeader'
import RoastList from './RoastList'

export const dynamic = 'force-dynamic'

export default async function TorraPage() {
  return (
    <div className="p-10">
      <h1 className="text-4xl">Teste de Rota: Produção / Torra</h1>
      <p>Se você está vendo isso, a rota está funcionando. Agora vamos verificar os dados.</p>
    </div>
  )
}
