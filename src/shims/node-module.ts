/**
 * Browser stand-in for `node:module`'s `createRequire`, pulled in statically
 * by the online-catalog-cms bundle for its server-only database adapters.
 * Never actually invoked by this demo — see vite.config.ts.
 */
export function createRequire(): never {
  throw new Error(
    'createRequire() is not available in the browser build of online-catalog-cms-demo.'
  );
}
