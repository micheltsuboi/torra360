'use client'

import { Trash2 } from 'lucide-react'
import { deleteSale } from './actions'

interface DeleteSaleButtonProps {
  saleId: string
}

export default function DeleteSaleButton({ saleId }: DeleteSaleButtonProps) {
  const handleDelete = async (formData: FormData) => {
    if (window.confirm('Deseja realmente excluir esta venda? Esta ação devolverá os produtos ao estoque e não pode ser desfeita.')) {
      await deleteSale(formData)
    }
  }

  return (
    <form action={handleDelete} className="flex items-center justify-center gap-2">
      <input type="hidden" name="id" value={saleId} />
      <button type="submit" className="action-icon-btn text-[--danger]">
        <Trash2 className="action-icon" />
      </button>
    </form>
  )
}
