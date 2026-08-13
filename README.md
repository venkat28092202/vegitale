# Vegitale — Monthly Vegetable Subscription

A full-stack starter for a vegetable subscription delivery business: React + Tailwind
frontend, FastAPI + PostgreSQL backend, JWT/OTP auth, and a Razorpay-ready payments layer.

```
vegitale/
├── frontend/     React + Vite + Tailwind (customer site)
├── backend/      FastAPI + SQLAlchemy (API)
└── docker-compose.yml   Postgres + backend for local dev
```

## What's built (Phase 1 + 2 of the roadmap)

- **Landing page** — hero, pincode checker, "harvest cycle" explainer, subscription
  plan cards, trust badges, testimonials.
- **Product catalogue page** — category filters, mock product grid.
- **Subscription builder** — pick a box + delivery frequency.
- **Cart & checkout summary** (client-side demo state).
- **OTP login flow** (UI, wired to a real backend endpoint).
- **Customer dashboard** — active plan, pause/skip/cancel, delivery history.
- **Backend API** — full schema (users, addresses, categories, products, cart,
  subscription plans, subscriptions, subscription items, orders, order items,
  payments, deliveries), JWT + OTP auth, Razorpay order-creation/verification/
  webhook endpoints, and an admin router for order & delivery status management.

## Run it locally

### 1. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # fill in a JWT_SECRET and (optional for now) Razorpay keys

# Easiest: start Postgres via Docker
docker compose up -d db   # run from the repo root

python seed.py             # creates categories, products, plans, and a demo admin user
uvicorn app.main:app --reload
```

API docs (Swagger) will be live at **http://localhost:8000/docs**.

> No Docker? Set `DATABASE_URL=sqlite:///./vegitale.db` in `.env` for a
> zero-setup local database — fine for development, swap to Postgres before
> you deploy.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit **http://localhost:5173**.

The frontend currently uses local mock data on most pages (catalogue,
subscription builder, cart) so you can preview the UI without the backend
running. Wiring it to the live API is the first thing to do in Phase 3 below.

## Payments (Razorpay)

Sign up for a [Razorpay](https://razorpay.com) account, grab your test API
keys from the dashboard, and put them in `backend/.env`:

```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

`POST /payments/create-order` creates a Razorpay order for an existing
Vegitale order; the frontend then opens Razorpay's Checkout widget with the
returned `razorpay_order_id`, and `POST /payments/verify` confirms the
signature server-side. `POST /payments/webhook` handles async events like
failed recurring charges for dunning/retry logic.

## Roadmap (matching the original 10-phase plan)

| Phase | Status |
|---|---|
| 1. UI / design system | ✅ done — landing, catalogue, subscription, cart, login, dashboard |
| 2. Products + categories | ✅ backend models + endpoints done, frontend uses mock data |
| 3. Cart + checkout | 🔄 backend endpoints exist — wire frontend to real API |
| 4. Customer accounts | ✅ OTP + JWT auth backend done — wire frontend login flow to it |
| 5. Monthly subscriptions | ✅ backend done — wire frontend subscription builder to it |
| 6. Razorpay | ✅ backend endpoints ready — add Checkout widget in frontend |
| 7. Automatic recurring orders | ⏳ needs a scheduled job (cron / Celery beat) that generates an `Order` from each active `Subscription` on its cutoff day |
| 8. Admin dashboard | 🔄 backend endpoints done — no admin UI yet |
| 9. Delivery management | 🔄 backend endpoints done (`/admin/deliveries/today`) — no driver-facing UI yet |
| 10. Production deployment | ⏳ Dockerfile + docker-compose included; add Vercel (frontend) + Render (backend + managed Postgres) config when ready |

Tell me which phase to build next and I'll pick it up from here.
