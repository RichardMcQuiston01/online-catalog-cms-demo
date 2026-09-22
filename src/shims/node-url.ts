/**
 * Browser stand-in for `node:url`'s `fileURLToPath`, pulled in statically by
 * the online-catalog-cms bundle. The SQL adapters call this eagerly at
 * module load time (to compute a `__dirname` used only for locating their
 * migration files), so it must return a value rather than throw — this demo
 * never touches those adapters, so the returned path is never read.
 */
export function fileURLToPath(): string {
  return '/';
}
