import { getExpensePackages, createExpensePackage, deleteExpensePackage, addExpenseItem, removeExpenseItem, updateExpensePackage, updateExpenseItem } from './actions'
import { Plus, Trash2, Package, Pencil, Check } from 'lucide-react'

export default async function CustosPage() {
  const packages = await getExpensePackages()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Custos Operacionais</h1>
          <p className="text-[--secondary-text] mt-1">Gestão de pacotes de despesas para composição de custo do produto</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Adicionar Novo Pacote */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center group transition-colors min-h-[220px]">
          <form action={createExpensePackage} className="w-full flex flex-col items-center gap-6">
             <div className="w-14 h-14 rounded-full bg-[--primary]/10 border border-[--primary]/20 flex items-center justify-center text-[--primary] mb-2 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
             </div>
             <div className="w-full">
               <input 
                 name="name" 
                 type="text" 
                 placeholder="Nome do Novo Pacote..." 
                 required 
                 className="text-center bg-transparent border-b border-[--card-border] focus:border-[--primary] rounded-none px-0 mb-2"
               />
             </div>
             <button type="submit" className="primary-btn w-full !text-xs !py-2 uppercase tracking-widest">
               Criar Pacote
             </button>
          </form>
        </div>

        {/* Listagem de Pacotes */}
        {packages.map((pkg: any) => (
          <div key={pkg.id} className="glass-panel overflow-hidden flex flex-col border-t-4 border-[--primary] shadow-xl hover:shadow-2xl transition-all duration-300">
             <div className="p-4 border-b border-[--card-border] flex justify-between items-start card-texture-header bg-black/20">
                <div className="flex-1">
                   <form action={updateExpensePackage} className="flex items-center gap-2 group/title">
                      <input type="hidden" name="id" value={pkg.id} />
                      <div className="relative flex items-center group/input flex-1 max-w-[200px]">
                        <input 
                          name="name" 
                          defaultValue={pkg.name} 
                          className="font-serif text-xl text-[--primary] bg-transparent border-0 p-1 w-full focus:ring-2 ring-[--primary]/20 rounded transition-all focus:bg-black/40"
                        />
                        <Pencil className="w-4 h-4 absolute right-2 opacity-40 text-[--primary] pointer-events-none group-focus-within/input:hidden" />
                      </div>
                      <button type="submit" className="action-icon-btn opacity-0 group-focus-within/title:opacity-100 text-[--success] p-2 bg-[--success]/10 rounded-full transition-all">
                         <Check className="w-5 h-5" />
                      </button>
                   </form>
                   <span className="text-xs text-[--secondary-text] uppercase tracking-widest font-bold opacity-60">Pacote de Custos</span>
                </div>
                <form action={deleteExpensePackage} className="flex items-center">
                   <input type="hidden" name="id" value={pkg.id} />
                   <button type="submit" className="action-icon-btn text-[--danger] hover:bg-[--danger]/10 p-2 rounded-full transition-all">
                      <Trash2 className="w-5 h-5" />
                   </button>
                </form>
             </div>

             <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                   {pkg.expense_package_items?.map((item: any) => (
                     <div key={item.id} className="flex justify-between items-center text-sm group/item border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg py-2">
                        <form action={updateExpenseItem} className="flex-1 flex justify-between items-center gap-4">
                           <input type="hidden" name="id" value={item.id} />
                           <input type="hidden" name="package_id" value={pkg.id} />
                           
                           <input 
                             name="name" 
                             defaultValue={item.name} 
                             className="text-[--foreground] bg-transparent border-0 p-1 focus:ring-2 ring-[--primary]/20 rounded w-full text-sm font-medium focus:bg-black/40 transition-all"
                           />
                           
                           <div className="flex items-center gap-3">
                              <div className="relative flex items-center">
                                <span className="text-[11px] text-[--secondary-text] mr-1 font-bold">R$</span>
                                <input 
                                  name="cost" 
                                  type="number" 
                                  step="0.01" 
                                  defaultValue={item.cost} 
                                  className="font-mono text-base text-[--foreground] bg-transparent border-0 p-1 w-20 text-right focus:ring-2 ring-[--primary]/20 rounded focus:bg-black/40 transition-all font-bold"
                                />
                              </div>

                              <div className="flex items-center gap-1 transition-opacity">
                                 <button type="submit" title="Salvar Alteração" className="action-icon-btn text-[--success] p-1.5 hover:bg-[--success]/10 rounded-full opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100">
                                   <Check className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        </form>

                        <form action={removeExpenseItem} className="flex items-center ml-2">
                           <input type="hidden" name="id" value={item.id} />
                           <input type="hidden" name="package_id" value={pkg.id} />
                           <button type="submit" className="action-icon-btn text-[--danger] p-1.5 hover:bg-[--danger]/10 rounded-full opacity-60 group-hover/item:opacity-100 transition-all">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </form>
                     </div>
                   ))}
                   {(!pkg.expense_package_items || pkg.expense_package_items.length === 0) && (
                     <div className="text-center py-6 text-sm text-[--secondary-text] italic opacity-60">
                        Nenhum item adicionado
                     </div>
                   )}
                </div>

                {/* Form para novo item */}
                <form action={addExpenseItem} className="mt-4 pt-6 border-t border-[--card-border]/50 flex gap-3">
                   <input type="hidden" name="package_id" value={pkg.id} />
                   <input 
                     name="name" 
                     type="text" 
                     placeholder="Novo item (ex: Filtro, Etiqueta)..." 
                     required 
                     className="bg-black/60 text-sm p-2 flex-1 rounded-lg border border-white/5 focus:border-[--primary]/50 transition-all"
                   />
                   <div className="relative flex items-center w-24">
                     <span className="absolute left-2 text-[10px] text-[--secondary-text] font-bold">R$</span>
                     <input 
                       name="cost" 
                       type="number" 
                       step="0.01" 
                       placeholder="0.00" 
                       required 
                       className="bg-black/60 text-sm p-2 pl-6 w-full rounded-lg border border-white/5 focus:border-[--primary]/50 transition-all text-right font-mono"
                     />
                   </div>
                   <button type="submit" className="primary-btn !p-2 !w-12 !h-10 flex items-center justify-center rounded-lg shadow-lg hover:scale-110 active:scale-95 transition-all">
                      <Plus className="w-6 h-6" />
                   </button>
                </form>
             </div>

             <div className="p-6 bg-black/60 border-t border-[--card-border] flex justify-between items-center group/total">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-[--secondary-text] font-bold tracking-widest opacity-60">Custo Total Pacote</span>
                  <span className="text-sm text-[--secondary-text] opacity-40 group-hover/total:opacity-100 transition-opacity">Soma dos itens acima</span>
                </div>
                <span className="text-3xl font-serif font-bold text-[--success] drop-shadow-[0_0_10px_rgba(34,197,94,0.2)]">R$ {pkg.total_cost.toFixed(2)}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
