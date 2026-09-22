/**
 * Browser stand-in for the `node:crypto` named export the online-catalog-cms
 * bundle imports for its server-only database adapters. Those code paths are
 * never invoked by this demo (it uses its own InMemoryAdapter), but the
 * bundler still needs `randomUUID` to resolve at build time.
 */
export function randomUUID(): string {
  return crypto.randomUUID();
}
