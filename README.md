# Online Catalog CMS Demo

## Overview

This demo shows how the
[`online-catalog-cms`](https://github.com/RichardMcQuiston01/online-catalog-cms)
package works (`@richardmcquiston01/online-catalog-cms` on NPM). That package
helps you manage an online product catalog.

The demo is a single-page website that runs fully in your browser. It does not
need a server or a database. Your products are saved in your browser's
`localStorage`, so only you can see them. It is built with Vite, TypeScript,
and Tailwind CSS, and it can be deployed to Vercel.

What you can do in the demo:

- Browse products on the home page (`index.html`). You can search by name or
  SKU, pick a category, and filter by price.
- Add and edit products on the editor page (`editor.html`). The form has a
  rich-text toolbar for the description and an optional image URL.
- Use it with a keyboard or screen reader. The pages follow the WCAG 2.1 AA
  accessibility rules: a skip link, live status messages, clear focus outlines,
  and strong color contrast.

## Getting Started

### Prerequisites

- Node.js 22.x. Run `node -v` to check. This matches the Vercel deployment and
  is set in the `engines` field of `package.json`.
- npm (it comes with Node.js)

### Installation

```sh
npm install
```

### Usage

```sh
npm run dev         # start the Vite dev server
npm run build       # type-check, then build the site into dist/
npm run preview     # preview the production build locally
npm run typecheck   # type-check without building
npm run format      # check formatting with Prettier
npm run format:fix  # fix formatting with Prettier
```

### Examples

Start the dev server with `npm run dev`, then open
`http://localhost:5173` and try this:

1. Look at the home page. The categories (Electronics, Clothing, and Books)
   are already there, but the product list starts empty.
2. Click **+ Add Product**. Enter a name and a price in cents. For example,
   `1999` means $19.99. You can also add an image URL, which is optional.
3. Click **Save product**. You will go back to the home page and see your new product
   card.
4. Click **Edit** on a card to change it, or **Delete** to remove it.

Your data is saved in your browser's `localStorage`. It stays after you reload
the page, but it never leaves your browser. To start over, clear this site's
data in your browser settings.

### Deploying to Vercel

This repo includes a `vercel.json` file, and Vercel detects it as a Vite
project. You do not need any environment variables.

1. Import the repository in the Vercel dashboard.
2. Click **Deploy**.

You can also run `vercel --prod` from this folder if you use the Vercel CLI.

## Buy Me a Coffee

If this app, code, or repository has helped you or someone you know, please consider donating. I appreciate any help to offset the costs of development and/or AI Credits.

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

## License

Apache License 2.0. See [LICENSE](LICENSE).

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
