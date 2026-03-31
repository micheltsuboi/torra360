'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { updatePackage, deletePackage } from './actions'

export default function PackageList({ packages, roasts, expensePackages }: { packages: any[], roasts: any[], expensePackages: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="responsive-table-container scrollbar-thin scrollbar-thumb-[--primary]/20">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr className="text-[--secondary-text] text-[10px] capitalize border-b border-[--card-border]/50 bg-white/5 tracking-widest">
            <th className="p-2 font-bold">Produto / Lote Torra</th>
            <th className="p-2 font-bold border-l border-white/5">Formato / Tamanho</th>
            <th className="p-2 font-bold border-l border-white/5">Qtd (Unids)</th>
            <th className="p-2 font-bold border-l border-white/5">Venda Unit.</th>
            <th className="p-2 font-bold border-l border-white/5">Ações</th>
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
                    <td className="p-2">
                      <form id={`edit-pkg-${p.id}`} action={async (formData) => {
                        await updatePackage(formData)
                        setEditingId(null)
                      }}>
                        <input type="hidden" name="id" value={p.id} />
                        <span className="text-sm font-semibold text-[--primary] block">{roast?.green_coffee?.name || 'N/A'}</span>
                        <input name="date" type="date" defaultValue={p.date} className="bg-black/60 text-xs p-1 mt-1 border border-white/10 rounded w-full" />
                      </form>
                    </td>
                    <td className="p-2 border-l border-white/5">
                      <div className="flex flex-col gap-1">
                        <select name="bean_format" form={`edit-pkg-${p.id}`} defaultValue={p.bean_format} className="bg-black/60 text-[10px] p-1 border border-white/10 rounded">
                          <option value="Grãos Inteiros">Grãos</option>
                          <option value="Café Moído">Moído</option>
                        </select>
                        <select name="package_size_g" form={`edit-pkg-${p.id}`} defaultValue={p.package_size_g} className="bg-black/60 text-[10px] p-1 border border-white/10 rounded">
                          <option value="250">250g</option>
                          <option value="500">500g</option>
                          <option value="1000">1kg</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-2 border-l border-white/5">
                      <input name="quantity_units" type="number" form={`edit-pkg-${p.id}`} defaultValue={p.quantity_units} className="bg-black/60 text-xs p-1 w-16 text-center border border-white/10 rounded" />
                    </td>
                    <td className="p-2 border-l border-white/5">
                      <input name="retail_price" type="number" step="0.01" form={`edit-pkg-${p.id}`} defaultValue={p.retail_price} className="bg-black/60 text-xs p-1 w-20 text-center border border-white/10 rounded" />
                    </td>
                    <td className="p-2 border-l border-white/5">
                      <div className="flex items-center justify-center gap-1">
                        <button type="submit" form={`edit-pkg-${p.id}`} className="action-icon-btn text-[--success] !opacity-100">
                          <Check className="action-icon" />
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="action-icon-btn text-[--secondary-text] !opacity-100">
                          <X className="action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={p.id} className="border-b border-[--card-border]/30 hover:bg-white/5 transition-colors group">
                  <td className="p-2  ">
                    <span className="text-sm font-semibold text-[--primary] block">{roast?.green_coffee?.name || 'N/A'}</span>
                    <span className="text-[10px] text-[--secondary-text] opacity-60">Produzido em {new Date(p.date).toLocaleDateString()}</span>
                  </td>
                  <td className="p-2 border-l border-white/5">
                    <span className="text-xs font-medium block">{p.bean_format}</span>
                    <span className="text-[10px] opacity-40">{p.package_size_g}g</span>
                  </td>
                  <td className="p-2 border-l border-white/5">
                    <div className="flex flex-col">
                      <span className={`font-bold ${p.quantity_units < 5 ? 'text-[--danger]' : 'text-[--primary]'}`}>
                        {p.quantity_units}
                      </span>
                      <span className="text-[9px] opacity-30 tracking-widest">unidades</span>
                    </div>
                  </td>
                  <td className="p-2 border-l border-white/5">
                    <div className="text-[--foreground] font-bold text-sm">R$ {(p.retail_price || 0).toFixed(2)}</div>
                    <div className="text-[9px] opacity-30">Total: R$ {totalEstimado}</div>
                  </td>
                  <td className="p-2 border-l border-white/5">
                    <div className="flex justify-center items-center gap-1">
                        <button 
                          onClick={() => setEditingId(p.id)}
                          className="action-icon-btn text-[--primary]" 
                          title="Editar"
                        >
                           <Pencil className="action-icon" />
                        </button>
                        <form action={deletePackage} className="flex items-center">
                           <input type="hidden" name="id" value={p.id} />
                           <button type="submit" className="action-icon-btn text-[--danger]">
                              <Trash2 className="action-icon" />
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
