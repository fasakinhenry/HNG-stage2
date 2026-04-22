export function EmptyState({
  title = 'There is nothing here',
  // description = 'Create an invoice by clicking the New Invoice button and get started.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-6 py-8 text-center">
      <img src="/illustration-empty.svg" alt="No invoices" className="h-52 w-52" />
      <h2 className="mt-10 text-h2 text-(--color-text-heading)">{title}</h2>
      <p className="hidden mt-4 text-body text-(--color-text-muted) max-w-[26ch] sm:inline">Create an invoice by clicking the <span className="font-bold">New Invoice</span> button and get started.</p>
      <p className="sm:hidden mt-4 text-body text-(--color-text-muted) max-w-[26ch]">Create an invoice by clicking the <span className="font-bold">New</span> button and get started.</p>
    </div>
  )
}
