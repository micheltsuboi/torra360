import { getGreenCoffeeLots, createGreenCoffeeLot, deleteGreenCoffeeLot } from './actions'
import { Pencil, Trash2 } from 'lucide-react'
import { getCoffeeTypes, getQualityLevels, getProviders, getOrigins } from '../parametros/actions'

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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Formulário de Cadastro */}
        <div className="glass-panel p-6 h-fit">
          <h2 className="text-xl font-serif mb-6 text-[--primary]">Entrada de Lote</h2>
          <form action={createGreenCoffeeLot} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[--secondary-text] uppercase">Nome do Lote</label>
              <input name="name" type="text" placeholder="Ex: Lote Especial Sul de Minas" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase">Qtd Total (kg)</label>
                <input name="total_qty_kg" type="number" step="0.01" placeholder="20" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase">Custo Total (R$)</label>
                <input name="total_cost" type="number" step="0.01" placeholder="1500.00" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[--secondary-text] uppercase">Fornecedor</label>
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
                <label className="text-xs text-[--secondary-text] uppercase">Origem</label>
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
                <label className="text-xs text-[--secondary-text] uppercase">Tipo Café</label>
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
                <label className="text-xs text-[--secondary-text] uppercase">Qualidade</label>
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
                    <label className="uppercase text-[--secondary-text]">Pontuação</label>
                    <input name="score" type="text" placeholder="84+" />
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="uppercase text-[--secondary-text]">Peneira</label>
                    <input name="sieve" type="text" placeholder="15/16" />
                 </div>
            </div>

            <button type="submit" className="primary-btn mt-4">Cadastrar Lote</button>
          </form>
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
                    <th className="p-4 font-medium text-right">Qtd (kg)</th>
                    <th className="p-4 font-medium text-right">Disponível</th>
                    <th className="p-4 font-medium text-right">Custo/kg</th>
                    <th className="p-4 font-medium">Origem</th>
                    <th className="p-4 font-medium">Tipo</th>
                    <th className="p-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {lots && lots.length > 0 ? (
                    lots.map((lot: any) => {
                      const costPerKg = lot.total_qty_kg > 0 ? (lot.total_cost / lot.total_qty_kg).toFixed(2) : '0.00';
                      return (
                        <tr key={lot.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors">
                          <td className="p-4 font-medium text-[--primary]">{lot.name}</td>
                          <td className="p-4 text-right">{lot.total_qty_kg} kg</td>
                          <td className="p-4 text-right">
                             <span className={lot.available_qty_kg < 5 ? 'text-[--danger] font-bold' : ''}>
                                {lot.available_qty_kg} kg
                             </span>
                          </td>
                          <td className="p-4 text-right">R$ {costPerKg}</td>
                          <td className="p-4 text-[--secondary-text] text-xs">{lot.origin}</td>
                          <td className="p-4 text-[--secondary-text] text-xs">{lot.coffee_type} / {lot.quality_level}</td>
                          <td className="p-4 text-right flex items-center justify-end gap-1 mt-1">
                            <span className="p-1 px-1.5 rounded-md hover:bg-white/5 text-[--primary] opacity-80 cursor-pointer bg-transparent border-0" title="Edição em breve">
                              <Pencil className="w-3 h-3" />
                            </span>
                            <form action={deleteGreenCoffeeLot}>
                               <input type="hidden" name="id" value={lot.id} />
                               <button type="submit" className="p-1 px-1.5 rounded-md hover:bg-white/5 text-[--danger] opacity-80 bg-transparent border-0 cursor-pointer">
                                 <Trash2 className="w-3 h-3" />
                               </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-[--secondary-text] italic">
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
