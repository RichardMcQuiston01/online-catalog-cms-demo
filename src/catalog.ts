/**
 * Initializes the OnlineCatalog instance shared by the demo pages, backed by
 * an in-memory/localStorage adapter so the demo runs entirely in the
 * browser with no server or database required.
 */
import { OnlineCatalog } from '@richardmcquiston01/online-catalog-cms';
import { InMemoryAdapter } from './adapters/in-memory-adapter';

let catalog: OnlineCatalog | null = null;

export async function getCatalog(): Promise<OnlineCatalog> {
  if (catalog) return catalog;

  catalog = new OnlineCatalog({ db: new InMemoryAdapter() });
  await catalog.initialize();

  const categories = await catalog.categories.list();
  if (categories.length === 0) {
    await catalog.categories.create({
      name: 'Electronics',
      slug: 'electronics',
    });
    await catalog.categories.create({ name: 'Clothing', slug: 'clothing' });
    await catalog.categories.create({ name: 'Books', slug: 'books' });
  }

  return catalog;
}
