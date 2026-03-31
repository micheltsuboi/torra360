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
          <div key={pkg.id} className="glass-panel overflow-hidden flex flex-col border-t-2 border-[--primary] shadow-lg hover:shadow-2xl transition-all duration-300">
             <div className="p-4 border-b border-[--card-border] flex justify-between items-start card-texture-header bg-black/20">
                <div className="flex-1">
                   <form action={updateExpensePackage} className="flex items-center gap-2 group/title">
                      <input type="hidden" name="id" value={pkg.id} />
                      <div className="relative flex items-center group/input flex-1 max-w-[200px]">
                        <input 
                          name="name" 
                          defaultValue={pkg.name} 
                          className="font-serif text-lg text-[--primary] bg-transparent border-0 p-1 w-full focus:ring-1 ring-[--primary]/30 rounded transition-all focus:bg-black/20"
                        />
                        <Pencil className="w-3 h-3 absolute right-2 opacity-30 text-[--primary] pointer-events-none group-focus-within/input:hidden" />
                      </div>
                      <button type="submit" className="action-icon-btn text-[--success] !opacity-0 group-focus-within/title:!opacity-100">
                         <Check className="action-icon" />
                      </button>
                   </form>
                   <span className="text-[9px] text-[--secondary-text] uppercase tracking-[0.2em] font-bold opacity-30">Pacote de Insumos</span>
                </div>
                <form action={deleteExpensePackage} className="flex items-center">
                   <input type="hidden" name="id" value={pkg.id} />
                   <button type="submit" className="action-icon-btn text-[--danger] hover:!opacity-100">
                      <Trash2 className="action-icon" />
                   </button>
                </form>
             </div>

             <div className="p-4 flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between px-2 mb-1">
                      <span className="text-[10px] text-[--secondary-text] uppercase font-bold opacity-30">Item</span>
                      <span className="text-[10px] text-[--secondary-text] uppercase font-bold opacity-30">Custo</span>
                   </div>
                   {pkg.expense_package_items?.map((item: any) => (
                     <div key={item.id} className="flex justify-between items-center text-sm group/item border-b border-white/5 pb-1 last:border-0 hover:bg-white/5 transition-colors px-2 rounded py-1">
                        <form action={updateExpenseItem} className="flex-1 flex justify-between items-center gap-2">
                           <input type="hidden" name="id" value={item.id} />
                           <input type="hidden" name="package_id" value={pkg.id} />
                           
                           <input 
                             name="name" 
                             defaultValue={item.name} 
                             className="text-[--foreground] bg-transparent border-0 p-1 focus:ring-1 ring-[--primary]/20 rounded w-full text-xs font-medium focus:bg-black/40 transition-all"
                           />
                           
                           <div className="flex items-center gap-2">
                              <div className="relative flex items-center">
                                <span className="text-[10px] text-[--secondary-text] mr-0.5 font-bold opacity-40">R$</span>
                                <input 
                                  name="cost" 
                                  type="number" 
                                  step="0.01" 
                                  defaultValue={item.cost} 
                                  className="font-mono text-xs text-[--foreground] bg-transparent border-0 p-1 w-16 text-right focus:ring-1 ring-[--primary]/20 rounded focus:bg-black/40 transition-all font-bold"
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
                     <div className="text-center py-6 text-xs text-[--secondary-text] italic opacity-30 flex flex-col items-center">
                        Nenhum item adicionado
                     </div>
                   )}
                </div>

                {/* Form para novo item */}
                <form action={addExpenseItem} className="mt-2 pt-4 border-t border-[--card-border]/30 flex gap-2">
                   <input type="hidden" name="package_id" value={pkg.id} />
                   <input 
                     name="name" 
                     type="text" 
                     placeholder="Novo item..." 
                     required 
                     className="bg-black/40 text-xs p-2 flex-1 rounded-lg border border-white/5 focus:border-[--primary]/30 transition-all"
                   />
                   <div className="relative flex items-center w-24">
                     <span className="absolute left-2 text-[9px] text-[--secondary-text] font-bold opacity-40">R$</span>
                     <input 
                       name="cost" 
                       type="number" 
                       step="0.01" 
                       placeholder="0,00" 
                       required 
                       className="bg-black/40 text-xs p-2 pl-6 w-full rounded-lg border border-white/5 focus:border-[--primary]/30 transition-all font-mono font-bold"
                     />
                   </div>
                   <button type="submit" className="golden-btn !p-0 !w-8 !h-8 flex items-center justify-center rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all">
                      <Plus className="w-4 h-4" />
                   </button>
                </form>
             </div>

             <div className="p-4 bg-black/40 border-t border-[--card-border]/50 flex justify-between items-center group/total">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-[--secondary-text] font-bold tracking-widest opacity-30">Total</span>
                  <span className="text-[10px] text-[--secondary-text] opacity-0 group-hover/total:opacity-100 transition-opacity">Consolidado</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-serif font-bold text-[--success]">R$ {pkg.total_cost.toFixed(2)}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
