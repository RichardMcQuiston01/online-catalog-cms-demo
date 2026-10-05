/**
 * Browser stand-in for `node:fs/promises`, pulled in statically by the
 * online-catalog-cms bundle for its server-only LocalStorageAdapter. Never
 * actually invoked by this demo — see vite.config.ts.
 */
function unavailable(name: string): Promise<never> {
  return Promise.reject(
    new Error(
      `fs/promises.${name}() is not available in the browser build of online-catalog-cms-demo.`
    )
  );
}

export function writeFile(): Promise<never> {
  return unavailable('writeFile');
}

export function rm(): Promise<never> {
  return unavailable('rm');
}
