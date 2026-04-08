/**
 * Formata uma data para o padrão brasileiro DD/MM/AAAA.
 * Adiciona T12:00:00 para evitar que a data "volte um dia" devido ao fuso horário local.
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-'
  
  try {
    const date = typeof dateInput === 'string' 
      ? new Date(dateInput.includes('T') ? dateInput : `${dateInput}T12:00:00`)
      : dateInput

    return date.toLocaleDateString('pt-BR')
  } catch (error) {
    console.error('Erro ao formatar data:', error)
    return '-'
  }
}

/**
 * Formata data e hora para o padrão brasileiro DD/MM/AAAA HH:MM.
 */
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-'
  
  try {
    const date = new Date(dateInput)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '-'
  }
}
