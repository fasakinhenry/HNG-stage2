import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Icon } from './Icon'

interface BaseFieldProps {
  label: string
  name: string
  error?: string
}

interface TextFieldProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {}
interface SelectFieldProps
  extends BaseFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  options: Array<{ label: string; value: string | number }>
}
interface TextAreaFieldProps
  extends BaseFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {}

function Label({ label, name }: { label: string; name: string }) {
  return (
    <label htmlFor={name} className="mb-2 block text-[13px] font-medium tracking-[-0.1px] text-(--color-text-muted)">
      {label}
    </label>
  )
}

function ErrorText({ error }: { error?: string }) {
  if (!error) return null
  return <p className="mt-1 text-[11px] font-semibold text-(--color-danger)">{error}</p>
}

const controlClass =
  'h-12 w-full rounded-md border bg-(--color-panel) px-4 text-[15px] font-bold tracking-[-0.25px] text-(--color-text-heading) transition outline-none placeholder:text-(--color-text-subtle) hover:border-(--color-primary-500) focus:border-(--color-primary)'

export function TextField({ label, name, error, className = '', ...props }: TextFieldProps) {
  return (
    <div>
      <Label label={label} name={name} />
      <input
        id={name}
        name={name}
        className={`${controlClass} ${error ? 'border-(--color-danger)' : 'border-(--color-border)'} ${className}`}
        {...props}
      />
      <ErrorText error={error} />
    </div>
  )
}

export function SelectField({ label, name, error, options, className = '', ...props }: SelectFieldProps) {
  return (
    <div>
      <Label label={label} name={name} />
      <div className="relative">
        <select
          id={name}
          name={name}
          className={`${controlClass} appearance-none pr-10 ${error ? 'border-(--color-danger)' : 'border-(--color-border)'} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-(--color-primary)"
        />
      </div>
      <ErrorText error={error} />
    </div>
  )
}

export function DateField({ label, name, error, className = '', ...props }: TextFieldProps) {
  return (
    <div>
      <Label label={label} name={name} />
      <input
        id={name}
        name={name}
        type="date"
        className={`${controlClass} ${error ? 'border-(--color-danger)' : 'border-(--color-border)'} ${className}`}
        {...props}
      />
      <ErrorText error={error} />
    </div>
  )
}

export function TextAreaField({ label, name, error, className = '', ...props }: TextAreaFieldProps) {
  return (
    <div>
      <Label label={label} name={name} />
      <textarea
        id={name}
        name={name}
        className={`min-h-24 w-full rounded-md border bg-(--color-panel) px-4 py-3 text-[15px] font-bold tracking-[-0.25px] text-(--color-text-heading) transition outline-none placeholder:text-(--color-text-subtle) hover:border-(--color-primary-500) focus:border-(--color-primary) ${error ? 'border-(--color-danger)' : 'border-(--color-border)'} ${className}`}
        {...props}
      />
      <ErrorText error={error} />
    </div>
  )
}

export function FieldRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`grid grid-cols-1 gap-6 sm:grid-cols-3 ${className}`}>{children}</div>
}
