import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useInvoices } from '../context/InvoiceContext'
import { usePreferences } from '../context/PreferencesContext'
import { InvoiceFormDrawer } from '../components/invoice/InvoiceFormDrawer'
import { EmptyState } from '../components/invoice/EmptyState'
import { FilterDropdown } from '../components/invoice/FilterDropdown'
import { InvoiceCard } from '../components/invoice/InvoiceCard'
import { Button } from '../components/ui/Button'
import { ConfettiBurst } from '../components/ui/ConfettiBurst'
import { Pagination } from '../components/ui/Pagination'

export function InvoicesPage() {
  const {
    invoices,
    loading,
    createInvoice,
    filterStatuses,
    setFilterStatuses,
  } = useInvoices()
  const { invoicesPerPage } = usePreferences()
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [confettiTick, setConfettiTick] = useState(0)

  const filteredInvoices = useMemo(() => {
    if (filterStatuses.length === 0) return invoices
    return invoices.filter((invoice) => filterStatuses.includes(invoice.status))
  }, [invoices, filterStatuses])

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / invoicesPerPage))

  useEffect(() => {
    setPage(1)
  }, [filterStatuses, invoicesPerPage])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  useEffect(() => {
    const suffix = filterStatuses.length > 0 ? ` - ${filterStatuses.join(', ')}` : ''
    document.title = `Invoices (${filteredInvoices.length})${suffix}`
  }, [filteredInvoices.length, filterStatuses])

  const pagedInvoices = useMemo(() => {
    const start = (page - 1) * invoicesPerPage
    const end = start + invoicesPerPage
    return filteredInvoices.slice(start, end)
  }, [filteredInvoices, page, invoicesPerPage])

  return (
    <section>
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-h1 text-(--color-text-heading)">Invoices</h1>
          <p className="mt-1 text-body text-(--color-text-muted)">
            {filteredInvoices.length === 0
              ? 'No invoices'
              : `There are ${filteredInvoices.length} total invoices`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <FilterDropdown selected={filterStatuses} onChange={setFilterStatuses} />
          <Button variant="newInvoice" icon="plus" onClick={() => setShowForm(true)}>
            <span className="hidden sm:inline">New Invoice</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </header>

      <div className="mt-8">
        {loading ? (
          <p className="text-body text-(--color-text-muted)">Loading invoices...</p>
        ) : filteredInvoices.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {pagedInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <InvoiceFormDrawer
        open={showForm}
        mode="create"
        onClose={() => setShowForm(false)}
        onSaveAsDraft={async (payload) => {
          try {
            const draft = await createInvoice(payload, true)
            toast.success(`Draft #${draft.id} saved.`)
          } catch {
            toast.error('Could not save draft. Try again.')
            throw new Error('Draft creation failed')
          }
        }}
        onSaveAndSend={async (payload) => {
          try {
            const created = await createInvoice(payload, false)
            toast.success(`Invoice #${created.id} created.`)
            setConfettiTick(Date.now())
          } catch {
            toast.error('Could not create invoice. Try again.')
            throw new Error('Invoice creation failed')
          }
        }}
        onSaveChanges={async () => {
          // This callback is not used in create mode.
        }}
      />

      <ConfettiBurst trigger={confettiTick} />
    </section>
  )
}
