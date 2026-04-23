import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { APP_STORAGE_KEY, buildInvoiceFromPayload, calculateTotal, computeItems, getPaymentDueDate } from '../lib/helpers'
import { invoiceApi } from '../lib/api'
import { seedInvoices } from '../lib/seedData'
import type { Invoice, InvoicePayload, InvoiceStatus } from '../types/invoice'
import { useAuth } from './AuthContext'

interface InvoiceContextValue {
  invoices: Invoice[]
  loading: boolean
  createInvoice: (payload: InvoicePayload, asDraft?: boolean) => Promise<Invoice>
  updateInvoice: (id: string, payload: InvoicePayload) => Promise<Invoice | null>
  deleteInvoice: (id: string) => Promise<boolean>
  markAsPaid: (id: string) => Promise<Invoice | null>
  getInvoiceById: (id: string) => Invoice | undefined
  filterStatuses: InvoiceStatus[]
  setFilterStatuses: (statuses: InvoiceStatus[]) => void
}

const InvoiceContext = createContext<InvoiceContextValue | undefined>(undefined)

function readStoredInvoices() {
  try {
    const raw = localStorage.getItem(APP_STORAGE_KEY)
    if (!raw) return seedInvoices

    const parsed = JSON.parse(raw) as Invoice[]
    if (!Array.isArray(parsed)) return seedInvoices

    return parsed
  } catch {
    return seedInvoices
  }
}

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatuses, setFilterStatuses] = useState<InvoiceStatus[]>([])
  const [usingApi, setUsingApi] = useState(false)

  useEffect(() => {
    if (authLoading) return

    let cancelled = false

    async function bootstrap() {
      if (!user) {
        if (!cancelled) {
          setInvoices(readStoredInvoices())
          setUsingApi(false)
          setLoading(false)
        }
        return
      }

      try {
        const response = await invoiceApi.list()
        if (!cancelled) {
          setInvoices(response.invoices)
          setUsingApi(true)
        }
      } catch {
        if (!cancelled) {
          setInvoices(readStoredInvoices())
          setUsingApi(false)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  useEffect(() => {
    if (!loading && !usingApi) {
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(invoices))
    }
  }, [invoices, loading, usingApi])

  const createInvoice = async (payload: InvoicePayload, asDraft = false) => {
    if (usingApi) {
      const response = await invoiceApi.create(payload, asDraft)
      setInvoices((prev) => [response.invoice, ...prev])
      return response.invoice
    }

    const created = buildInvoiceFromPayload(payload, asDraft ? 'draft' : 'pending')
    setInvoices((prev) => [created, ...prev])
    return created
  }

  const updateInvoice = async (id: string, payload: InvoicePayload) => {
    if (usingApi) {
      const response = await invoiceApi.update(id, payload)
      setInvoices((prev) => prev.map((invoice) => (invoice.id === id ? response.invoice : invoice)))
      return response.invoice
    }

    let updatedInvoice: Invoice | null = null

    setInvoices((prev) =>
      prev.map((invoice) => {
        if (invoice.id !== id) return invoice

        const pricedItems = computeItems(payload.items)
        const updated: Invoice = {
          ...invoice,
          createdAt: payload.createdAt,
          paymentDue: getPaymentDueDate(payload.createdAt, payload.paymentTerms),
          paymentTerms: payload.paymentTerms,
          description: payload.description,
          clientName: payload.clientName,
          clientEmail: payload.clientEmail,
          senderAddress: payload.senderAddress,
          clientAddress: payload.clientAddress,
          items: pricedItems,
          total: calculateTotal(pricedItems),
          status: invoice.status === 'draft' ? 'pending' : invoice.status,
        }

        updatedInvoice = updated
        return updated
      }),
    )

    return updatedInvoice
  }

  const deleteInvoice = async (id: string) => {
    if (usingApi) {
      const response = await invoiceApi.remove(id)
      if (response.success) {
        setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
      }
      return response.success
    }

    let didDelete = false
    setInvoices((prev) => {
      const next = prev.filter((invoice) => invoice.id !== id)
      didDelete = next.length !== prev.length
      return next
    })

    return didDelete
  }

  const markAsPaid = async (id: string) => {
    if (usingApi) {
      const response = await invoiceApi.markPaid(id)
      setInvoices((prev) => prev.map((invoice) => (invoice.id === id ? response.invoice : invoice)))
      return response.invoice
    }

    let paidInvoice: Invoice | null = null

    setInvoices((prev) =>
      prev.map((invoice) => {
        if (invoice.id !== id) return invoice
        if (invoice.status === 'paid') return invoice

        const next: Invoice = { ...invoice, status: 'paid' }
        paidInvoice = next
        return next
      }),
    )

    return paidInvoice
  }

  const getInvoiceById = (id: string) => invoices.find((invoice) => invoice.id === id)

  const value = useMemo(
    () => ({
      invoices,
      loading,
      createInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid,
      getInvoiceById,
      filterStatuses,
      setFilterStatuses,
    }),
    [invoices, loading, filterStatuses],
  )

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
}

export const useInvoices = () => {
  const context = useContext(InvoiceContext)

  if (!context) {
    throw new Error('useInvoices must be used inside InvoiceProvider')
  }

  return context
}
