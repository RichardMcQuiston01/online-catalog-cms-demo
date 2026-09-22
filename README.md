# Online Catalog CMS Demo

## Overview

Single Page Application (SPA) demo demonstrating the features of the
[`online-catalog-cms`](https://github.com/RichardMcQuiston01/online-catalog-cms)
NPM package (`@richardmcquiston01/online-catalog-cms`). Built with Vite,
TypeScript, and Tailwind CSS, and deployable to Vercel.

The demo runs entirely in the browser: it composes the package's
`OnlineCatalog` class with a small `InMemoryAdapter` (localStorage-backed) so
there is no server or database to stand up. It includes:

- A product listing page with search, category, and price filters (`index.html`)
- A create/edit form with a contenteditable rich-text toolbar (`editor.html`)
- WCAG 2.1 AA accessibility: skip link, `aria-live` status regions, visible
  focus indicators, and sufficient color contrast

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

```sh
npm install
```

### Usage

```sh
npm run dev        # start the Vite dev server
npm run build       # type-check, then build the static site to dist/
npm run preview     # preview the production build locally
npm run typecheck   # type-check without emitting
npm run format      # check formatting with Prettier
```

### Examples

Open the dev server (default `http://localhost:5173`), then:

1. Visit the home page to browse the seeded categories (Electronics,
   Clothing, Books) — the product list starts empty.
2. Click **+ Add Product**, fill in a name and price (in cents), and save —
   you're redirected back to the product grid with your new card.
3. Click **Edit** on a card to update it, or **Delete** to remove it.

All data is stored in `localStorage`, so it persists across reloads but is
local to your browser.

### Deploying to Vercel

This repo includes a `vercel.json` and is auto-detected as a Vite project.
To deploy: import the repository in the Vercel dashboard, or run
`vercel --prod` from this directory with the Vercel CLI. No environment
variables are required.

## Buy Me a Coffee

If this app, code, or repository has helped you or someone you know, please consider donating. I appreciate any help to offset the costs of development and/or AI Credits.

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

## License

Apache 2

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
