/**
 * Minimal in-memory DatabaseAdapter for the browser demo.
 * Stores data in localStorage so it survives page reloads.
 * There is no bun:sqlite/better-sqlite3 in the browser, so this adapter
 * stands in for a real database adapter when running the SPA on Vercel.
 */
import type {
  Category,
  CategoryFilter,
  CategoryRepository,
  CreateCategoryInput,
  CreateImageInput,
  CreateProductInput,
  DatabaseAdapter,
  Image,
  ImageRepository,
  Product,
  ProductFilter,
  ProductRepository,
  UpdateCategoryInput,
  UpdateProductInput,
  VerificationResult,
} from '@richardmcquiston01/online-catalog-cms';

function uuid(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as T[];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function reviveDates<T extends { createdAt?: unknown; updatedAt?: unknown }>(
  obj: T
): T {
  const clone = { ...obj };
  if (typeof clone.createdAt === 'string')
    clone.createdAt = new Date(clone.createdAt) as never;
  if (typeof clone.updatedAt === 'string')
    clone.updatedAt = new Date(clone.updatedAt) as never;
  return clone;
}

type ProductRow = Omit<Product, 'images'>;

class InMemoryProductRepository implements ProductRepository {
  constructor(private readonly imageRepo: InMemoryImageRepository) {}

  async create(input: CreateProductInput): Promise<Product> {
    const rows = load<ProductRow>('occ_products');
    const product: ProductRow = {
      id: uuid(),
      name: input.name,
      slug: input.slug ?? toSlug(input.name),
      description: input.description ?? { version: 1, nodes: [] },
      price: input.price,
      sku: input.sku ?? null,
      categoryId: input.categoryId ?? null,
      metadata: input.metadata ?? {},
      createdAt: now() as unknown as Date,
      updatedAt: now() as unknown as Date,
    };
    rows.push(product);
    save('occ_products', rows);
    return reviveDates({ ...product, images: [] });
  }

  async get(id: string): Promise<Product | null> {
    const rows = load<ProductRow>('occ_products');
    const row = rows.find((r) => r.id === id);
    if (!row) return null;
    const images = await this.imageRepo.listByProduct(id);
    return reviveDates({ ...row, images });
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const rows = load<ProductRow>('occ_products');
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Product not found: ${id}`);
    const updated: ProductRow = {
      ...rows[idx],
      ...input,
      updatedAt: now() as unknown as Date,
    };
    rows[idx] = updated;
    save('occ_products', rows);
    const images = await this.imageRepo.listByProduct(id);
    return reviveDates({ ...updated, images });
  }

  async delete(id: string): Promise<void> {
    const rows = load<ProductRow>('occ_products');
    save(
      'occ_products',
      rows.filter((r) => r.id !== id)
    );
    const imgRows = load<Image>('occ_images');
    save(
      'occ_images',
      imgRows.filter((r) => r.productId !== id)
    );
  }

  async list(filter?: ProductFilter): Promise<Product[]> {
    let rows = load<ProductRow>('occ_products');
    if (filter?.categoryId)
      rows = rows.filter((r) => r.categoryId === filter.categoryId);
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) || r.sku?.toLowerCase().includes(q)
      );
    }
    if (filter?.minPrice != null)
      rows = rows.filter((r) => r.price >= filter.minPrice!);
    if (filter?.maxPrice != null)
      rows = rows.filter((r) => r.price <= filter.maxPrice!);

    return Promise.all(
      rows.map(async (r) => {
        const images = await this.imageRepo.listByProduct(r.id);
        return reviveDates({ ...r, images });
      })
    );
  }
}

class InMemoryCategoryRepository implements CategoryRepository {
  async create(input: CreateCategoryInput): Promise<Category> {
    const rows = load<Category>('occ_categories');
    const cat: Category = {
      id: uuid(),
      name: input.name,
      slug: input.slug ?? toSlug(input.name),
      parentId: input.parentId ?? null,
      metadata: input.metadata ?? {},
      createdAt: now() as unknown as Date,
      updatedAt: now() as unknown as Date,
    };
    rows.push(cat);
    save('occ_categories', rows);
    return reviveDates(cat);
  }

  async get(id: string): Promise<Category | null> {
    const rows = load<Category>('occ_categories');
    const row = rows.find((r) => r.id === id);
    return row ? reviveDates(row) : null;
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const rows = load<Category>('occ_categories');
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Category not found: ${id}`);
    const updated: Category = {
      ...rows[idx],
      ...input,
      updatedAt: now() as unknown as Date,
    };
    rows[idx] = updated;
    save('occ_categories', rows);
    return reviveDates(updated);
  }

  async delete(id: string): Promise<void> {
    const rows = load<Category>('occ_categories');
    save(
      'occ_categories',
      rows.filter((r) => r.id !== id)
    );
  }

  async list(filter?: CategoryFilter): Promise<Category[]> {
    let rows = load<Category>('occ_categories');
    if (filter?.parentId !== undefined) {
      rows = rows.filter((r) => r.parentId === filter.parentId);
    }
    return rows.map(reviveDates);
  }
}

class InMemoryImageRepository implements ImageRepository {
  async create(input: CreateImageInput): Promise<Image> {
    const rows = load<Image>('occ_images');
    const img: Image = {
      id: uuid(),
      productId: input.productId,
      url: input.url,
      altText: input.altText,
      sortOrder:
        input.sortOrder ??
        rows.filter((r) => r.productId === input.productId).length,
      createdAt: now() as unknown as Date,
    };
    rows.push(img);
    save('occ_images', rows);
    return reviveDates(img);
  }

  async get(id: string): Promise<Image | null> {
    const rows = load<Image>('occ_images');
    const row = rows.find((r) => r.id === id);
    return row ? reviveDates(row) : null;
  }

  async delete(id: string): Promise<void> {
    const rows = load<Image>('occ_images');
    save(
      'occ_images',
      rows.filter((r) => r.id !== id)
    );
  }

  async listByProduct(productId: string): Promise<Image[]> {
    const rows = load<Image>('occ_images');
    return rows
      .filter((r) => r.productId === productId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(reviveDates);
  }
}

export class InMemoryAdapter implements DatabaseAdapter {
  readonly images: ImageRepository = new InMemoryImageRepository();
  readonly products: ProductRepository;
  readonly categories: CategoryRepository = new InMemoryCategoryRepository();

  constructor() {
    this.products = new InMemoryProductRepository(
      this.images as InMemoryImageRepository
    );
  }

  async initialize(): Promise<void> {
    // Nothing to migrate for in-memory/localStorage.
  }

  async verify(): Promise<VerificationResult> {
    return { ok: true, issues: [] };
  }

  async close(): Promise<void> {
    // Nothing to close.
  }
}
