import type { InvoiceStatus } from '../../types/invoice'

const statusClasses: Record<InvoiceStatus, string> = {
  paid: 'bg-[rgba(51,214,159,0.12)] text-(--color-status-paid)',
  pending: 'bg-[rgba(255,143,0,0.12)] text-(--color-status-pending)',
  draft: 'bg-(--color-status-draft-bg) text-(--color-status-draft)',
}

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex min-w-26 items-center justify-center gap-2 rounded-md px-4 py-3 text-[13px] font-bold tracking-[-0.25px] capitalize ${statusClasses[status]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}
