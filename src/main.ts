/**
 * Product listing page logic for index.html
 */
import type {
  OnlineCatalog,
  Product,
  ProductFilter,
} from '@richardmcquiston01/online-catalog-cms';
import { getCatalog } from './catalog';
import { richTextToHtml } from './rich-text';
import { showToast } from './toast';
import { mountDonateCard } from './donate-widget';
import './styles.css';

const productList = document.getElementById('product-list') as HTMLElement;
const loadingEl = document.getElementById('loading') as HTMLElement;
const emptyEl = document.getElementById('empty-state') as HTMLElement;
const filterForm = document.getElementById('filter-form') as HTMLFormElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
const categorySelect = document.getElementById(
  'category-select'
) as HTMLSelectElement;

async function init(): Promise<void> {
  const catalog = await getCatalog();
  await populateCategoryFilter(catalog);
  await renderProducts(catalog);

  filterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await renderProducts(catalog);
  });

  resetBtn.addEventListener('click', async () => {
    filterForm.reset();
    await renderProducts(catalog);
  });

  // Listen for delete events bubbled from product cards.
  productList.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-delete-id]'
    );
    if (!btn) return;

    const id = btn.dataset.deleteId!;
    const name = btn.dataset.deleteName!;
    if (!confirm(`Delete product "${name}"? This cannot be undone.`)) return;

    try {
      await catalog.products.delete(id);
      showToast(`"${name}" deleted.`);
      await renderProducts(catalog);
    } catch (err) {
      showToast(`Failed to delete: ${(err as Error).message}`, 'error');
    }
  });
}

async function populateCategoryFilter(catalog: OnlineCatalog): Promise<void> {
  const categories = await catalog.categories.list();
  for (const cat of categories) {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  }
}

async function renderProducts(catalog: OnlineCatalog): Promise<void> {
  const data = new FormData(filterForm);
  const filter: ProductFilter = {};

  const search = data.get('search')?.toString().trim();
  if (search) filter.search = search;

  const categoryId = data.get('category')?.toString();
  if (categoryId) filter.categoryId = categoryId;

  const minPrice = data.get('minPrice')?.toString();
  if (minPrice) filter.minPrice = Number.parseInt(minPrice, 10);

  const maxPrice = data.get('maxPrice')?.toString();
  if (maxPrice) filter.maxPrice = Number.parseInt(maxPrice, 10);

  loadingEl.hidden = false;
  productList.hidden = true;
  emptyEl.hidden = true;
  loadingEl.setAttribute('aria-busy', 'true');

  try {
    const products = await catalog.products.list(
      Object.keys(filter).length ? filter : undefined
    );

    loadingEl.hidden = true;
    loadingEl.removeAttribute('aria-busy');

    if (products.length === 0) {
      emptyEl.hidden = false;
      return;
    }

    productList.innerHTML = '';
    for (const product of products) {
      productList.appendChild(buildProductCard(product));
    }
    productList.hidden = false;
  } catch (err) {
    loadingEl.hidden = true;
    showToast(`Error loading products: ${(err as Error).message}`, 'error');
  }
}

function buildProductCard(product: Product): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'product-card';

  const firstImage = product.images[0];
  if (firstImage) {
    const img = document.createElement('img');
    img.className = 'product-card__image';
    img.src = firstImage.url;
    img.alt = firstImage.altText;
    img.loading = 'lazy';
    img.decoding = 'async';
    li.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'product-card__image-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = 'No image';
    li.appendChild(placeholder);
  }

  const body = document.createElement('div');
  body.className = 'product-card__body';

  const heading = document.createElement('h3');
  heading.className = 'product-card__name';
  const link = document.createElement('a');
  link.href = `editor.html?id=${product.id}`;
  link.textContent = product.name;
  heading.appendChild(link);
  body.appendChild(heading);

  if (product.sku) {
    const sku = document.createElement('p');
    sku.className = 'product-card__sku';
    sku.textContent = `SKU: ${product.sku}`;
    body.appendChild(sku);
  }

  if (product.description?.nodes?.length) {
    const desc = document.createElement('div');
    desc.innerHTML = richTextToHtml(product.description);
    // Truncate visually — only show first paragraph.
    const firstP = desc.querySelector('p, li');
    if (firstP) {
      const truncated = document.createElement('p');
      truncated.className = 'product-card__excerpt';
      truncated.textContent = firstP.textContent;
      body.appendChild(truncated);
    }
  }

  const price = document.createElement('p');
  price.className = 'product-card__price';
  price.textContent = formatPrice(product.price);
  body.appendChild(price);

  li.appendChild(body);

  const actions = document.createElement('div');
  actions.className = 'product-card__actions';

  const editBtn = document.createElement('a');
  editBtn.href = `editor.html?id=${product.id}`;
  editBtn.className = 'btn';
  editBtn.textContent = 'Edit';
  editBtn.setAttribute('aria-label', `Edit ${product.name}`);
  actions.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('aria-label', `Delete ${product.name}`);
  deleteBtn.dataset.deleteId = product.id;
  deleteBtn.dataset.deleteName = product.name;
  actions.appendChild(deleteBtn);

  li.appendChild(actions);

  return li;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

mountDonateCard();

init().catch((err: Error) => {
  console.error(err);
  if (loadingEl) {
    loadingEl.textContent = `Error: ${err.message}`;
    loadingEl.hidden = false;
  }
});
