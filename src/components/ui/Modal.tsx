import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  title: string
  description: string
  open: boolean
  onClose: () => void
  children: ReactNode
}

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, details, [tabindex]:not([tabindex="-1"])'

export function Modal({ title, description, open, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const dialog = dialogRef.current
    const focusable = dialog?.querySelectorAll<HTMLElement>(focusableSelector)
    const first = focusable?.[0]
    const last = focusable?.[focusable.length - 1]

    first?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'Tab' && first && last) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.55)] px-6"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-lg bg-(--color-panel) p-8 shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="dialog-title" className="text-h2 text-(--color-text-heading)">
          {title}
        </h2>
        <p id="dialog-description" className="mt-3 text-body text-(--color-text-muted)">
          {description}
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">{children}</div>
      </div>
    </div>
  )
}
