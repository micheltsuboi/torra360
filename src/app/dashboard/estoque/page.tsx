import { getGreenCoffeeLots, createGreenCoffeeLot, deleteGreenCoffeeLot } from './actions'
import { Pencil, Trash2, Box, Beaker } from 'lucide-react'
import { getCoffeeTypes, getQualityLevels, getProviders, getOrigins } from '../parametros/actions'
import BlendForm from './BlendForm'

export const dynamic = 'force-dynamic'

export default async function EstoquePage() {
  const lots = await getGreenCoffeeLots()
  const coffeeTypes = await getCoffeeTypes()
  const qualityLevels = await getQualityLevels()
  const providers = await getProviders()
  const origins = await getOrigins()

  // Reusable icon for accordions
  const ChevronIcon = () => (
    <span className="transition duration-300 group-open:rotate-180 text-[--primary]">
      <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
        <path d="M6 9l6 6 6-6"></path>
      </svg>
    </span>
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Café Verde</h1>
          <p className="text-[--secondary-text] mt-1">Gerenciamento de estoque inicial de grãos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Formulários de Cadastro e Blend */}
        <div className="flex flex-col gap-4">
          
          {/* Accordion: Entrada de Lote */}
          <details className="glass-panel group overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="card-texture-header cursor-pointer list-none font-serif text-base text-[--primary] p-4 flex justify-between items-center transition-colors">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5" />
                <span>Entrada de Lote</span>
              </div>
              <ChevronIcon />
            </summary>
            <div className="p-6 border-t border-[--card-border]">
              <form action={createGreenCoffeeLot} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[--secondary-text] uppercase font-bold">Nome do Lote</label>
                  <input name="name" type="text" placeholder="Ex: Lote Especial Sul de Minas" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[--secondary-text] uppercase font-bold">Qtd Total (kg)</label>
                    <input name="total_qty_kg" type="number" step="0.01" placeholder="20" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[--secondary-text] uppercase font-bold">Custo Total (R$)</label>
                    <input name="total_cost" type="number" step="0.01" placeholder="1500.00" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[--secondary-text] uppercase font-bold">Fornecedor</label>
                    <select name="provider" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                      <option value="">Selecione...</option>
                      {providers && providers.length > 0 ? (
                        providers.map((p: any) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))
                      ) : (
                         <option value="" disabled>(Cadastre em Parâmetros)</option>
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[--secondary-text] uppercase font-bold">Origem</label>
                    <select name="origin" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                      <option value="">Selecione...</option>
                      {origins && origins.length > 0 ? (
                        origins.map((o: any) => (
                          <option key={o.id} value={o.name}>{o.name}</option>
                        ))
                      ) : (
                         <option value="" disabled>(Cadastre em Parâmetros)</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[--secondary-text] uppercase font-bold">Tipo Café</label>
                    <select name="coffee_type" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]">
                      {coffeeTypes.length > 0 ? (
                        coffeeTypes.map((ct: any) => (
                          <option key={ct.id} value={ct.name}>{ct.name}</option>
                        ))
                      ) : (
                        <option value="">(Cadastre em Parâmetros)</option>
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[--secondary-text] uppercase font-bold">Qualidade</label>
                    <select name="quality_level" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]">
                      {qualityLevels.length > 0 ? (
                        qualityLevels.map((ql: any) => (
                          <option key={ql.id} value={ql.name}>{ql.name}</option>
                        ))
                      ) : (
                        <option value="">(Cadastre em Parâmetros)</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                     <div className="flex flex-col gap-1">
                        <label className="uppercase text-[--secondary-text] font-bold">Pontuação</label>
                        <input name="score" type="text" placeholder="84+" />
                     </div>
                     <div className="flex flex-col gap-1">
                        <label className="uppercase text-[--secondary-text] font-bold">Peneira</label>
                        <input name="sieve" type="text" placeholder="15/16" />
                     </div>
                </div>

                <button type="submit" className="primary-btn mt-4">Cadastrar Lote</button>
              </form>
            </div>
          </details>

          {/* Accordion: Montar Blend */}
          <details className="glass-panel group overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="card-texture-header cursor-pointer list-none font-serif text-base text-[--primary] p-4 flex justify-between items-center transition-colors">
              <div className="flex items-center gap-2">
                <Beaker className="w-5 h-5" />
                <span>Montar Blend</span>
              </div>
              <ChevronIcon />
            </summary>
            <div className="p-0 border-t border-[--card-border]">
              <BlendForm lots={lots} />
            </div>
          </details>

        </div>

        {/* Listagem de Lotes */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="glass-panel overflow-hidden">
             <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40">
              <h2 className="font-serif">Estoque de Café Verde</h2>
             </div>
             <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[--secondary-text] text-xs uppercase border-b border-[--card-border]">
                    <th className="p-4 font-medium">Lote</th>
                    <th className="p-4 font-medium text-right">Verde (kg)</th>
                    <th className="p-4 font-medium text-right">Disponível</th>
                    <th className="p-4 font-medium text-right">Custo Verde/kg</th>
                    <th className="p-4 font-medium text-right text-[--primary]">Torrado (kg)</th>
                    <th className="p-4 font-medium text-right text-[--primary]">Custo Torrado/kg</th>
                    <th className="p-4 font-medium">Tipo / Qualidade</th>
                    <th className="p-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {lots && lots.length > 0 ? (
                    lots.map((lot: any) => {
                      const costPerKg = lot.total_qty_kg > 0 ? (lot.total_cost / lot.total_qty_kg) : 0;
                      
                      // Cálculo Estimado de Custo Torrado:
                      // Formula: (Custo Verde / 0.8) + 4.00 (op)
                      // O 0.8 representa a quebra de 20% de umidade.
                      const estRoastedCost = costPerKg > 0 ? (costPerKg / 0.8) + 4.00 : 0;

                      return (
                        <tr key={lot.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors">
                          <td className="p-4 font-medium">
                             <div className="flex flex-col">
                               <span className="text-[--primary] font-serif transition-all hover:tracking-wider cursor-default">{lot.name}</span>
                               <span className="text-[10px] text-[--secondary-text] uppercase">{lot.origin}</span>
                             </div>
                          </td>
                          <td className="p-4 text-right">{lot.total_qty_kg} kg</td>
                          <td className="p-4 text-right">
                             <span className={lot.available_qty_kg < 5 ? 'text-[--danger] font-bold ring-1 ring-[--danger]/20 px-1 rounded' : ''}>
                                {lot.available_qty_kg} kg
                             </span>
                          </td>
                          <td className="p-4 text-right opacity-80">R$ {costPerKg.toFixed(2)}</td>
                          <td className="p-4 text-right font-bold text-[--primary]/80">{lot.total_roasted_qty.toFixed(2)} kg</td>
                          <td className="p-4 text-right">
                             <div className="flex flex-col items-end">
                               <span className="font-bold text-[--primary]">R$ {estRoastedCost.toFixed(2)}</span>
                               <span className="text-[9px] uppercase opacity-40">Est. (20% quebra)</span>
                             </div>
                          </td>
                          <td className="p-4 text-[--secondary-text] text-xs">
                             {lot.coffee_type}<br/>
                             <span className="opacity-60">{lot.quality_level}</span>
                          </td>
                          <td className="p-4 text-right flex items-center justify-end gap-2">
                             <form action={deleteGreenCoffeeLot}>
                                <input type="hidden" name="id" value={lot.id} />
                                <button type="submit" className="action-icon-btn text-[--danger] hover:bg-[--danger]/10 p-2 rounded-full transition-all">
                                  <Trash2 className="action-icon w-5 h-5" />
                                </button>
                             </form>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-10 text-center text-[--secondary-text] italic">
                        Nenhum lote cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
