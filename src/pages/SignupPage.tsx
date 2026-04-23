import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/Fields'
import { useAuth } from '../context/AuthContext'

export function SignupPage() {
  const navigate = useNavigate()
  const { user, signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="mx-auto max-w-md rounded-xl bg-(--color-panel) p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] sm:p-8">
      <h1 className="text-h2 text-(--color-text-heading)">Sign Up</h1>
      <p className="mt-2 text-body text-(--color-text-muted)">Create an account for cloud invoices.</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')

          if (name.trim().length < 2) {
            setError('Name must be at least 2 characters')
            return
          }

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Valid email is required')
            return
          }

          if (password.trim().length < 6) {
            setError('Password must be at least 6 characters')
            return
          }

          try {
            await signup(name, email, password)
            navigate('/', { replace: true })
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign up failed')
          }
        }}
      >
        <TextField
          label="Name"
          name="name"
          required
          minLength={2}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="text-body text-(--color-danger)">{error}</p> : null}
        <Button type="submit" className="w-full">Create Account</Button>
      </form>

      <p className="mt-5 text-body text-(--color-text-muted)">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-(--color-primary)">
          Login
        </Link>
      </p>
    </section>
  )
}
