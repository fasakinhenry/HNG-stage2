import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from './Icon'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'ghost'
  | 'newInvoice'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: 'plus'
  children: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-(--color-primary) text-white hover:bg-(--color-primary-700) focus-visible:outline-(--color-primary)',
  secondary:
    'bg-(--color-btn-secondary) text-(--color-btn-secondary-text) hover:bg-(--color-btn-secondary-hover) focus-visible:outline-(--color-primary)',
  tertiary:
    'bg-(--color-btn-tertiary) text-(--color-btn-tertiary-text) hover:bg-(--color-btn-tertiary-hover) focus-visible:outline-(--color-primary)',
  danger:
    'bg-(--color-danger) text-white hover:bg-(--color-danger-hover) focus-visible:outline-(--color-danger)',
  ghost:
    'bg-transparent text-(--color-text-muted) hover:text-(--color-text-heading) focus-visible:outline-(--color-primary)',
  newInvoice:
    'bg-(--color-primary) text-white hover:bg-(--color-primary-700) focus-visible:outline-(--color-primary) pl-2',
}

export function Button({
  variant = 'primary',
  icon,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-[15px] font-bold tracking-[-0.2px] cursor-pointer transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {icon === 'plus' ? (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-(--color-primary)">
          <Icon name="plus" className="h-3 w-3" />
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  )
}
