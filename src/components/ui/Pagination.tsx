import { Button } from './Button'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="mt-7 flex items-center justify-center gap-2" aria-label="Invoice pagination">
      <Button
        variant="secondary"
        type="button"
        className="h-10 px-4"
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
      >
        Previous
      </Button>
      <p className="px-3 text-[13px] font-bold text-(--color-text-muted)">
        Page {page} of {totalPages}
      </p>
      <Button
        variant="secondary"
        type="button"
        className="h-10 px-4"
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </nav>
  )
}
