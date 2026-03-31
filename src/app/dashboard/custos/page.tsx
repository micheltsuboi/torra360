import { getExpensePackages, createExpensePackage, deleteExpensePackage, addExpenseItem, removeExpenseItem, updateExpensePackage, updateExpenseItem } from './actions'
import { Plus, Trash2, Package, Pencil, Check } from 'lucide-react'
import CustosHeader from './CustosHeader'

export default async function CustosPage() {
  const packages = await getExpensePackages()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Custos Operacionais</h1>
          <p className="text-[--secondary-text] mt-1 italic opacity-60">Gerencie insumos e despesas extras para precificação inteligente.</p>
        </div>
      </div>

      <CustosHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        
        {/* Listagem de Pacotes */}
        {packages.map((pkg: any) => (
          <div key={pkg.id} className="glass-panel overflow-hidden flex flex-col border-t-4 border-[--primary] shadow-xl hover:shadow-2xl transition-all duration-300">
             <div className="p-2 border-b border-[--card-border] flex justify-between items-start card-texture-header bg-black/40">
                <div className="flex-1">
                   <form action={updateExpensePackage} className="flex items-center gap-2 group/title">
                      <input type="hidden" name="id" value={pkg.id} />
                      <div className="relative flex items-center group/input flex-1 max-w-[200px]">
                        <input 
                          name="name" 
                          defaultValue={pkg.name} 
                          className="font-serif text-xl text-[--primary] bg-transparent border-0 p-1 w-full focus:ring-2 ring-[--primary]/20 rounded-lg transition-all focus:bg-black/40"
                        />
                        <Pencil className="w-4 h-4 absolute right-2 opacity-40 text-[--primary] pointer-events-none group-focus-within/input:hidden" />
                      </div>
                      <button type="submit" className="action-icon-btn text-[--success] !opacity-0 group-focus-within/title:!opacity-100">
                         <Check className="action-icon" />
                      </button>
                   </form>
                   <span className="text-[10px] text-[--secondary-text] capitalize tracking-widest font-bold opacity-40">Pacote de Insumos</span>
                </div>
                <form action={deleteExpensePackage} className="flex items-center">
                   <input type="hidden" name="id" value={pkg.id} />
                   <button type="submit" className="action-icon-btn text-[--danger]">
                      <Trash2 className="action-icon" />
                   </button>
                </form>
             </div>

             <div className="p-6 flex-1 flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                   {pkg.expense_package_items?.map((item: any) => (
                     <div key={item.id} className="flex justify-between items-center text-sm group/item border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg py-2">
                        <form action={updateExpenseItem} className="flex-1 flex justify-between items-center gap-2">
                           <input type="hidden" name="id" value={item.id} />
                           <input type="hidden" name="package_id" value={pkg.id} />
                           
                           <input 
                             name="name" 
                             defaultValue={item.name} 
                             className="text-[--foreground] bg-transparent border-0 p-1 focus:ring-2 ring-[--primary]/20 rounded-lg w-full text-sm font-medium focus:bg-black/60 transition-all"
                           />
                           
                           <div className="flex items-center gap-2">
                              <div className="relative flex items-center">
                                <span className="text-[11px] text-[--secondary-text] mr-1 font-bold opacity-40">R$</span>
                                <input 
                                  name="cost" 
                                  type="number" 
                                  step="0.01" 
                                  defaultValue={item.cost} 
                                  className="font-mono text-base text-[--foreground] bg-transparent border-0 p-1 w-20   focus:ring-2 ring-[--primary]/20 rounded-lg focus:bg-black/60 transition-all font-bold"
                                />
                              </div>

                              <button type="submit" title="Salvar Alteração" className="action-icon-btn text-[--success] !opacity-0 group-hover/item:!opacity-100 group-focus-within/item:!opacity-100">
                                <Check className="action-icon" />
                              </button>
                           </div>
                        </form>

                        <form action={removeExpenseItem} className="flex items-center ml-1">
                           <input type="hidden" name="id" value={item.id} />
                           <input type="hidden" name="package_id" value={pkg.id} />
                           <button type="submit" className="action-icon-btn text-[--danger] !opacity-0 group-hover/item:!opacity-100">
                             <Trash2 className="action-icon" />
                           </button>
                        </form>
                     </div>
                   ))}
                   {(!pkg.expense_package_items || pkg.expense_package_items.length === 0) && (
                     <div className="text-center py-8 text-sm text-[--secondary-text] italic opacity-40 flex flex-col items-center">
                        <Plus className="w-8 h-8 mb-2 opacity-20" />
                        Nenhum item adicionado
                     </div>
                   )}
                </div>

                {/* Form para novo item */}
                <form action={addExpenseItem} className="mt-4 pt-6 border-t border-[--card-border]/50 flex gap-2">
                   <input type="hidden" name="package_id" value={pkg.id} />
                   <input 
                     name="name" 
                     type="text" 
                     placeholder="Item..." 
                     required 
                     className="bg-black/60 text-sm p-2 flex-1 rounded-xl border border-white/5 focus:border-[--primary]/50 transition-all"
                   />
                   <div className="relative flex items-center w-28">
                     <span className="absolute left-3 text-[10px] text-[--secondary-text] font-bold opacity-40">R$</span>
                     <input 
                       name="cost" 
                       type="number" 
                       step="0.01" 
                       placeholder="0,00" 
                       required 
                       className="bg-black/60 text-sm p-2 pl-8 w-full rounded-xl border border-white/5 focus:border-[--primary]/50 transition-all   font-mono font-bold"
                     />
                   </div>
                   <button type="submit" className="golden-btn !p-0 !w-12 !h-12 flex items-center justify-center rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                      <Plus className="w-6 h-6" />
                   </button>
                </form>
             </div>

             <div className="p-6 bg-black/60 border-t border-[--card-border] flex justify-between items-center group/total">
                <div className="flex flex-col">
                  <span className="text-[10px] capitalize text-[--secondary-text] font-bold tracking-widest opacity-40">Total Gerado</span>
                  <span className="text-xs text-[--secondary-text] opacity-20 group-hover/total:opacity-100 transition-opacity">Consolidado do pacote</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-serif font-bold text-[--success] drop-shadow-[0_0_10px_rgba(34,197,94,0.1)]">R$ {pkg.total_cost.toFixed(2)}</span>
                  <span className="text-[9px] capitalize font-bold text-[--secondary-text] opacity-20">Unitário estimado</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
