import { Invoice } from '../models/Invoice.js'
import { generateInvoiceCode } from '../utils/generateInvoiceCode.js'

function calculateTotal(items) {
  return Number(items.reduce((sum, item) => sum + Number(item.total ?? item.price * item.quantity), 0).toFixed(2))
}

function computeItems(items) {
  return items.map((item) => ({
    name: item.name,
    quantity: Number(item.quantity),
    price: Number(item.price),
    total: Number((Number(item.quantity) * Number(item.price)).toFixed(2)),
  }))
}

function computeDueDate(createdAt, paymentTerms) {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + Number(paymentTerms))
  return date.toISOString().slice(0, 10)
}

function toClientInvoice(doc) {
  return {
    id: doc.id,
    createdAt: doc.createdAt,
    paymentDue: doc.paymentDue,
    description: doc.description,
    paymentTerms: doc.paymentTerms,
    clientName: doc.clientName,
    clientEmail: doc.clientEmail,
    status: doc.status,
    senderAddress: doc.senderAddress,
    clientAddress: doc.clientAddress,
    items: doc.items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    total: doc.total,
  }
}

export async function listInvoices(req, res) {
  const docs = await Invoice.find({ owner: req.user._id }).sort({ createdAt: -1 })
  return res.json({ invoices: docs.map(toClientInvoice) })
}

export async function getInvoice(req, res) {
  const doc = await Invoice.findOne({ owner: req.user._id, id: req.params.id.toUpperCase() })
  if (!doc) {
    return res.status(404).json({ message: 'Invoice not found' })
  }
  return res.json({ invoice: toClientInvoice(doc) })
}

export async function createInvoice(req, res) {
  const payload = req.body
  const status = payload.asDraft ? 'draft' : 'pending'
  const items = computeItems(payload.items)
  const total = calculateTotal(items)

  let invoiceId = generateInvoiceCode()
  for (let i = 0; i < 5; i += 1) {
    const exists = await Invoice.findOne({ owner: req.user._id, id: invoiceId })
    if (!exists) break
    invoiceId = generateInvoiceCode()
  }

  const doc = await Invoice.create({
    id: invoiceId,
    owner: req.user._id,
    createdAt: payload.createdAt,
    paymentDue: computeDueDate(payload.createdAt, payload.paymentTerms),
    description: payload.description,
    paymentTerms: payload.paymentTerms,
    clientName: payload.clientName,
    clientEmail: payload.clientEmail,
    status,
    senderAddress: payload.senderAddress,
    clientAddress: payload.clientAddress,
    items,
    total,
  })

  return res.status(201).json({ invoice: toClientInvoice(doc) })
}

export async function updateInvoice(req, res) {
  const doc = await Invoice.findOne({ owner: req.user._id, id: req.params.id.toUpperCase() })
  if (!doc) {
    return res.status(404).json({ message: 'Invoice not found' })
  }

  const payload = req.body
  const items = computeItems(payload.items)
  const total = calculateTotal(items)

  doc.createdAt = payload.createdAt
  doc.paymentDue = computeDueDate(payload.createdAt, payload.paymentTerms)
  doc.description = payload.description
  doc.paymentTerms = payload.paymentTerms
  doc.clientName = payload.clientName
  doc.clientEmail = payload.clientEmail
  doc.senderAddress = payload.senderAddress
  doc.clientAddress = payload.clientAddress
  doc.items = items
  doc.total = total
  if (doc.status === 'draft') {
    doc.status = 'pending'
  }

  await doc.save()
  return res.json({ invoice: toClientInvoice(doc) })
}

export async function deleteInvoice(req, res) {
  const result = await Invoice.deleteOne({ owner: req.user._id, id: req.params.id.toUpperCase() })
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Invoice not found' })
  }

  return res.json({ success: true })
}

export async function markInvoicePaid(req, res) {
  const doc = await Invoice.findOne({ owner: req.user._id, id: req.params.id.toUpperCase() })
  if (!doc) {
    return res.status(404).json({ message: 'Invoice not found' })
  }

  if (doc.status === 'pending') {
    doc.status = 'paid'
    await doc.save()
  }

  return res.json({ invoice: toClientInvoice(doc) })
}
