import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/Fields'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="mx-auto max-w-md rounded-xl bg-(--color-panel) p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] sm:p-8">
      <h1 className="text-h2 text-(--color-text-heading)">Login</h1>
      <p className="mt-2 text-body text-(--color-text-muted)">Access your account invoices.</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')
          try {
            await login(email, password)
            const from = (location.state as { from?: string } | null)?.from ?? '/'
            navigate(from, { replace: true })
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
          }
        }}
      >
        <TextField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="text-body text-(--color-danger)">{error}</p> : null}
        <Button type="submit" className="w-full">Login</Button>
      </form>

      <p className="mt-5 text-body text-(--color-text-muted)">
        No account?{' '}
        <Link to="/signup" className="font-bold text-(--color-primary)">
          Create one
        </Link>
      </p>
    </section>
  )
}
