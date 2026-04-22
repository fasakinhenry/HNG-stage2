import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface PreferencesContextValue {
  invoicesPerPage: number
  setInvoicesPerPage: (value: number) => void
}

const STORAGE_KEY = 'hng-invoice-settings'
const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined)

function readSettings(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 6
    const parsed = JSON.parse(raw) as { invoicesPerPage?: number }
    if (![5, 6, 10, 12].includes(parsed.invoicesPerPage ?? 0)) return 6
    return parsed.invoicesPerPage as number
  } catch {
    return 6
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [invoicesPerPage, setInvoicesPerPageState] = useState<number>(readSettings)

  const setInvoicesPerPage = (value: number) => {
    setInvoicesPerPageState(value)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ invoicesPerPage: value }))
  }

  const value = useMemo(
    () => ({ invoicesPerPage, setInvoicesPerPage }),
    [invoicesPerPage],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error('usePreferences must be used inside PreferencesProvider')
  }

  return context
}
