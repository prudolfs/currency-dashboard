# 💰 Currency Dashboard

A modern Next.js app that displays balance data per currency, featuring search, sorting, and 2FA-protected login using `next-auth`.

---

## ✨ Features

- 🔐 Authentication with `next-auth`
- 🔢 2FA (OTP verification) with custom API route
- 📊 Dashboard with:
  - Search by currency code
  - Sort by total balance or number of balances
- 🔎 Per-currency detail pages with balance breakdown
- ⚙️ React Query for efficient data fetching and caching
- 🧠 Clean file structure with `lib/`, `types/`, and dynamic routing

---

---

## 🏗️ Architecture & Decisions

This project is intentionally kept lean and modular, favoring clarity and maintainability:

- 🧩 **React Query** is used for remote data fetching and caching. It covers most of the state needs via hooks like `useFilteredSortedBalances`.
- 🚫 **Zustand or other global state libraries** were considered but skipped, as there's no complex cross-page state sharing. All state is local or derived from React Query caches.
- 📄 **MockAPI endpoints** serve a limited dataset (~100 items), so:
  - No need for list virtualization
  - Full client-side filtering and sorting are performant and sufficient
- 🔐 **Authentication logic** (2FA, session handling) is scoped to the `/auth` routes and API handlers to keep auth concerns isolated.
- 📂 App uses **feature-based file structure**, e.g. all hooks in `/lib/hooks`, shared types in `/types`, and route-specific logic co-located in `/app`.

This setup allows for future enhancements (pagination, SSR, real API integration) without major refactoring.

## 📁 File Structure

```
/app
  /auth
    /signin         → login page
    /verify-otp     → 2FA verification page
  /balances
    /[id]           → balance detail page
  /dashboard        → main dashboard page
  /api
    [...nextauth]   → next-auth config route
    verify-otp      → custom OTP verification
/lib
  /api              → API logic and data merging
  /hooks            → custom React Query + filter/sort hooks
/types              → shared TypeScript types
```

---

## 🧪 Tech Stack

- [Next.js 15 (App Router)](https://nextjs.org)
- [React Query](https://tanstack.com/query/latest)
- [NextAuth.js](https://next-auth.js.org)
- Tailwind CSS + HeroUI
- TypeScript

---

## 👀 Preview App

https://currency-dashboard-eight.vercel.app

## 🚀 Getting Started

```bash
git clone git@github.com:prudolfs/currency-dashboard.git
cd currency-dashboard
pnpm install
pnpm dev
```

Create a `.env.local` file:

```env
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 🔐 Authentication Flow

1. `/auth/signin` – Sign in using credentials
2. `/auth/verify-otp` – User enters 2FA code (via `/api/verify-otp`)
3. Session handled by `next-auth` via `/api/auth/[...nextauth]`

---

## 📦 Mock API

Uses [MockAPI.io](https://mockapi.io/) to fetch:

- `/currencies` → `id`, `code`, `symbol`
- `/balances` → `id`, `amount`, `currency_id`

Data is merged client-side into grouped currency records.

---

## 📄 License

MIT
