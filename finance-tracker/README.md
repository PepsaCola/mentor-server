# Personal Finance Tracker

A small standalone app for tracking income/expenses, importing bank statement CSVs, and viewing spending on a dashboard. Lives inside this repo as its own project — it doesn't share any code with the rest of `mentor-server`.

## Stack

- **Backend**: Express + Prisma + PostgreSQL, JWT auth
- **Frontend**: React (Vite), react-router, recharts
- **DB**: PostgreSQL via Docker Compose

## Setup

### 1. Start Postgres

```bash
cd finance-tracker
docker compose up -d
```

### 2. Backend

```bash
cd server
cp .env.example .env   # adjust SECRET_KEY if you want
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev             # http://localhost:4000
```

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Using it

1. Register an account, then log in.
2. **Transactions** — add income/expenses manually.
3. **Import CSV** — upload a bank statement (a sample is at `server/docs/sample-bank-statement.csv`). Pick the date format that matches your file, review the auto-detected categories, adjust if needed, then confirm.
4. **Dashboard** — see totals, spending by category, and balance over time, filterable by date range.

## Notes

- Category auto-matching on CSV import is keyword-based (see `server/prisma/seed.js` for the default keyword lists) — no ML involved.
- `npx prisma studio` is handy for poking at the database directly.
