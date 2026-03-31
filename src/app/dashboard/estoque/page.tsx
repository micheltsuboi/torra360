import { getGreenCoffeeLots, createGreenCoffeeLot, deleteGreenCoffeeLot } from './actions'
import { Pencil, Trash2, Box, Beaker } from 'lucide-react'
import { getCoffeeTypes, getQualityLevels, getProviders, getOrigins } from '../parametros/actions'
import EstoqueHeader from './EstoqueHeader'

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

      {/* Listagem de Lotes */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="glass-panel overflow-hidden">
           <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40">
            <h2 className="font-serif text-xl">Estoque de Café Verde</h2>
           </div>
           
           <div className="responsive-table-container">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="text-[--secondary-text] text-[10px] capitalize tracking-widest border-b border-[--card-border] bg-white/5">
                  <th className="p-4 font-bold">Lote e Procedência</th>
                  <th className="p-4 font-bold text-center border-l border-white/5">Tipo / Qualidade</th>
                  <th className="p-4 font-bold text-right border-l border-white/5">Verde (Total)</th>
                  <th className="p-4 font-bold text-right">Torrado (Total)</th>
                  <th className="p-4 font-bold text-center border-l border-white/5">Custo Verde</th>
                  <th className="p-4 font-bold text-right border-l border-white/10 bg-[--primary]/5">Saldo Disponível</th>
                  <th className="p-4 font-bold text-right border-l border-white/5">Custo Torrado/kg</th>
                  <th className="p-4 font-bold text-right border-l border-white/5 capitalize">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {lots && lots.length > 0 ? (
                  lots.map((lot: any) => {
                    const costPerKgGreen = lot.total_qty_kg > 0 ? (lot.total_cost / lot.total_qty_kg) : 0;
                    const estRoastedCost = costPerKgGreen > 0 ? (costPerKgGreen / 0.8) + 4.00 : 0;

                    return (
                      <tr key={lot.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors group">
                        <td className="p-4">
                           <div className="flex flex-col">
                             <span className="text-lg font-serif text-[--primary] group-hover:text-[--foreground] transition-colors">{lot.name}</span>
                             <span className="text-[10px] text-[--secondary-text] capitalize font-bold tracking-widest">{lot.origin || 'Origem N/A'} • {lot.provider || 'Fornecedor N/A'}</span>
                           </div>
                        </td>
                        <td className="p-4 text-center border-l border-white/5">
                           <div className="flex flex-col items-center">
                             <span className="text-xs font-bold text-[--foreground]">{lot.coffee_type || '-'}</span>
                             <span className="text-[10px] text-[--secondary-text] capitalize">{lot.quality_level || '-'}</span>
                           </div>
                        </td>
                        <td className="p-4 text-right border-l border-white/5">
                           <div className="flex flex-col items-end">
                              <span className="data-value">{lot.total_qty_kg}</span>
                              <span className="text-[9px] text-[--secondary-text] capitalize font-bold opacity-30">kg comprados</span>
                           </div>
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex flex-col items-end">
                              <span className="data-value text-[--primary]/80">{lot.total_roasted_qty.toFixed(2)}</span>
                              <span className="text-[9px] text-[--secondary-text] capitalize font-bold opacity-30">kg torrados</span>
                           </div>
                        </td>
                        <td className="p-4 text-center border-l border-white/5">
                           <div className="flex flex-col items-center">
                             <span className="font-bold text-sm text-[--foreground]">R$ {lot.total_cost.toFixed(2)}</span>
                             <span className="text-[9px] capitalize opacity-30 font-bold">R$ {costPerKgGreen.toFixed(2)}/kg</span>
                           </div>
                        </td>
                        <td className="p-4 text-right border-l border-white/10 bg-[--primary]/5">
                           <div className={`flex flex-col items-end ${lot.available_qty_kg < 10 ? 'text-[--danger]' : 'text-[--success]'}`}>
                              <span className="text-xl font-bold font-serif leading-none">{lot.available_qty_kg.toFixed(2)}</span>
                              <span className="text-[9px] capitalize font-bold tracking-widest">kg em estoque</span>
                           </div>
                        </td>
                        <td className="p-4 text-right border-l border-white/5">
                           <div className="flex flex-col items-end">
                             <span className="font-bold text-[--primary] text-base">R$ {estRoastedCost.toFixed(2)}</span>
                             <span className="text-[9px] capitalize opacity-40 font-bold">Custo Est. / kg</span>
                           </div>
                        </td>
                        <td className="p-4 text-right border-l border-white/5">
                           <div className="flex justify-end items-center gap-2">
                             <form action={deleteGreenCoffeeLot}>
                                <input type="hidden" name="id" value={lot.id} />
                                <button type="submit" className="action-icon-btn text-[--danger]">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                             </form>
                           </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-20 text-center text-[--secondary-text] italic opacity-40 flex flex-col items-center justify-center">
                      <Box className="w-16 h-16 mb-4 opacity-5" />
                      Nenhum lote inicial registrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
           </div>
        </div>
      </div>
    </div>
  )
}
