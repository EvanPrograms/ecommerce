# Passion Chocolates (E-commerce Demo)

Full-stack e-commerce demo with product browsing, cart, checkout, authentication, and reviews.

## Features

- Product catalog + product detail pages
- Guest + authenticated cart
- User auth (sign up / sign in) + password reset email flow
- Stripe Checkout session creation + webhook handling
- Order history + reviews

## Tech stack

- Frontend: React (Vite), Material UI, Apollo Client
- Backend: Node.js, Express, Apollo Server (GraphQL)
- Database: PostgreSQL (via Sequelize)
- Payments: Stripe

## Local development

### Backend

```bash
cd backend
npm install
npm run dev
```

By default the server runs on `http://localhost:5000` and GraphQL is served at `/graphql`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Environment variables

> Note: this repo ignores `.env*` files. Do not commit secrets.

### Backend (`backend/.env.development` / `backend/.env.production`)

- `DATABASE_URL`: Postgres connection string (recommended)
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`: alternative to `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_KEY`
- `WEBHOOK_SECRET`
- `CHOCOLATE_SHOP_EMAIL`
- `CHOCOLATE_SHOP_EMAIL_PASSWORD`
- `CORS_ORIGINS`: comma-separated allowed origins (example: `https://example.com,https://www.example.com`)

### Frontend (`frontend/.env.local`)

- `VITE_API_URL`: GraphQL endpoint URL (example: `http://localhost:5000/graphql` or `https://your-domain.com/graphql`)

## Deployment notes (high level)

- The frontend is a static Vite build (`frontend/dist`) that can be served by nginx, S3/CloudFront, etc.
- If serving GraphQL on the same domain as the frontend, ensure your reverse proxy routes `/graphql` to the backend.
