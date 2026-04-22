import type { Invoice, InvoiceItem, InvoicePayload, InvoiceStatus } from '../types/invoice'

export const APP_STORAGE_KEY = 'hng-invoice-app-v1'

export const currency = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
})

export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate))

export const createInvoiceCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  return Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join('') +
    Array.from({ length: 4 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('')
}

export const computeItems = (items: InvoiceItem[]) =>
  items.map((item) => ({
    ...item,
    total: Number((item.price * item.quantity).toFixed(2)),
  }))

export const calculateTotal = (items: InvoiceItem[]) =>
  Number(items.reduce((sum, item) => sum + item.total, 0).toFixed(2))

export const getPaymentDueDate = (createdAt: string, paymentTerms: number) => {
  const base = new Date(createdAt)
  base.setDate(base.getDate() + paymentTerms)
  return base.toISOString().slice(0, 10)
}

export const buildInvoiceFromPayload = (
  payload: InvoicePayload,
  status: InvoiceStatus,
): Invoice => {
  const pricedItems = computeItems(payload.items)

  return {
    id: createInvoiceCode(),
    createdAt: payload.createdAt,
    paymentDue: getPaymentDueDate(payload.createdAt, payload.paymentTerms),
    description: payload.description,
    paymentTerms: payload.paymentTerms,
    clientName: payload.clientName,
    clientEmail: payload.clientEmail,
    status,
    senderAddress: payload.senderAddress,
    clientAddress: payload.clientAddress,
    items: pricedItems,
    total: calculateTotal(pricedItems),
  }
}
