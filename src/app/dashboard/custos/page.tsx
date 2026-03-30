import { getExpensePackages, createExpensePackage, deleteExpensePackage, addExpenseItem, removeExpenseItem } from './actions'
import { Trash2, Plus, Package } from 'lucide-react'

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
        <div className="glass-panel p-6 border-dashed border-2 border-[--card-border] flex flex-col items-center justify-center text-center group hover:border-[--primary] transition-colors cursor-pointer min-h-[200px]">
          <form action={createExpensePackage} className="w-full flex flex-col items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-[--primary]/10 flex items-center justify-center text-[--primary] mb-2 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
             </div>
             <div className="w-full">
               <input 
                 name="name" 
                 type="text" 
                 placeholder="Nome do Pacote (ex: Embalagem 250g)" 
                 required 
                 className="text-center bg-transparent border-b border-[--card-border] focus:border-[--primary] rounded-none px-0"
               />
             </div>
             <button type="submit" className="text-xs uppercase tracking-widest text-[--primary] font-bold hover:underline">
               Criar Novo Pacote
             </button>
          </form>
        </div>

        {/* Listagem de Pacotes */}
        {packages.map((pkg: any) => (
          <div key={pkg.id} className="glass-panel overflow-hidden flex flex-col border-t-4 border-[--primary]">
             <div className="p-4 border-b border-[--card-border] flex justify-between items-start card-texture-header">
                <div>
                   <h3 className="font-serif text-lg text-[--foreground]">{pkg.name}</h3>
                   <span className="text-xs text-[--secondary-text]">Criado em {new Date(pkg.created_at).toLocaleDateString()}</span>
                </div>
                <form action={deleteExpensePackage}>
                   <input type="hidden" name="id" value={pkg.id} />
                   <button type="submit" className="text-[--danger] hover:opacity-70 p-1">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </form>
             </div>

             <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                   {pkg.expense_package_items?.map((item: any) => (
                     <div key={item.id} className="flex justify-between items-center text-sm group/item">
                        <span className="text-[--secondary-text]">{item.name}</span>
                        <div className="flex items-center gap-3">
                           <span className="font-medium text-[--foreground]">R$ {item.cost.toFixed(2)}</span>
                           <form action={removeExpenseItem}>
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="package_id" value={pkg.id} />
                              <button type="submit" className="opacity-0 group-hover/item:opacity-100 text-[--danger] transition-opacity">
                                <Trash2 className="w-3 h-3" />
                              </button>
                           </form>
                        </div>
                     </div>
                   ))}
                   {(!pkg.expense_package_items || pkg.expense_package_items.length === 0) && (
                     <div className="text-center py-4 text-xs text-[--secondary-text] italic">
                        Nenhum item adicionado
                     </div>
                   )}
                </div>

                {/* Form para novo item */}
                <form action={addExpenseItem} className="mt-4 pt-4 border-t border-[--card-border]/50 flex gap-2">
                   <input type="hidden" name="package_id" value={pkg.id} />
                   <input 
                     name="name" 
                     type="text" 
                     placeholder="Item..." 
                     required 
                     className="bg-black/20 text-xs p-1 h-8"
                   />
                   <input 
                     name="cost" 
                     type="number" 
                     step="0.01" 
                     placeholder="R$" 
                     required 
                     className="bg-black/20 text-xs p-1 h-8 w-20 text-right"
                   />
                   <button type="submit" className="bg-[--primary] text-white rounded p-1 h-8 w-8 flex items-center justify-center hover:opacity-80">
                      <Plus className="w-4 h-4" />
                   </button>
                </form>
             </div>

             <div className="p-4 bg-black/40 border-t border-[--card-border] flex justify-between items-center">
                <span className="text-xs uppercase text-[--secondary-text] font-bold">Custo Total</span>
                <span className="text-xl font-bold text-[--success]">R$ {pkg.total_cost.toFixed(2)}</span>
             </div>
          </div>
        ))}

      </div>
    </div>
  )
}
