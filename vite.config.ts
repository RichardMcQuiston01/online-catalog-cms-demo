import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      // Only OnlineCatalog + types are used in-browser, but its dist bundle
      // statically imports several Node builtins for the server-only
      // database/storage adapters (SQLite, Postgres, S3, ...) that this demo
      // never invokes — it supplies its own InMemoryAdapter instead. These
      // shims let the unused code paths resolve at build time without
      // pulling in Node polyfills.
      crypto: resolve(__dirname, 'src/shims/node-crypto.ts'),
      fs: resolve(__dirname, 'src/shims/node-fs.ts'),
      path: resolve(__dirname, 'src/shims/node-path.ts'),
      url: resolve(__dirname, 'src/shims/node-url.ts'),
      module: resolve(__dirname, 'src/shims/node-module.ts'),
      'stream/promises': resolve(
        __dirname,
        'src/shims/node-stream-promises.ts'
      ),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        editor: resolve(__dirname, 'editor.html'),
      },
    },
  },
});
