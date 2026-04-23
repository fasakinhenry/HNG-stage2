# Invoice Management App

Stage 2 invoice app with a React frontend and a Node.js/Express/MongoDB backend.

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
- JWT auth (signup/login/me)
- Account editing and avatar upload
- MongoDB-backed invoice persistence with seed script
- Profile menu exposes Login and Sign Up for guests
- Guest mode uses LocalStorage invoices as fallback
- Signed-in mode uses account invoices from API

## Tech Stack

- React 19
- TypeScript
- React Router
- Tailwind CSS v4
- Context API
- LocalStorage fallback when API is unavailable
- Bun package manager/runtime

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT auth + bcrypt password hashing
- Multer avatar uploads
- express-validator, helmet, cors, morgan

## Setup Instructions

1. Install frontend dependencies:

```bash
bun install
```

2. Install backend dependencies:

```bash
cd api
npm install
```

3. Configure environment files:

- Frontend: create `.env` from `.env.example`
- Backend: create `api/.env` from `api/.env.example`

4. Seed backend database (optional but recommended):

```bash
cd api
npm run seed
```

5. Start backend API:

```bash
cd api
npm run dev
```

6. Start frontend app:

```bash
bun run dev
```

7. Build frontend for production:

```bash
bun run build
```

8. Preview frontend production build:

```bash
bun run preview
```

## API Base URL

- Frontend uses `VITE_API_URL`.
- Default: `http://localhost:5000/api`

## Auth and Data Flow

- Guest user:
  - Click profile avatar and continue without login.
  - Invoice data is loaded from LocalStorage fallback.
- Signed-in user:
  - Click profile avatar and go to Login or Sign Up.
  - After authentication, app switches to account invoices from API.
  - CRUD operations run against MongoDB for that user account.

## Seed Account

- Email: `demo@invoice.app`
- Password: `password123`

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

api/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    utils/
  seeds/
  uploads/avatars/
```

## Architecture Notes

- `InvoiceContext`: central source for invoice CRUD methods and filter state. It uses backend APIs when available and falls back to LocalStorage.
- `AuthContext`: handles signup/login/logout/me, account update, and avatar upload.
- `ThemeContext`: controls global light/dark mode and stores preference in LocalStorage.
- `PreferencesContext`: stores settings like invoices-per-page used by list pagination.
- `InvoiceFormDrawer`: shared form component for create and edit flows.
- `Modal`: reusable accessible modal used for delete confirmation.
- Backend route groups:
  - `/api/auth`
  - `/api/account`
  - `/api/invoices`

## Trade-offs

- API route guards are JWT-based and ready for production hardening.
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

- Add refresh tokens and token rotation.
- Add role-based access and admin routes.
- Add automated tests for backend controllers and auth middleware.
- Move avatar files to cloud object storage (Cloudinary/S3).
