import type { InvoicePayload } from '../types/invoice'

export type InvoiceFormErrors = Record<string, string>

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateInvoicePayload = (payload: InvoicePayload): InvoiceFormErrors => {
  const errors: InvoiceFormErrors = {}

  if (!payload.senderAddress.street.trim()) errors.senderStreet = 'Street is required'
  if (!payload.senderAddress.city.trim()) errors.senderCity = 'City is required'
  if (!payload.senderAddress.postCode.trim()) errors.senderPostCode = 'Post code is required'
  if (!payload.senderAddress.country.trim()) errors.senderCountry = 'Country is required'

  if (!payload.clientName.trim()) errors.clientName = 'Client name is required'
  if (!payload.clientEmail.trim()) {
    errors.clientEmail = 'Client email is required'
  } else if (!emailRegex.test(payload.clientEmail.trim())) {
    errors.clientEmail = 'Please enter a valid email'
  }

  if (!payload.clientAddress.street.trim()) errors.clientStreet = 'Street is required'
  if (!payload.clientAddress.city.trim()) errors.clientCity = 'City is required'
  if (!payload.clientAddress.postCode.trim()) errors.clientPostCode = 'Post code is required'
  if (!payload.clientAddress.country.trim()) errors.clientCountry = 'Country is required'

  if (!payload.createdAt) errors.createdAt = 'Invoice date is required'
  if (!payload.description.trim()) errors.description = 'Project description is required'

  if (payload.items.length < 1) {
    errors.items = 'At least one item is required'
  }

  payload.items.forEach((item, index) => {
    if (!item.name.trim()) errors[`itemName-${index}`] = 'Item name is required'
    if (item.quantity <= 0) errors[`itemQty-${index}`] = 'Quantity must be above 0'
    if (item.price <= 0) errors[`itemPrice-${index}`] = 'Price must be above 0'
  })

  return errors
}
