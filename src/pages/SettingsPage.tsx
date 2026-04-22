import { usePreferences } from '../context/PreferencesContext'
import { SelectField } from '../components/ui/Fields'

export function SettingsPage() {
  const { invoicesPerPage, setInvoicesPerPage } = usePreferences()

  return (
    <section className="rounded-xl bg-(--color-panel) p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] sm:p-8">
      <h1 className="text-h2 text-(--color-text-heading)">Settings</h1>
      <p className="mt-2 text-body text-(--color-text-muted)">
        Choose how many invoices you want to see per page.
      </p>

      <div className="mt-8 max-w-sm">
        <SelectField
          label="Invoices per page"
          name="invoicesPerPage"
          value={invoicesPerPage}
          onChange={(event) => setInvoicesPerPage(Number(event.target.value))}
          options={[
            { label: '5 invoices', value: 5 },
            { label: '6 invoices', value: 6 },
            { label: '10 invoices', value: 10 },
            { label: '12 invoices', value: 12 },
          ]}
        />
      </div>
    </section>
  )
}
