'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { updatePackage, deletePackage } from './actions'

export default function PackageList({ packages, roasts, expensePackages }: { packages: any[], roasts: any[], expensePackages: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="responsive-table-container scrollbar-thin scrollbar-thumb-[--primary]/20">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="text-[--secondary-text] text-[10px] uppercase border-b border-[--card-border]/50 bg-white/5 tracking-widest">
            <th className="p-4 font-bold">Produto / Lote Torra</th>
            <th className="p-4 font-bold border-l border-white/5">Formato / Tamanho</th>
            <th className="p-4 font-bold text-center border-l border-white/5">Qtd (Unids)</th>
            <th className="p-4 font-bold text-right border-l border-white/5">Venda Unit.</th>
            <th className="p-4 font-bold text-right border-l border-white/5">Ações</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {packages && packages.length > 0 ? (
            packages.map((p: any) => {
              const isEditing = editingId === p.id
              const totalEstimado = (p.retail_price * p.quantity_units).toFixed(2)
              const roast = roasts.find(r => r.id === p.roast_batch_id)

              if (isEditing) {
                return (
                  <tr key={p.id} className="border-b border-[--primary]/30 bg-[--primary]/5">
                    <td className="p-4">
                      <form id={`edit-pkg-${p.id}`} action={async (formData) => {
                        await updatePackage(formData)
                        setEditingId(null)
                      }}>
                        <input type="hidden" name="id" value={p.id} />
                        <span className="font-serif text-lg text-[--primary] block">{roast?.green_coffee?.name || 'Lote Não Encontrado'}</span>
                        <input name="date" type="date" defaultValue={p.date} className="bg-black/60 text-xs p-2 mt-2 border border-white/10 rounded-lg w-full" />
                      </form>
                    </td>
                    <td className="p-4 border-l border-white/5">
                      <div className="flex flex-col gap-2">
                        <select name="bean_format" form={`edit-pkg-${p.id}`} defaultValue={p.bean_format} className="bg-black/60 text-xs p-2 border border-white/10 rounded-lg">
                          <option value="Grãos Inteiros">Grãos Inteiros</option>
                          <option value="Café Moído">Café Moído</option>
                        </select>
                        <select name="package_size_g" form={`edit-pkg-${p.id}`} defaultValue={p.package_size_g} className="bg-black/60 text-xs p-2 border border-white/10 rounded-lg">
                          <option value="250">250g</option>
                          <option value="500">500g</option>
                          <option value="1000">1kg</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-center border-l border-white/5">
                      <input name="quantity_units" type="number" form={`edit-pkg-${p.id}`} defaultValue={p.quantity_units} className="bg-black/60 text-xs p-2 w-20 text-center border border-white/10 rounded-lg" />
                    </td>
                    <td className="p-4 text-right border-l border-white/5">
                      <input name="retail_price" type="number" step="0.01" form={`edit-pkg-${p.id}`} defaultValue={p.retail_price} className="bg-black/60 text-xs p-2 w-24 text-right border border-white/10 rounded-lg" />
                    </td>
                    <td className="p-4 text-right border-l border-white/5">
                      <div className="flex items-center justify-end gap-2">
                        <button type="submit" form={`edit-pkg-${p.id}`} className="p-2 text-[--success] hover:bg-[--success]/10 rounded-full transition-all">
                          <Check className="w-5 h-5" />
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="p-2 text-[--secondary-text] hover:bg-white/10 rounded-full transition-all">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={p.id} className="border-b border-[--card-border]/30 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <span className="font-serif text-lg text-[--primary] block group-hover:text-[--foreground] transition-colors">{roast?.green_coffee?.name || 'Lote Não Encontrado'}</span>
                    <span className="text-[10px] text-[--secondary-text] uppercase font-bold tracking-widest">Produzido em {new Date(p.date).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4 border-l border-white/5">
                    <span className="text-sm font-bold text-[--foreground] block">{p.bean_format}</span>
                    <span className="bg-black/40 px-2 py-0.5 rounded text-[10px] border border-white/5 font-mono opacity-60">{p.package_size_g}g</span>
                  </td>
                  <td className="p-4 text-center border-l border-white/5">
                    <div className="flex flex-col items-center">
                      <span className={`text-xl font-bold font-serif ${p.quantity_units < 5 ? 'text-[--danger]' : 'text-[--primary]'}`}>
                        {p.quantity_units}
                      </span>
                      <span className="text-[9px] uppercase font-bold opacity-30 tracking-widest">unidades</span>
                    </div>
                  </td>
                  <td className="p-4 text-right border-l border-white/5">
                    <div className="text-[--foreground] font-bold text-base">R$ {(p.retail_price || 0).toFixed(2)}</div>
                    <div className="text-[--secondary-text] text-[10px] uppercase font-bold opacity-40">Valor Estimado Est.: R$ {totalEstimado}</div>
                  </td>
                  <td className="p-4 text-right border-l border-white/5">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => setEditingId(p.id)}
                        className="p-2 text-[--primary] hover:bg-[--primary]/10 rounded-full transition-all opacity-40 hover:opacity-100" 
                        title="Editar Registro"
                      >
                         <Pencil className="w-4 h-4" />
                      </button>
                      <form action={deletePackage} className="flex items-center">
                         <input type="hidden" name="id" value={p.id} />
                         <button type="submit" className="p-2 text-[--danger] hover:bg-[--danger]/10 rounded-full transition-all opacity-40 hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={5} className="p-20 text-center text-[--secondary-text] italic opacity-40">
                Sem produtos finais registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
