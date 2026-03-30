import { 
  getCoffeeTypes, 
  createCoffeeType, 
  deleteCoffeeType, 
  getQualityLevels, 
  createQualityLevel, 
  deleteQualityLevel 
} from './actions'

export default async function ParametrosPage() {
  const coffeeTypes = await getCoffeeTypes()
  const qualityLevels = await getQualityLevels()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Parâmetros</h1>
          <p className="text-[--secondary-text] mt-1">Configurações de tipos de café e qualidade</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tipos de Café */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-serif text-[--primary] mb-6">Tipos de Café</h2>
          <form action={createCoffeeType} className="flex gap-2 mb-6">
            <input 
              name="name" 
              type="text" 
              placeholder="Ex: Arábica" 
              className="flex-1 bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]"
              required 
            />
            <button type="submit" className="primary-btn h-full py-2">Adicionar</button>
          </form>

          <div className="flex flex-col gap-2">
            {coffeeTypes && coffeeTypes.length > 0 ? (
              coffeeTypes.map((ct: any) => (
                <div key={ct.id} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                  <span className="text-sm">{ct.name}</span>
                  <form action={deleteCoffeeType}>
                    <input type="hidden" name="id" value={ct.id} />
                    <button type="submit" className="text-[--danger] text-xs hover:underline">Remover</button>
                  </form>
                </div>
              ))
            ) : (
              <p className="text-sm text-[--secondary-text] italic">Nenhum tipo cadastrado. Adicione um para começar.</p>
            )}
          </div>
        </div>

        {/* Níveis de Qualidade */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-serif text-[--primary] mb-6">Níveis de Qualidade</h2>
          <form action={createQualityLevel} className="flex gap-2 mb-6">
            <input 
              name="name" 
              type="text" 
              placeholder="Ex: Especial" 
              className="flex-1 bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]"
              required 
            />
            <button type="submit" className="primary-btn h-full py-2">Adicionar</button>
          </form>

          <div className="flex flex-col gap-2">
            {qualityLevels && qualityLevels.length > 0 ? (
              qualityLevels.map((ql: any) => (
                <div key={ql.id} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                  <span className="text-sm">{ql.name}</span>
                  <form action={deleteQualityLevel}>
                    <input type="hidden" name="id" value={ql.id} />
                    <button type="submit" className="text-[--danger] text-xs hover:underline">Remover</button>
                  </form>
                </div>
              ))
            ) : (
              <p className="text-sm text-[--secondary-text] italic">Nenhuma qualidade cadastrada. Adicione uma para começar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
