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
        className="h-full w-full max-w-150 overflow-y-scroll rounded-r-4xl bg-(--color-page) pb-26 shadow-[0_18px_50px_rgba(0,0,0,0.25)] md:pl-24"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <form className="px-6 pt-8 sm:px-10 overflow-y-auto" onSubmit={(event) => event.preventDefault()}>
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
            <FieldRow className="sm:grid-cols-2">
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
            </FieldRow>
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
            <h3 className="text-h2 text-(--color-text-subtle)">Item List</h3>
            <div className="space-y-4">
              {itemRows.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-(--color-border) p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_0.6fr_1fr_1fr_auto] sm:items-end">
                    <TextField
                      label="Item Name"
                      name={`itemName-${item.id}`}
                      value={item.name}
                      onChange={(event) => updateItem(index, 'name', event.target.value)}
                      error={errors[`itemName-${index}`]}
                    />
                    <TextField
                      label="Qty"
                      name={`itemQty-${item.id}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateItem(index, 'quantity', Number(event.target.value))}
                      error={errors[`itemQty-${index}`]}
                    />
                    <TextField
                      label="Price"
                      name={`itemPrice-${item.id}`}
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.price}
                      onChange={(event) => updateItem(index, 'price', Number(event.target.value))}
                      error={errors[`itemPrice-${index}`]}
                    />
                    <div>
                      <p className="mb-2 text-[13px] text-(--color-text-muted)">Total</p>
                      <p className="h-12 rounded-md border border-(--color-border) bg-(--color-bg-muted) px-4 py-3 text-[15px] font-bold text-(--color-text-muted)">
                        {item.total.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="h-12 w-12 rounded-md text-(--color-text-subtle) cursor-pointer transition hover:text-(--color-danger)"
                      aria-label="Delete item"
                    >
                      <Icon name="delete" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {errors.items ? <p className="text-[11px] font-semibold text-(--color-danger)">{errors.items}</p> : null}
            <Button type="button" variant="tertiary" icon="plus" className="w-full" onClick={addItem}>
              Add New Item
            </Button>
          </section>
        </form>

        <footer className="fixed bottom-0 left-0 right-0 flex h-23 items-center justify-between border-t border-(--color-border) bg-(--color-panel) px-6 sm:px-10 md:max-w-150 md:rounded-r-3xl">
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
