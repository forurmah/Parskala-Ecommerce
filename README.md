
# Parskala E-commerce

A modern Persian e-commerce application built with Next.js, TypeScript, and Tailwind CSS.

## 🚧 Project Status

Currently under active development.

This project is being built step by step to practice production-level frontend architecture.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- SQLite (libSQL) with Drizzle ORM
- Playwright for tests

## Current Features

### Completed

✅ Responsive homepage  
✅ Product listing  
✅ Product card component  
✅ Type-safe product data  
✅ Dynamic product pages  
✅ Product details  
✅ 404 handling  
✅ Add to cart functionality  
✅ Cart page with quantity controls  
✅ Cart persistence (localStorage)  
✅ Product search (Persian-friendly)  
✅ Category filtering  
✅ Checkout form with validation (pay on delivery)  
✅ Orders saved in a database, totals computed on the server  
✅ Sign-up, login and logout (email + password)  
✅ Order history for logged-in users  

## Screenshots

Coming soon.

## Future Improvements

- Product management dashboard (products are still in `data/products.ts`)
- Payment flow (only pay on delivery for now)
- Password reset and email verification
- Rate limiting for login attempts
- Clean up expired sessions periodically

## Installation

Clone the project and install dependencies:

```bash
git clone https://github.com/forurmah/Parskala-Ecommerce.git
cd Parskala-Ecommerce
npm install
```

Create the local database (a `local.db` file) and its tables:

```bash
npm run db:migrate
```

Start the development server and open http://localhost:3000:

```bash
npm run dev
```

## Database

Defaults to a local SQLite file, so no setup is needed. See `.env.example`
to use a hosted libSQL/Turso database instead.

- Schema: `db/schema.ts`
- After changing the schema: `npm run db:generate`, then `npm run db:migrate`
- Browse the data: `npm run db:studio`

## Project Structure

| Folder        | What lives there                                          |
| ------------- | --------------------------------------------------------- |
| `app/`        | Pages and layouts (Next.js App Router)                    |
| `components/` | UI components, grouped by feature                         |
| `actions/`    | Server actions (place order, sign up, log in, log out)    |
| `auth/`       | Password hashing, sessions, auth validation               |
| `db/`         | Database client, schema, queries and migrations           |
| `data/`       | Product catalog, shipping rules and other shared settings |
| `types/`      | Shared TypeScript types                                   |
| `tests/`      | Playwright unit and end-to-end tests                      |

## Testing

Tests use [Playwright](https://playwright.dev). The first time, download the test browser:

```bash
npx playwright install chromium
```

Then run the tests (this builds the app and starts it on port 3100, with a
separate `test.db` database that is recreated on every run):

```bash
npm test          # all tests, desktop and mobile
npm run test:ui   # interactive mode, handy for debugging
```

- `tests/unit/` checks plain functions: product search, checkout and auth
  validation, password hashing
- `tests/e2e/` drives a real browser: cart, search and filters, checkout,
  accounts, order privacy and history
