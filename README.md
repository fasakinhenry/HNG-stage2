# Invoice Management App

Stage 2 frontend invoice app built with React, TypeScript, Vite, Tailwind CSS v4, and Context API.

## Features

- Create, read, update, and delete invoices
- Save invoices as draft
- Mark pending invoices as paid
- Filter invoices by status (draft, pending, paid)
- Light/dark theme toggle with persistence
- Responsive sidebar/topbar layout
- Empty state, pagination, and settings page
- Form validation for required fields, email format, and item totals
- Delete confirmation modal with keyboard support
- Confetti effect when an invoice is marked as paid

## Tech Stack

- React 19
- TypeScript
- React Router
- Tailwind CSS v4
- Context API
- LocalStorage persistence
- Bun package manager/runtime

## Setup Instructions

1. Install dependencies:

```bash
bun install
```

2. Start development server:

```bash
bun run dev
```

3. Build for production:

```bash
bun run build
```

4. Preview production build:

```bash
bun run preview
```

## Project Structure

```text
src/
  components/
    invoice/
    ui/
  context/
  layout/
  lib/
  pages/
  types/
```

## Architecture Notes

- `InvoiceContext`: central source for invoice CRUD methods and filter state. It currently uses LocalStorage and seed data, but methods are async and ready to switch to backend HTTP calls.
- `ThemeContext`: controls global light/dark mode and stores preference in LocalStorage.
- `PreferencesContext`: stores settings like invoices-per-page used by list pagination.
- `InvoiceFormDrawer`: shared form component for create and edit flows.
- `Modal`: reusable accessible modal used for delete confirmation.

## Trade-offs

- LocalStorage is used for speed and demo simplicity; this can be replaced with Node/Express API calls in `InvoiceContext`.
- The app includes practical validation and accessibility support, while keeping logic simple for beginner readability.
- Confetti is implemented with CSS animation to avoid extra libraries.

## Accessibility Notes

- Semantic elements used for page and section structure.
- Form controls are labeled with `label` + `htmlFor`.
- Interactive actions use real `button` elements.
- Delete modal supports:
  - Focus trap
  - ESC to close
  - Keyboard navigation with tab cycling
- Color variables are separated for light and dark themes.

## Improvements You Can Add Next

- Connect `InvoiceContext` methods to real backend endpoints.
- Add optimistic updates with loading/error toasts.
- Add unit tests for form validation and context reducers.
- Add stronger animation polish and route-level loading states.
