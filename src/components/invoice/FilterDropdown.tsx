import { useState } from 'react'
import type { InvoiceStatus } from '../../types/invoice'
import { Icon } from '../ui/Icon'

interface FilterDropdownProps {
  selected: InvoiceStatus[]
  onChange: (statuses: InvoiceStatus[]) => void
}

const options: InvoiceStatus[] = ['draft', 'pending', 'paid']

export function FilterDropdown({ selected, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)

  const toggleOption = (status: InvoiceStatus) => {
    const next = selected.includes(status)
      ? selected.filter((item) => item !== status)
      : [...selected, status]

    onChange(next)
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-3.5 text-[15px] font-bold text-(--color-text-heading)"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="hidden sm:inline">Filter by status</span>
        <span className="sm:hidden">Filter</span>
        <Icon name="chevronDown" className={`h-3 w-3 text-(--color-primary) transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-11 z-20 w-48 rounded-lg bg-(--color-panel) p-6 shadow-[0_20px_35px_rgba(0,0,0,0.15)]">
          <div className="space-y-3">
            {options.map((status) => {
              const checked = selected.includes(status)
              return (
                <label key={status} className="flex cursor-pointer items-center gap-3 text-[15px] font-bold capitalize text-(--color-text-heading)">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOption(status)}
                    className="h-4 w-4 accent-(--color-primary)"
                  />
                  {status}
                </label>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
