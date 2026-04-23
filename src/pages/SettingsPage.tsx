import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/Fields'
import { useAuth } from '../context/AuthContext'
import { usePreferences } from '../context/PreferencesContext'
import { SelectField } from '../components/ui/Fields'

export function SettingsPage() {
  const { invoicesPerPage, setInvoicesPerPage } = usePreferences()
  const { user, logout, updateAccount, uploadAvatar } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const avatarPreview = user?.avatarUrl
    ? user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:5000'}${user.avatarUrl}`
    : 'https://i.pravatar.cc/120?img=32'

  useEffect(() => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
  }, [user])

  if (!user) {
    return null
  }

  return (
    <section className="space-y-6 rounded-xl bg-(--color-panel) p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] sm:p-8">
      <h1 className="text-h2 text-(--color-text-heading)">Settings</h1>
      <p className="text-body text-(--color-text-muted)">
        Choose how many invoices you want to see per page.
      </p>

      <div className="max-w-sm">
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

      <div className="border-t border-(--color-border) pt-6">
        <h2 className="text-h3 text-(--color-text-heading)">Account</h2>

        <div className="mt-4 max-w-md space-y-4">
          <div className="flex items-center gap-4">
            <img src={avatarPreview} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-(--color-btn-secondary) px-4 py-2 text-[13px] font-bold text-(--color-btn-secondary-text) hover:bg-(--color-btn-secondary-hover)">
              Upload Avatar
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  try {
                    await uploadAvatar(file)
                    setMessage('Avatar updated')
                  } catch (error) {
                    setMessage(error instanceof Error ? error.message : 'Avatar upload failed')
                  }
                }}
              />
            </label>
          </div>

          <TextField
            label="Name"
            name="name"
            value={name || user.name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email || user.email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="New Password (optional)"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={async () => {
                const finalName = (name || user.name).trim()
                const finalEmail = (email || user.email).trim()

                if (finalName.length < 2) {
                  setMessage('Name must be at least 2 characters')
                  return
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmail)) {
                  setMessage('Please enter a valid email')
                  return
                }

                if (password && password.trim().length < 6) {
                  setMessage('Password must be at least 6 characters')
                  return
                }

                try {
                  await updateAccount({
                    name: finalName,
                    email: finalEmail,
                    ...(password ? { password: password.trim() } : {}),
                  })
                  setPassword('')
                  setMessage('Account updated')
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : 'Update failed')
                }
              }}
            >
              Save Account
            </Button>
            <Button type="button" variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {message ? <p className="mt-3 text-body text-(--color-text-muted)">{message}</p> : null}
      </div>
    </section>
  )
}
