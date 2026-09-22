/**
 * Browser stand-in for `node:stream/promises`' `pipeline`, pulled in
 * statically by the online-catalog-cms bundle for its server-only
 * LocalStorageAdapter. Never actually invoked by this demo — see
 * vite.config.ts.
 */
export function pipeline(): never {
  throw new Error(
    'pipeline() is not available in the browser build of online-catalog-cms-demo.'
  );
}
