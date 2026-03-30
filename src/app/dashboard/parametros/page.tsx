import { 
  getCoffeeTypes, 
  createCoffeeType, 
  deleteCoffeeType, 
  getQualityLevels, 
  createQualityLevel, 
  deleteQualityLevel,
  getProviders,
  createProvider,
  deleteProvider,
  getOrigins,
  createOrigin,
  deleteOrigin
} from './actions'

export default async function ParametrosPage() {
  const coffeeTypes = await getCoffeeTypes()
  const qualityLevels = await getQualityLevels()
  const providers = await getProviders()
  const origins = await getOrigins()

  // Reusable icon for accordions
  const ChevronIcon = () => (
    <span className="transition duration-300 group-open:rotate-180 text-[--primary]">
      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
        <path d="M6 9l6 6 6-6"></path>
      </svg>
    </span>
  )

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Parâmetros</h1>
          <p className="text-[--secondary-text] mt-1">Configurações globais do sistema</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Fornecedores */}
        <details className="glass-panel group overflow-hidden [&_summary::-webkit-details-marker]:hidden">
          <summary className="card-texture-header cursor-pointer list-none font-serif text-xl text-[--primary] p-6 flex justify-between items-center bg-black/10 hover:bg-black/20 transition-colors">
            Fornecedores
            <ChevronIcon />
          </summary>
          <div className="p-6 border-t border-[--card-border]">
            <form action={createProvider} className="flex gap-2 mb-6">
              <input 
                name="name" 
                type="text" 
                placeholder="Ex: Fazenda Santa Clara" 
                className="flex-1 bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]"
                required 
              />
              <button type="submit" className="primary-btn h-full py-2">Adicionar</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {providers && providers.length > 0 ? (
                providers.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                    <span className="text-sm truncate w-full pr-2" title={item.name}>{item.name}</span>
                    <form action={deleteProvider}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="danger-btn text-xs py-2 px-4 whitespace-nowrap h-fit">Remover</button>
                    </form>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[--secondary-text] italic col-span-full">Nenhum fornecedor cadastrado. Adicione um para começar.</p>
              )}
            </div>
          </div>
        </details>

        {/* Origens */}
        <details className="glass-panel group overflow-hidden [&_summary::-webkit-details-marker]:hidden">
          <summary className="card-texture-header cursor-pointer list-none font-serif text-xl text-[--primary] p-6 flex justify-between items-center bg-black/10 hover:bg-black/20 transition-colors">
            Origens
            <ChevronIcon />
          </summary>
          <div className="p-6 border-t border-[--card-border]">
            <form action={createOrigin} className="flex gap-2 mb-6">
              <input 
                name="name" 
                type="text" 
                placeholder="Ex: Sul de Minas, Cerrado Mineiro" 
                className="flex-1 bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]"
                required 
              />
              <button type="submit" className="primary-btn h-full py-2">Adicionar</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {origins && origins.length > 0 ? (
                origins.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                    <span className="text-sm truncate w-full pr-2" title={item.name}>{item.name}</span>
                    <form action={deleteOrigin}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="danger-btn text-xs py-2 px-4 whitespace-nowrap h-fit">Remover</button>
                    </form>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[--secondary-text] italic col-span-full">Nenhuma origem cadastrada. Adicione uma para começar.</p>
              )}
            </div>
          </div>
        </details>

        {/* Tipos de Café */}
        <details className="glass-panel group overflow-hidden [&_summary::-webkit-details-marker]:hidden">
          <summary className="card-texture-header cursor-pointer list-none font-serif text-xl text-[--primary] p-6 flex justify-between items-center bg-black/10 hover:bg-black/20 transition-colors">
            Tipos de Café
            <ChevronIcon />
          </summary>
          <div className="p-6 border-t border-[--card-border]">
            <form action={createCoffeeType} className="flex gap-2 mb-6">
              <input 
                name="name" 
                type="text" 
                placeholder="Ex: Arábica, Conilon" 
                className="flex-1 bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]"
                required 
              />
              <button type="submit" className="primary-btn h-full py-2">Adicionar</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {coffeeTypes && coffeeTypes.length > 0 ? (
                coffeeTypes.map((ct: any) => (
                  <div key={ct.id} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                    <span className="text-sm truncate w-full pr-2" title={ct.name}>{ct.name}</span>
                    <form action={deleteCoffeeType}>
                      <input type="hidden" name="id" value={ct.id} />
                      <button type="submit" className="danger-btn text-xs py-2 px-4 whitespace-nowrap h-fit">Remover</button>
                    </form>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[--secondary-text] italic col-span-full">Nenhum tipo cadastrado. Adicione um para começar.</p>
              )}
            </div>
          </div>
        </details>

        {/* Níveis de Qualidade */}
        <details className="glass-panel group overflow-hidden [&_summary::-webkit-details-marker]:hidden">
          <summary className="card-texture-header cursor-pointer list-none font-serif text-xl text-[--primary] p-6 flex justify-between items-center bg-black/10 hover:bg-black/20 transition-colors">
            Níveis de Qualidade
            <ChevronIcon />
          </summary>
          <div className="p-6 border-t border-[--card-border]">
            <form action={createQualityLevel} className="flex gap-2 mb-6">
              <input 
                name="name" 
                type="text" 
                placeholder="Ex: Especial, Comercial" 
                className="flex-1 bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]"
                required 
              />
              <button type="submit" className="primary-btn h-full py-2">Adicionar</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {qualityLevels && qualityLevels.length > 0 ? (
                qualityLevels.map((ql: any) => (
                  <div key={ql.id} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                    <span className="text-sm truncate w-full pr-2" title={ql.name}>{ql.name}</span>
                    <form action={deleteQualityLevel}>
                      <input type="hidden" name="id" value={ql.id} />
                      <button type="submit" className="text-[--danger] text-xs hover:underline whitespace-nowrap">Remover</button>
                    </form>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[--secondary-text] italic col-span-full">Nenhuma qualidade cadastrada. Adicione uma para começar.</p>
              )}
            </div>
          </div>
        </details>

      </div>
    </div>
  )
}
