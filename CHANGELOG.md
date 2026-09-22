# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-09-22

### Added

- Initial demo app, moved out of `online-catalog-cms`'s `demo/` directory
  and rebuilt as a standalone Vite + TypeScript + Tailwind CSS SPA
- Product listing page (`index.html`) with search, category, and price
  filters, and a create/edit page (`editor.html`) with a contenteditable
  rich-text toolbar, ported to TypeScript and wired through the published
  `@richardmcquiston01/online-catalog-cms` package's `OnlineCatalog` class
- `InMemoryAdapter`, a browser-only `DatabaseAdapter` implementation backed
  by `localStorage`, since there is no server or database in this SPA
- Floating "Support this project" donate card (bottom-right, dismissible)
  with a Stripe QR code, on both pages
- `vercel.json` for one-click Vercel deployment of the Vite build output
- WCAG 2.1 AA accessibility carried over from the original demo: skip
  link, `aria-live` status regions, visible focus indicators, sufficient
  color contrast

[0.1.0]: https://github.com/RichardMcQuiston01/online-catalog-cms-demo/releases/tag/v0.1.0
