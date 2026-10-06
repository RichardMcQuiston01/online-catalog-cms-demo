# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Added a link to the live demo in the README
- Bumped `@richardmcquiston01/online-catalog-cms` to `^0.2.0`, which has a
  browser-safe entry point that bundlers pick automatically

### Removed

- The `src/shims/*` stand-ins for Node built-ins and the matching
  `resolve.alias` block in `vite.config.ts`. They are no longer needed now
  that the package ships a browser entry point without Node built-ins

### Fixed

- Image URL was silently dropped when editing a product that had no image

- Pinned `engines.node` to `22.x` instead of an open-ended `>=18.0.0` range,
  which Vercel flagged as auto-upgrading on every new Node major release

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
