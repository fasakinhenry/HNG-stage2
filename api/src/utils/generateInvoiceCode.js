export function generateInvoiceCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'

  const prefix = Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')
  const suffix = Array.from({ length: 4 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('')

  return `${prefix}${suffix}`
}
