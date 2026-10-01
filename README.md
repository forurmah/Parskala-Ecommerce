
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
✅ Checkout form with validation (demo, pay on delivery)  

### In Progress

🚧 Authentication  
🚧 Backend integration  

## Screenshots

Coming soon.

## Future Improvements

- User authentication
- Database integration
- Product management dashboard
- Payment flow
- Order history

## Installation

Clone the project and install dependencies:

```bash
git clone https://github.com/forurmah/Parskala-Ecommerce.git
cd Parskala-Ecommerce
npm install
```

Start the development server and open http://localhost:3000:

```bash
npm run dev
```

## Testing

Tests use [Playwright](https://playwright.dev). The first time, download the test browser:

```bash
npx playwright install chromium
```

Then run the tests (this builds the app and starts it on port 3100):

```bash
npm test          # all tests, desktop and mobile
npm run test:ui   # interactive mode, handy for debugging
```

- `tests/unit/` checks plain functions: product search and checkout validation
- `tests/e2e/` drives a real browser: cart, search and filters, checkout
