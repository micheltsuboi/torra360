import { getProducts, createProduct, getSales, createSale, getExpenses, createExpense } from './actions'

export default async function ComercialPage() {
  const products = await getProducts()
  const sales = await getSales()
  const expenses = await getExpenses()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-serif text-[--foreground]">Comercial & Financeiro</h1>
          <p className="text-[--secondary-text] mt-1">Gestão de Produtos, Vendas e Despesas</p>
        </div>
      </div>

      {/* Grid de Formularios Rápidos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Adicionar Produto */}
        <div className="glass-panel p-6">
          <h2 className="font-serif mb-4 text-[--primary]">Novo Produto</h2>
          <form action={createProduct} className="flex flex-col gap-3">
             <input name="name" type="text" placeholder="Gourmet Sul de Minas 250g" required />
             <div className="grid grid-cols-2 gap-3">
               <select name="type" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                 <option value="Grão">Grão</option>
                 <option value="Moído">Moído</option>
               </select>
               <input name="default_price" type="number" step="0.01" placeholder="Preço (R$)" required />
             </div>
             <button type="submit" className="primary-btn mt-2 text-sm py-2">Salvar Produto</button>
          </form>
        </div>

        {/* Adicionar Venda */}
        <div className="glass-panel p-6">
          <h2 className="font-serif mb-4 text-[--success]">Nova Venda</h2>
          <form action={createSale} className="flex flex-col gap-3">
             <div className="grid grid-cols-2 gap-3">
                <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                <input name="client_name" type="text" placeholder="Cliente" />
             </div>
             <select name="product_id" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                <option value="">Selecione o Produto...</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name} - R$ {p.default_price}</option>
                ))}
             </select>
             <div className="grid grid-cols-2 gap-3">
               <input name="quantity" type="number" min="1" placeholder="Qtd" required />
               <input name="unit_price" type="number" step="0.01" placeholder="Preço Unit." required />
             </div>
             <button type="submit" className="primary-btn mt-2 text-sm py-2 bg-gradient-to-r from-[--success] to-emerald-700 !shadow-[--success]">Registrar Venda</button>
          </form>
        </div>

        {/* Adicionar Despesa */}
        <div className="glass-panel p-6">
          <h2 className="font-serif mb-4 text-[--danger]">Nova Despesa</h2>
          <form action={createExpense} className="flex flex-col gap-3">
             <div className="grid grid-cols-2 gap-3">
                <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                <select name="category" className="bg-black/20 border border-[--card-border] rounded p-2 text-sm text-[--foreground]" required>
                   <option value="Embalagem">Embalagens</option>
                   <option value="Serviços">Serviços / Gás</option>
                   <option value="Impostos">Impostos</option>
                   <option value="Outros">Outros</option>
                </select>
             </div>
             <input name="amount" type="number" step="0.01" placeholder="Valor (R$)" required />
             <input name="notes" type="text" placeholder="Observação..." />
             <button type="submit" className="primary-btn mt-2 text-sm py-2 opacity-80 hover:opacity-100">Registrar Despesa</button>
          </form>
        </div>

      </div>

      {/* Listas e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-fit">
        
        {/* Histórico Vendas */}
        <div className="glass-panel overflow-hidden h-fit">
           <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40">
              <h2 className="font-serif">Histórico de Vendas</h2>
           </div>
           <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-[#1a1512] sticky top-0">
                    <tr className="text-[--secondary-text] text-xs uppercase border-b border-[--card-border]">
                       <th className="p-3">Data/Cliente</th>
                       <th className="p-3">Produto</th>
                       <th className="p-3 text-right">Qtd</th>
                       <th className="p-3 text-right">Total</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {sales.map((s: any) => (
                      <tr key={s.id} className="border-b border-[--card-border]/50 hover:bg-white/5">
                        <td className="p-3">
                           <span className="block">{new Date(s.date).toLocaleDateString()}</span>
                           <span className="text-xs text-[--secondary-text]">{s.client_name}</span>
                        </td>
                        <td className="p-3 text-[--primary] font-medium">{s.product?.name}</td>
                        <td className="p-3 text-right">{s.quantity}</td>
                        <td className="p-3 text-right text-[--success] font-bold">R$ {(s.quantity * s.unit_price).toFixed(2)}</td>
                      </tr>
                    ))}
                    {sales.length === 0 && (
                      <tr><td colSpan={4} className="p-6 text-center text-sm text-[--secondary-text]">Nenhuma venda registrada.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Histórico Despesas */}
        <div className="glass-panel overflow-hidden h-fit">
           <div className="p-4 border-b border-[--card-border] wood-texture bg-black/40">
              <h2 className="font-serif">Relatório de Despesas</h2>
           </div>
           <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-[#1a1512] sticky top-0">
                    <tr className="text-[--secondary-text] text-xs uppercase border-b border-[--card-border]">
                       <th className="p-3">Data</th>
                       <th className="p-3">Categoria</th>
                       <th className="p-3">Obsevação</th>
                       <th className="p-3 text-right">Valor</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {expenses.map((e: any) => (
                      <tr key={e.id} className="border-b border-[--card-border]/50 hover:bg-white/5">
                        <td className="p-3 text-[--secondary-text]">{new Date(e.date).toLocaleDateString()}</td>
                        <td className="p-3 text-[#AC9D91]">{e.category}</td>
                        <td className="p-3 text-xs">{e.notes}</td>
                        <td className="p-3 text-right text-[--danger] font-bold">R$ {e.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                    {expenses.length === 0 && (
                      <tr><td colSpan={4} className="p-6 text-center text-sm text-[--secondary-text]">Nenhuma despesa registrada.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

      </div>

    </div>
  )
}
