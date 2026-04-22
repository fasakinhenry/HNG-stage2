import { Link } from 'react-router-dom'
import { currency, formatDate } from '../../lib/helpers'
import type { Invoice } from '../../types/invoice'
import { StatusBadge } from '../ui/StatusBadge'
import { Icon } from '../ui/Icon'

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Link
      to={`/invoices/${invoice.id}`}
      className="grid grid-cols-2 items-center gap-4 rounded-lg border border-transparent bg-(--color-panel) px-6 py-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] transition hover:border-(--color-primary) md:grid-cols-[1fr_1fr_1fr_1fr_auto]"
    >
      <p className="text-[15px] font-bold tracking-[-0.25px] text-(--color-text-heading)">
        <span className="text-(--color-text-subtle)">#</span>
        {invoice.id}
      </p>
      <p className="text-[13px] text-(--color-text-muted)">Due {formatDate(invoice.paymentDue)}</p>
      <p className="truncate text-[13px] text-(--color-text-muted) md:text-[15px]">{invoice.clientName}</p>
      <p className="text-[15px] font-bold tracking-[-0.25px] text-(--color-text-heading)">
        {currency.format(invoice.total)}
      </p>
      <div className="col-span-2 ml-auto inline-flex items-center gap-4 md:col-span-1">
        <StatusBadge status={invoice.status} />
        <Icon name="chevronRight" className="hidden h-3 w-3 text-(--color-primary) md:block" />
      </div>
    </Link>
  )
}
