import { useEffect, useMemo, useState } from 'react'
import type { Invoice, InvoiceItem, InvoicePayload } from '../../types/invoice'
import { validateInvoicePayload, type InvoiceFormErrors } from '../../lib/validation'
import { Button } from '../ui/Button'
import { DateField, FieldRow, SelectField, TextField } from '../ui/Fields'
import { Icon } from '../ui/Icon'

interface InvoiceFormDrawerProps {
  open: boolean
  mode: 'create' | 'edit'
  invoice?: Invoice
  onClose: () => void
  onSaveAsDraft: (payload: InvoicePayload) => Promise<void>
  onSaveAndSend: (payload: InvoicePayload) => Promise<void>
  onSaveChanges: (payload: InvoicePayload) => Promise<void>
}

interface FormState {
  senderStreet: string
  senderCity: string
  senderPostCode: string
  senderCountry: string
  clientName: string
  clientEmail: string
  clientStreet: string
  clientCity: string
  clientPostCode: string
  clientCountry: string
  createdAt: string
  paymentTerms: number
  description: string
  items: InvoiceItem[]
}

const paymentTermOptions = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
]

const createBlankState = (): FormState => ({
  senderStreet: '',
  senderCity: '',
  senderPostCode: '',
  senderCountry: '',
  clientName: '',
  clientEmail: '',
  clientStreet: '',
  clientCity: '',
  clientPostCode: '',
  clientCountry: '',
  createdAt: new Date().toISOString().slice(0, 10),
  paymentTerms: 30,
  description: '',
  items: [],
})

const mapInvoiceToState = (invoice: Invoice): FormState => ({
  senderStreet: invoice.senderAddress.street,
  senderCity: invoice.senderAddress.city,
  senderPostCode: invoice.senderAddress.postCode,
  senderCountry: invoice.senderAddress.country,
  clientName: invoice.clientName,
  clientEmail: invoice.clientEmail,
  clientStreet: invoice.clientAddress.street,
  clientCity: invoice.clientAddress.city,
  clientPostCode: invoice.clientAddress.postCode,
  clientCountry: invoice.clientAddress.country,
  createdAt: invoice.createdAt,
  paymentTerms: invoice.paymentTerms,
  description: invoice.description,
  items: invoice.items,
})

function toPayload(state: FormState): InvoicePayload {
  return {
    createdAt: state.createdAt,
    paymentTerms: state.paymentTerms,
    description: state.description,
    clientName: state.clientName,
    clientEmail: state.clientEmail,
    senderAddress: {
      street: state.senderStreet,
      city: state.senderCity,
      postCode: state.senderPostCode,
      country: state.senderCountry,
    },
    clientAddress: {
      street: state.clientStreet,
      city: state.clientCity,
      postCode: state.clientPostCode,
      country: state.clientCountry,
    },
    items: state.items,
  }
}

export function InvoiceFormDrawer({
  open,
  mode,
  invoice,
  onClose,
  onSaveAsDraft,
  onSaveAndSend,
  onSaveChanges,
}: InvoiceFormDrawerProps) {
  const [form, setForm] = useState<FormState>(createBlankState)
  const [errors, setErrors] = useState<InvoiceFormErrors>({})

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && invoice) {
      setForm(mapInvoiceToState(invoice))
      setErrors({})
      return
    }

    setForm(createBlankState())
    setErrors({})
  }, [mode, invoice, open])

  const itemRows = useMemo(
    () =>
      form.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      })),
    [form.items],
  )

  const updateField = (field: keyof FormState, value: string | number | InvoiceItem[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setForm((prev) => {
      const next = [...prev.items]
      const target = next[index]
      next[index] = {
        ...target,
        [field]: value,
      }
      return { ...prev, items: next }
    })
  }

  const handleNumericKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    field: 'quantity' | 'price',
    currentValue: number,
  ) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const step = field === 'price' ? 1 : 1
      updateItem(index, field, Number((currentValue + step).toFixed(2)))
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      const step = field === 'price' ? 1 : 1
      const min = field === 'quantity' ? 1 : 0
      const next = Number((currentValue - step).toFixed(2))
      if (next >= min) updateItem(index, field, next)
    }
  }

  const addItem = () => {
    updateField('items', [
      ...form.items,
      {
        id: crypto.randomUUID(),
        name: '',
        quantity: 1,
        price: 0,
        total: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    updateField(
      'items',
      form.items.filter((item) => item.id !== id),
    )
  }

  const submitValidated = async (action: 'send' | 'edit') => {
    const payload = toPayload(form)
    const validation = validateInvoicePayload(payload)
    setErrors(validation)

    if (Object.keys(validation).length > 0) {
      return
    }

    if (action === 'send') {
      await onSaveAndSend(payload)
      onClose()
      return
    }

    await onSaveChanges(payload)
    onClose()
  }

  const saveDraft = async () => {
    await onSaveAsDraft(toPayload(form))
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-20 bg-[rgba(0,0,0,0.5)]" role="presentation" onMouseDown={onClose}>
      <section
        className="h-full w-full max-w-150 rounded-r-4xl bg-(--color-page) shadow-[0_18px_50px_rgba(0,0,0,0.25)] md:pl-24 flex flex-col overflow-hidden"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* The form is the scrollable element — pr-4 keeps whitespace beside the scrollbar */}
        <form
          className="flex-1 overflow-y-auto px-6 pt-8 pb-26 sm:px-10 pr-4 sm:pr-6 min-h-0"
          onSubmit={(event) => event.preventDefault()}
        >
          <h2 className="text-h2 text-(--color-text-heading)">
            {mode === 'create' ? 'New Invoice' : `Edit #${invoice?.id ?? ''}`}
          </h2>

          <section className="mt-10 space-y-6">
            <h3 className="text-body-variant font-bold text-(--color-primary)">Bill From</h3>
            <TextField
              label="Street Address"
              name="senderStreet"
              value={form.senderStreet}
              onChange={(event) => updateField('senderStreet', event.target.value)}
              error={errors.senderStreet}
            />
            <FieldRow>
              <TextField
                label="City"
                name="senderCity"
                value={form.senderCity}
                onChange={(event) => updateField('senderCity', event.target.value)}
                error={errors.senderCity}
              />
              <TextField
                label="Post Code"
                name="senderPostCode"
                value={form.senderPostCode}
                onChange={(event) => updateField('senderPostCode', event.target.value)}
                error={errors.senderPostCode}
              />
              <TextField
                label="Country"
                name="senderCountry"
                value={form.senderCountry}
                onChange={(event) => updateField('senderCountry', event.target.value)}
                error={errors.senderCountry}
              />
            </FieldRow>
          </section>

          <section className="mt-10 space-y-6">
            <h3 className="text-body-variant font-bold text-(--color-primary)">Bill To</h3>
            <TextField
              label="Client's Name"
              name="clientName"
              value={form.clientName}
              onChange={(event) => updateField('clientName', event.target.value)}
              error={errors.clientName}
            />
            <TextField
              label="Client's Email"
              name="clientEmail"
              type="email"
              placeholder="e.g. email@example.com"
              value={form.clientEmail}
              onChange={(event) => updateField('clientEmail', event.target.value)}
              error={errors.clientEmail}
            />
            <TextField
              label="Street Address"
              name="clientStreet"
              value={form.clientStreet}
              onChange={(event) => updateField('clientStreet', event.target.value)}
              error={errors.clientStreet}
            />
            <FieldRow>
              <TextField
                label="City"
                name="clientCity"
                value={form.clientCity}
                onChange={(event) => updateField('clientCity', event.target.value)}
                error={errors.clientCity}
              />
              <TextField
                label="Post Code"
                name="clientPostCode"
                value={form.clientPostCode}
                onChange={(event) => updateField('clientPostCode', event.target.value)}
                error={errors.clientPostCode}
              />
              <TextField
                label="Country"
                name="clientCountry"
                value={form.clientCountry}
                onChange={(event) => updateField('clientCountry', event.target.value)}
                error={errors.clientCountry}
              />
            </FieldRow>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DateField
                label="Invoice Date"
                name="createdAt"
                value={form.createdAt}
                onChange={(event) => updateField('createdAt', event.target.value)}
                error={errors.createdAt}
              />
              <SelectField
                label="Payment Terms"
                name="paymentTerms"
                value={form.paymentTerms}
                onChange={(event) => updateField('paymentTerms', Number(event.target.value))}
                options={paymentTermOptions}
              />
            </div>
            <TextField
              label="Project Description"
              name="description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              error={errors.description}
              placeholder="e.g. Graphic Design Service"
            />
          </section>

          <section className="mt-10 space-y-5">
            <h3 className="text-[18px] font-bold text-(--color-text-subtle)">Item List</h3>
            <div className="space-y-4">
              {itemRows.map((item, index) => (
                /* No border, no horizontal padding — row spans full form width */
                <div key={item.id} className="flex w-full flex-col gap-3 sm:flex-row sm:items-end">
                  {/* Item Name — grows to fill available space */}
                  <div className="flex-1 min-w-0">
                    <label className="mb-2 block text-[13px] text-(--color-text-muted)">Item Name</label>
                    <input
                      name={`itemName-${item.id}`}
                      value={item.name}
                      onChange={(event) => updateItem(index, 'name', event.target.value)}
                      className="h-12 w-full rounded-md border border-(--color-border) bg-(--color-page) px-4 py-3 text-[15px] font-bold text-(--color-text-heading) focus:border-(--color-primary) focus:outline-none"
                    />
                    {errors[`itemName-${index}`] && (
                      <p className="mt-1 text-[11px] font-semibold text-(--color-danger)">{errors[`itemName-${index}`]}</p>
                    )}
                  </div>

                  {/* Qty — fixed narrow width, spinners hidden */}
                  <div className="w-full sm:w-16 sm:shrink-0">
                    <label className="mb-2 block text-[13px] text-(--color-text-muted)">Qty</label>
                    <input
                      name={`itemQty-${item.id}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateItem(index, 'quantity', Number(event.target.value))}
                      onKeyDown={(event) => handleNumericKeyDown(event, index, 'quantity', item.quantity)}
                      className="h-12 w-full rounded-md border border-(--color-border) bg-(--color-page) px-3 py-3 text-[15px] font-bold text-(--color-text-heading) focus:border-(--color-primary) focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    {errors[`itemQty-${index}`] && (
                      <p className="mt-1 text-[11px] font-semibold text-(--color-danger)">{errors[`itemQty-${index}`]}</p>
                    )}
                  </div>

                  {/* Price — fixed width, spinners hidden */}
                  <div className="w-full sm:w-24 sm:shrink-0">
                    <label className="mb-2 block text-[13px] text-(--color-text-muted)">Price</label>
                    <input
                      name={`itemPrice-${item.id}`}
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.price}
                      onChange={(event) => updateItem(index, 'price', Number(event.target.value))}
                      onKeyDown={(event) => handleNumericKeyDown(event, index, 'price', item.price)}
                      className="h-12 w-full rounded-md border border-(--color-border) bg-(--color-page) px-3 py-3 text-[15px] font-bold text-(--color-text-heading) focus:border-(--color-primary) focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    {errors[`itemPrice-${index}`] && (
                      <p className="mt-1 text-[11px] font-semibold text-(--color-danger)">{errors[`itemPrice-${index}`]}</p>
                    )}
                  </div>

                  {/* Total — read-only display */}
                  <div className="w-full sm:w-20 sm:shrink-0">
                    <p className="mb-2 text-[13px] text-(--color-text-muted)">Total</p>
                    <p className="h-12 rounded-md bg-(--color-bg-muted) px-3 py-3 text-[15px] font-bold text-(--color-text-muted) flex items-center">
                      {item.total.toFixed(2)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="flex h-12 w-full items-center justify-center rounded-md text-(--color-text-subtle) transition hover:text-(--color-danger) sm:w-10 sm:shrink-0"
                    aria-label="Delete item"
                  >
                    <Icon name="delete" />
                  </button>
                </div>
              ))}
            </div>
            {errors.items ? <p className="text-[11px] font-semibold text-(--color-danger)">{errors.items}</p> : null}
            <Button type="button" variant="tertiary" className="w-full flex items-center justify-center" onClick={addItem}>
              <span className='font-bold text-xl pr-1 '>+</span> Add New Item
            </Button>
          </section>
        </form>

        <footer className="fixed bottom-0 left-0 right-0 flex h-23 items-center justify-between border-t border-(--color-border) bg-(--color-panel) px-6 sm:px-10 md:pl-34 md:pr-6 md:max-w-150 md:rounded-r-3xl">
          {mode === 'create' ? (
            <>
              <Button type="button" variant="ghost" onClick={onClose}>
                Discard
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={saveDraft}>
                  Save as Draft
                </Button>
                <Button type="button" variant="primary" onClick={() => void submitValidated('send')}>
                  Save & Send
                </Button>
              </div>
            </>
          ) : (
            <>
              <span />
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="button" variant="primary" onClick={() => void submitValidated('edit')}>
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </footer>
      </section>
    </div>
  )
}