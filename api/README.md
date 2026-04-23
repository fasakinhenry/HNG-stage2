# Stage2 API

Express + MongoDB backend for the invoice app.

## Vercel Deployment

This API is configured for Vercel serverless using [vercel.json](vercel.json) and [src/vercel.js](src/vercel.js).

1. In Vercel, import this `api` folder as a separate project.
2. Set Root Directory to `api` (if importing monorepo root).
3. Add Environment Variables in Vercel:

- `NODE_ENV=production`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `CLIENT_ORIGIN=https://your-frontend-domain.vercel.app`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`

4. Deploy.

After deployment, update your frontend `VITE_API_URL` to your Vercel API URL, for example:

`https://your-api-project.vercel.app/api`

## Setup

1. Copy environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Seed database:

```bash
npm run seed
```

4. Start API in development:

```bash
npm run dev
```

## Cloudinary Avatar Uploads

- Avatar files are uploaded directly to Cloudinary.
- Local disk storage is not used.
- Previous avatar is removed from Cloudinary on each replacement.

## Endpoints

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/account/me`
- `POST /api/account/me/avatar`
- `GET /api/invoices`
- `GET /api/invoices/:id`
- `POST /api/invoices`
- `PUT /api/invoices/:id`
- `PATCH /api/invoices/:id/pay`
- `DELETE /api/invoices/:id`

All `/api/account` and `/api/invoices` routes require `Authorization: Bearer <token>`.
