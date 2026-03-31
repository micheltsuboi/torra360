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
      <div className="flex flex-col gap-2 mt-4">
        <div className="glass-panel overflow-hidden">
           <div className="p-2 border-b border-[--card-border] wood-texture bg-black/40">
            <h2 className="font-serif text-xl">Estoque de Café Verde</h2>
           </div>
                    <div className="responsive-table-container">
             <table className="w-full border-collapse min-w-[1000px]">
               <thead>
                 <tr className="text-[--secondary-text] text-[10px] capitalize tracking-widest border-b border-[--card-border] bg-white/5">
                   <th className="p-2 font-bold">Lote e Procedência</th>
                   <th className="p-2 font-bold border-l border-white/5">Tipo / Qualidade</th>
                   <th className="p-2 font-bold border-l border-white/5">Verde (Total)</th>
                   <th className="p-2 font-bold">Torrado (Total)</th>
                   <th className="p-2 font-bold border-l border-white/5">Custo Verde</th>
                   <th className="p-2 font-bold border-l border-white/10 bg-[--primary]/5">Saldo Disponível</th>
                   <th className="p-2 font-bold border-l border-white/5">Custo Torrado</th>
                   <th className="p-2 font-bold border-l border-white/5">Ações</th>
                 </tr>
               </thead>
               <tbody className="text-sm">
                 {lots && lots.length > 0 ? (
                   lots.map((lot: any) => {
                     const costPerKgGreen = lot.total_qty_kg > 0 ? (lot.total_cost / lot.total_qty_kg) : 0;
                     const estRoastedCost = costPerKgGreen > 0 ? (costPerKgGreen / 0.8) + 4.00 : 0;

                     return (
                       <tr key={lot.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors group">
                         <td className="p-2">
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-semibold text-[--primary]">{lot.name}</span>
                              <span className="text-[10px] text-[--secondary-text] opacity-60">{lot.origin || 'N/A'} • {lot.provider || 'N/A'}</span>
                            </div>
                         </td>
                         <td className="p-2 border-l border-white/5">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-medium text-[--foreground]">{lot.coffee_type || '-'}</span>
                              <span className="text-[10px] text-[--secondary-text] opacity-50">{lot.quality_level || '-'}</span>
                            </div>
                         </td>
                         <td className="p-2 border-l border-white/5">
                            <div className="flex flex-col items-center">
                               <span className="font-medium">{lot.total_qty_kg} kg</span>
                               <span className="text-[9px] text-[--secondary-text] opacity-40">comprados</span>
                            </div>
                         </td>
                         <td className="p-2 border-l border-white/5">
                            <div className="flex flex-col items-center">
                               <span className="font-medium">{lot.total_roasted_qty.toFixed(2)} kg</span>
                               <span className="text-[9px] text-[--secondary-text] opacity-40">torrados</span>
                            </div>
                         </td>
                         <td className="p-2 border-l border-white/5">
                            <div className="flex flex-col items-center">
                              <span className="font-semibold text-xs">R$ {lot.total_cost.toFixed(2)}</span>
                              <span className="text-[9px] opacity-40">R$ {costPerKgGreen.toFixed(2)}/kg</span>
                            </div>
                         </td>
                         <td className="p-2 border-l border-white/10 bg-[--primary]/5">
                            <div className={`flex flex-col ${lot.available_qty_kg < 10 ? 'text-[--danger]' : 'text-[--success]'}`}>
                               <span className="text-lg font-bold">{lot.available_qty_kg.toFixed(2)} kg</span>
                               <span className="text-[9px] opacity-60 font-bold">em estoque</span>
                            </div>
                         </td>
                         <td className="p-2 border-l border-white/5">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-[--primary] text-sm">R$ {estRoastedCost.toFixed(2)}</span>
                              <span className="text-[9px] opacity-40">Est. / kg</span>
                            </div>
                         </td>
                         <td className="p-2 border-l border-white/5">
                            <div className="flex justify-center items-center">
                              <form action={deleteGreenCoffeeLot}>
                                 <input type="hidden" name="id" value={lot.id} />
                                 <button type="submit" className="action-icon-btn text-[--danger]">
                                   <Trash2 className="action-icon" />
                                 </button>
                              </form>
                            </div>
                         </td>
                       </tr>
                     );
                   })
                 ) : (
                   <tr>
                     <td colSpan={8} className="p-20 text-center text-[--secondary-text] italic opacity-40">
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
