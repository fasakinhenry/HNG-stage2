import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/auth/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import { InvoiceProvider } from './context/InvoiceContext'
import { PreferencesProvider } from './context/PreferencesContext'
import { ThemeProvider } from './context/ThemeContext'
import { AppLayout } from './layout/AppLayout'
import { InvoiceDetailPage } from './pages/InvoiceDetailPage'
import { InvoicesPage } from './pages/InvoicesPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SettingsPage } from './pages/SettingsPage'
import { SignupPage } from './pages/SignupPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PreferencesProvider>
          <InvoiceProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<InvoicesPage />} />
                  <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
                  <Route
                    path="/settings"
                    element={(
                      <RequireAuth>
                        <SettingsPage />
                      </RequireAuth>
                    )}
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/invoices" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </InvoiceProvider>
        </PreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
