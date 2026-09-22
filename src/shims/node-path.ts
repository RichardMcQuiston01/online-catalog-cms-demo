/**
 * Browser stand-in for `node:path`, pulled in statically by the
 * online-catalog-cms bundle. `join()` is called eagerly at module load time
 * by the SQL adapters (to build a migration file path this demo never
 * reads), so it must return a value rather than throw. `resolve`/`extname`
 * are only used inside adapter methods this demo never calls.
 */
export function join(): string {
  return '/';
}

function unavailable(name: string): never {
  throw new Error(
    `path.${name}() is not available in the browser build of online-catalog-cms-demo.`
  );
}

export function resolve(): string {
  return unavailable('resolve');
}

export function extname(): string {
  return unavailable('extname');
}
