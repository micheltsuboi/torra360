'use client'

import { useState } from 'react'
import { createClientRecord } from './actions'

export default function ClientForm({ onSuccess }: { onSuccess?: () => void }) {
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (formData: FormData) => {
    const result = await createClientRecord(formData)
    if (result?.success && onSuccess) {
      onSuccess()
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    
    // Máscara de CPF
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    
    setCpf(value)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    
    // Máscara de Telefone (DDD) 9XXXX-XXXX ou (DDD) XXXX-XXXX
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2')
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, '($1')
    }
    
    setPhone(value)
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[--secondary-text] capitalize">Nome *</label>
          <input name="name" type="text" placeholder="Nome Completo" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[--secondary-text] capitalize">CPF</label>
          <input name="cpf" type="text" value={cpf} onChange={handleCpfChange} placeholder="000.000.000-00" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[--secondary-text] capitalize">Telefone</label>
          <input name="phone" type="tel" value={phone} onChange={handlePhoneChange} placeholder="(11) 99999-9999" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[--secondary-text] capitalize">Data de Nascimento</label>
          <input name="birth_date" type="date" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-[--secondary-text] capitalize">Endereço</label>
        <input name="address" type="text" placeholder="Rua, Número, Complemento, Bairro - CEP" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[--secondary-text] capitalize">Cidade</label>
          <input name="city" type="text" placeholder="Ex: São Paulo" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[--secondary-text] capitalize">Estado</label>
          <input name="state" type="text" maxLength={2} placeholder="SP" className="capitalize" />
        </div>
      </div>

      <button type="submit" className="primary-btn mt-4 w-fit">Cadastrar Cliente</button>
    </form>
  )
}
