/**
 * Browser stand-in for `node:fs`, pulled in statically by the
 * online-catalog-cms bundle for its server-only LocalStorageAdapter. Never
 * actually invoked by this demo — see vite.config.ts.
 */
function unavailable(name: string): never {
  throw new Error(
    `fs.${name}() is not available in the browser build of online-catalog-cms-demo.`
  );
}

export function readFileSync(): never {
  return unavailable('readFileSync');
}

export function existsSync(): never {
  return unavailable('existsSync');
}

export function mkdirSync(): never {
  return unavailable('mkdirSync');
}

export function createWriteStream(): never {
  return unavailable('createWriteStream');
}

export function unlinkSync(): never {
  return unavailable('unlinkSync');
}
