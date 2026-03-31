'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { updatePackage, deletePackage } from './actions'

export default function PackageList({ packages, roasts, expensePackages }: { packages: any[], roasts: any[], expensePackages: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[--secondary-text] text-xs uppercase border-b border-[--card-border]">
            <th className="p-4 font-medium">Lote Base</th>
            <th className="p-4 font-medium border-l border-[--card-border]/20">Formato / Tamanho</th>
            <th className="p-4 font-medium text-center border-l border-[--card-border]/20">Qtd (Unds)</th>
            <th className="p-4 font-medium text-right border-l border-[--card-border]/20">Venda Unit. (R$)</th>
            <th className="p-4 font-medium text-right border-l border-[--card-border]/20">Ações</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {packages && packages.length > 0 ? (
            packages.map((p: any) => {
              const isEditing = editingId === p.id
              const totalEstimado = (p.retail_price * p.quantity_units).toFixed(2)

              if (isEditing) {
                return (
                  <tr key={p.id} className="border-b border-[--primary]/30 bg-[--primary]/5">
                    <td className="p-4">
                      <form id={`edit-pkg-${p.id}`} action={async (formData) => {
                        await updatePackage(formData)
                        setEditingId(null)
                      }}>
                        <input type="hidden" name="id" value={p.id} />
                        <span className="font-medium text-[--primary] block">{p.roast_batch?.green_coffee?.name || 'Lote Não Encontrado'}</span>
                        <input name="date" type="date" defaultValue={p.date} className="bg-black/40 text-xs p-1 mt-1 border border-white/10" />
                      </form>
                    </td>
                    <td className="p-4 border-l border-[--card-border]/20">
                      <div className="flex flex-col gap-1">
                        <select name="bean_format" form={`edit-pkg-${p.id}`} defaultValue={p.bean_format} className="bg-black/40 text-xs p-1 border border-white/10">
                          <option value="Grãos Inteiros">Grãos Inteiros</option>
                          <option value="Café Moído">Café Moído</option>
                        </select>
                        <select name="package_size_g" form={`edit-pkg-${p.id}`} defaultValue={p.package_size_g} className="bg-black/40 text-xs p-1 border border-white/10">
                          <option value="250">250g</option>
                          <option value="500">500g</option>
                          <option value="1000">1kg</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-center border-l border-[--card-border]/20">
                      <input name="quantity_units" type="number" form={`edit-pkg-${p.id}`} defaultValue={p.quantity_units} className="bg-black/40 text-xs p-1 w-16 text-center border border-white/10" />
                    </td>
                    <td className="p-4 text-right border-l border-[--card-border]/20">
                      <input name="retail_price" type="number" step="0.01" form={`edit-pkg-${p.id}`} defaultValue={p.retail_price} className="bg-black/40 text-xs p-1 w-20 text-right border border-white/10" />
                    </td>
                    <td className="p-4 text-right border-l border-[--card-border]/20">
                      <div className="flex items-center justify-end gap-2">
                        <button type="submit" form={`edit-pkg-${p.id}`} className="action-icon-btn text-[--success] hover:scale-110 transition-transform">
                          <Check className="action-icon" />
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="action-icon-btn text-[--secondary-text] hover:scale-110 transition-transform">
                          <X className="action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={p.id} className="border-b border-[--card-border]/50 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <span className="font-medium text-[--primary] block">{p.roast_batch?.green_coffee?.name || 'Lote Não Encontrado'}</span>
                    <span className="text-[--secondary-text] text-xs">Registrado em: {new Date(p.date).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4 border-l border-[--card-border]/20">
                    <span className="font-bold text-[--foreground] block">{p.bean_format || '-'}</span>
                    <span className="text-[--secondary-text] text-xs">{p.package_size_g ? `${p.package_size_g}g` : '-'}</span>
                  </td>
                  <td className="p-4 text-center border-l border-[--card-border]/20 font-bold">{p.quantity_units || '0'} unds</td>
                  <td className="p-4 text-right border-l border-[--card-border]/20">
                    <div className="text-[--success] font-bold">R$ {(p.retail_price || 0).toFixed(2)}</div>
                    <div className="text-[--secondary-text] text-[10px]">Total: R$ {totalEstimado}</div>
                  </td>
                  <td className="p-4 text-right border-l border-[--card-border]/20">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingId(p.id)}
                        className="action-icon-btn text-[--primary]" 
                        title="Editar Registro"
                      >
                         <Pencil className="action-icon" />
                      </button>
                      <form action={deletePackage}>
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
              <td colSpan={5} className="p-10 text-center text-[--secondary-text] italic">
                Nenhum pacote (produto final) registrado ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
