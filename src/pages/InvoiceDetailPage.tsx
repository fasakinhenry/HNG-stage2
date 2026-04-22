import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useInvoices } from '../context/InvoiceContext'
import { currency, formatDate } from '../lib/helpers'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Modal } from '../components/ui/Modal'
import { InvoiceFormDrawer } from '../components/invoice/InvoiceFormDrawer'
import { ConfettiBurst } from '../components/ui/ConfettiBurst'

export function InvoiceDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { getInvoiceById, deleteInvoice, markAsPaid, updateInvoice } = useInvoices()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [confettiTick, setConfettiTick] = useState(0)

  const invoice = getInvoiceById(id)

  useEffect(() => {
    if (invoice) {
      document.title = `Invoice #${invoice.id}`
    }
  }, [invoice])

  const amountDue = useMemo(() => {
    if (!invoice) return 0
    return invoice.items.reduce((sum, item) => sum + item.total, 0)
  }, [invoice])

  if (!invoice) {
    return (
      <section className="rounded-xl bg-(--color-panel) p-8 text-center">
        <h1 className="text-h2">Invoice not found</h1>
        <Link to="/" className="mt-4 inline-block text-[15px] font-bold text-(--color-primary)">
          Go back to invoices
        </Link>
      </section>
    )
  }

  return (
    <section>
      <button
        className="inline-flex items-center gap-3 text-[15px] font-bold text-(--color-text-heading)"
        onClick={() => navigate(-1)}
      >
        <Icon name="chevronLeft" className="h-3 w-3 text-(--color-primary)" />
        Go Back
      </button>

      <div className="mt-8 rounded-xl bg-(--color-panel) p-6 shadow-[0_8px_20px_rgba(0,0,0,0.06)] sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-body text-(--color-text-muted)">Status</p>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <Button variant="tertiary" onClick={() => setShowEdit(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              if (invoice.status !== 'pending') return
              const result = await markAsPaid(invoice.id)
              if (result) {
                setConfettiTick(Date.now())
              }
            }}
            disabled={invoice.status !== 'pending'}
          >
            Mark as Paid
          </Button>
        </div>
      </div>

      <article className="mt-6 rounded-xl bg-(--color-panel) p-6 shadow-[0_8px_20px_rgba(0,0,0,0.06)] sm:p-8">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-h3 text-(--color-text-heading)">
              <span className="text-(--color-text-subtle)">#</span>
              {invoice.id}
            </h1>
            <p className="mt-2 text-body text-(--color-text-muted)">{invoice.description}</p>
          </div>
          <p className="text-body text-(--color-text-muted) sm:text-right">
            {invoice.senderAddress.street}
            <br />
            {invoice.senderAddress.city}
            <br />
            {invoice.senderAddress.postCode}
            <br />
            {invoice.senderAddress.country}
          </p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div className="space-y-8">
            <div>
              <p className="text-body text-(--color-text-muted)">Invoice Date</p>
              <p className="mt-2 text-h3 text-(--color-text-heading)">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <p className="text-body text-(--color-text-muted)">Payment Due</p>
              <p className="mt-2 text-h3 text-(--color-text-heading)">{formatDate(invoice.paymentDue)}</p>
            </div>
          </div>

          <div>
            <p className="text-body text-(--color-text-muted)">Bill To</p>
            <p className="mt-2 text-h3 text-(--color-text-heading)">{invoice.clientName}</p>
            <p className="mt-2 text-body text-(--color-text-muted)">
              {invoice.clientAddress.street}
              <br />
              {invoice.clientAddress.city}
              <br />
              {invoice.clientAddress.postCode}
              <br />
              {invoice.clientAddress.country}
            </p>
          </div>

          <div>
            <p className="text-body text-(--color-text-muted)">Sent to</p>
            <p className="mt-2 text-h3 text-(--color-text-heading)">{invoice.clientEmail}</p>
          </div>
        </div>

        <section className="mt-10 overflow-hidden rounded-lg bg-(--color-table)">
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-8 py-6 sm:grid">
            <p className="text-body text-(--color-text-muted)">Item Name</p>
            <p className="text-body text-(--color-text-muted)">QTY.</p>
            <p className="text-body text-(--color-text-muted)">Price</p>
            <p className="text-body text-(--color-text-muted) text-right">Total</p>
          </div>

          <div className="space-y-4 px-6 py-6 sm:px-8">
            {invoice.items.map((item) => (
              <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-3">
                <p className="text-body-variant font-bold text-(--color-text-heading)">{item.name}</p>
                <p className="text-body text-(--color-text-muted)">{item.quantity}</p>
                <p className="text-body text-(--color-text-muted)">{currency.format(item.price)}</p>
                <p className="text-body-variant text-right font-bold text-(--color-text-heading)">
                  {currency.format(item.total)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-(--color-table-total) px-6 py-8 text-white sm:px-8">
            <p className="text-body">Amount Due</p>
            <p className="text-h2">{currency.format(amountDue)}</p>
          </div>
        </section>
      </article>

      <Modal
        title="Confirm Deletion"
        description={`Are you sure you want to delete invoice #${invoice.id}? This action cannot be undone.`}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            await deleteInvoice(invoice.id)
            setShowDeleteModal(false)
            navigate('/')
          }}
        >
          Delete
        </Button>
      </Modal>

      <InvoiceFormDrawer
        open={showEdit}
        mode="edit"
        invoice={invoice}
        onClose={() => setShowEdit(false)}
        onSaveAsDraft={async () => {
          // Draft save is not available in edit mode.
        }}
        onSaveAndSend={async () => {
          // Send save is not available in edit mode.
        }}
        onSaveChanges={async (payload) => {
          await updateInvoice(invoice.id, payload)
        }}
      />

      <ConfettiBurst trigger={confettiTick} />
    </section>
  )
}
