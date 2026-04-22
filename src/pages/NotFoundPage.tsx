import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'

export function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl bg-(--color-panel) p-8 text-center">
      <img src="/illustration-empty2.svg" alt="404 illustration" />
      <h1 className="text-h2 text-(--color-text-heading)">Page not found</h1>
      <p className="mt-2 text-body text-(--color-text-muted)">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="underline mt-4 flex justify-between items-center gap-1 text-[16px] font-bold text-(--color-primary)">
        Go to invoices <Icon name="chevronRight" className="h-3 w-3 mb-0.5" />
      </Link>
    </section>
  )
}
