import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { InvoiceProvider } from './context/InvoiceContext'
import { PreferencesProvider } from './context/PreferencesContext'
import { ThemeProvider } from './context/ThemeContext'
import { AppLayout } from './layout/AppLayout'
import { InvoiceDetailPage } from './pages/InvoiceDetailPage'
import { InvoicesPage } from './pages/InvoicesPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <InvoiceProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<InvoicesPage />} />
                <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/invoices" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </InvoiceProvider>
      </PreferencesProvider>
    </ThemeProvider>
  )
}

export default App
