import type { AuthResponse } from '../types/account'
import type { Invoice, InvoicePayload } from '../types/invoice'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
const TOKEN_KEY = 'hng-api-token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

async function request<T>(path: string, init: RequestInit = {}) {
  const token = tokenStorage.get()
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({} as Record<string, unknown>)) as {
      message?: string
      errors?: Array<{ field?: string; message?: string }>
    }

    const firstValidationError = body.errors?.[0]?.message
    throw new Error(firstValidationError || body.message || `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const authApi = {
  async login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    })
  },
  async signup(name: string, email: string, password: string) {
    return request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      }),
    })
  },
  async me() {
    return request<{ user: AuthResponse['user'] }>('/auth/me')
  },
}

export const accountApi = {
  async update(payload: { name?: string; email?: string; password?: string }) {
    return request<{ user: AuthResponse['user'] }>('/account/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
  async uploadAvatar(file: File) {
    const token = tokenStorage.get()
    const form = new FormData()
    form.append('avatar', file)

    const response = await fetch(`${API_BASE}/account/me/avatar`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.message || `Request failed with status ${response.status}`)
    }

    return response.json() as Promise<{ user: AuthResponse['user'] }>
  },
}

export const invoiceApi = {
  async list() {
    return request<{ invoices: Invoice[] }>('/invoices')
  },
  async create(payload: InvoicePayload, asDraft: boolean) {
    return request<{ invoice: Invoice }>('/invoices', {
      method: 'POST',
      body: JSON.stringify({ ...payload, asDraft }),
    })
  },
  async update(id: string, payload: InvoicePayload) {
    return request<{ invoice: Invoice }>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  async remove(id: string) {
    return request<{ success: boolean }>(`/invoices/${id}`, {
      method: 'DELETE',
    })
  },
  async markPaid(id: string) {
    return request<{ invoice: Invoice }>(`/invoices/${id}/pay`, {
      method: 'PATCH',
    })
  },
}
