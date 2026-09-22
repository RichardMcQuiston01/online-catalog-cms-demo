/**
 * Product create/edit page logic for editor.html
 */
import type {
  Image,
  OnlineCatalog,
} from '@richardmcquiston01/online-catalog-cms';
import { getCatalog } from './catalog';
import { htmlToRichText, richTextToEditableHtml } from './rich-text';
import { showToast } from './toast';
import { mountDonateCard } from './donate-widget';
import './styles.css';

const form = document.getElementById('product-form') as HTMLFormElement;
const formTitle = document.getElementById('form-title') as HTMLElement;
const productIdInput = document.getElementById(
  'product-id'
) as HTMLInputElement;
const nameInput = document.getElementById('name-input') as HTMLInputElement;
const nameError = document.getElementById('name-error') as HTMLElement;
const skuInput = document.getElementById('sku-input') as HTMLInputElement;
const priceInput = document.getElementById('price-input') as HTMLInputElement;
const priceError = document.getElementById('price-error') as HTMLElement;
const categorySelect = document.getElementById(
  'category-select'
) as HTMLSelectElement;
const descEditor = document.getElementById('description-editor') as HTMLElement;
const toolbar = document.getElementById('editor-toolbar') as HTMLElement;
const imageUrlInput = document.getElementById(
  'image-url-input'
) as HTMLInputElement;
const imageAltInput = document.getElementById(
  'image-alt-input'
) as HTMLInputElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;

let editingId: string | null = null;
let originalImages: Image[] = [];

async function init(): Promise<void> {
  const catalog = await getCatalog();
  await populateCategories(catalog);
  await checkEditMode(catalog);
  setupToolbar();
  setupFormValidation();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await handleSubmit(catalog);
  });
}

async function populateCategories(catalog: OnlineCatalog): Promise<void> {
  const categories = await catalog.categories.list();
  for (const cat of categories) {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  }
}

async function checkEditMode(catalog: OnlineCatalog): Promise<void> {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) return;

  try {
    const product = await catalog.products.get(id);
    if (!product) {
      showToast('Product not found.', 'error');
      return;
    }

    editingId = id;
    originalImages = product.images;
    formTitle.textContent = 'Edit Product';
    document.title = `Edit ${product.name} — online-catalog-cms demo`;
    submitBtn.textContent = 'Update product';

    productIdInput.value = product.id;
    nameInput.value = product.name;
    skuInput.value = product.sku ?? '';
    priceInput.value = String(product.price);
    categorySelect.value = product.categoryId ?? '';

    if (product.description?.nodes?.length) {
      descEditor.innerHTML = richTextToEditableHtml(product.description);
    }

    if (product.images[0]) {
      imageUrlInput.value = product.images[0].url;
      imageAltInput.value = product.images[0].altText;
    }
  } catch (err) {
    showToast(`Failed to load product: ${(err as Error).message}`, 'error');
  }
}

function setupToolbar(): void {
  toolbar.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-cmd]');
    if (!btn) return;
    const cmd = btn.dataset.cmd!;
    document.execCommand(cmd, false, undefined);
    descEditor.focus();
    updateToolbarState();
  });

  descEditor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      document.execCommand('bold', false, undefined);
      updateToolbarState();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      document.execCommand('italic', false, undefined);
      updateToolbarState();
    }
  });

  descEditor.addEventListener('keyup', updateToolbarState);
  descEditor.addEventListener('mouseup', updateToolbarState);
}

function updateToolbarState(): void {
  const boldBtn = toolbar.querySelector('[data-cmd="bold"]');
  const italicBtn = toolbar.querySelector('[data-cmd="italic"]');
  boldBtn?.setAttribute(
    'aria-pressed',
    String(document.queryCommandState('bold'))
  );
  italicBtn?.setAttribute(
    'aria-pressed',
    String(document.queryCommandState('italic'))
  );
}

function setupFormValidation(): void {
  nameInput.addEventListener('blur', () =>
    validateField(nameInput, nameError, 'Product name is required.')
  );
  priceInput.addEventListener('blur', () =>
    validateField(
      priceInput,
      priceError,
      'Price must be a whole number of cents (e.g. 1999 for $19.99).',
      (v) => /^\d+$/.test(v.trim()) && Number.parseInt(v.trim(), 10) >= 0
    )
  );
}

function validateField(
  input: HTMLInputElement,
  errorEl: HTMLElement,
  message: string,
  extraCheck?: (value: string) => boolean
): boolean {
  const value = input.value;
  const isEmpty = !value.trim();
  const failsExtra = extraCheck && !isEmpty && !extraCheck(value);

  if (isEmpty && input.required) {
    setFieldError(input, errorEl, message);
    return false;
  }
  if (failsExtra) {
    setFieldError(input, errorEl, message);
    return false;
  }
  clearFieldError(input, errorEl);
  return true;
}

function setFieldError(
  input: HTMLInputElement,
  errorEl: HTMLElement,
  message: string
): void {
  input.setAttribute('aria-invalid', 'true');
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearFieldError(input: HTMLInputElement, errorEl: HTMLElement): void {
  input.removeAttribute('aria-invalid');
  errorEl.hidden = true;
  errorEl.textContent = '';
}

function validateForm(): boolean {
  const nameOk = validateField(
    nameInput,
    nameError,
    'Product name is required.'
  );
  const priceOk = validateField(
    priceInput,
    priceError,
    'Price must be a whole number of cents (e.g. 1999 for $19.99).',
    (v) => /^\d+$/.test(v.trim()) && Number.parseInt(v.trim(), 10) >= 0
  );

  if (!nameOk) {
    nameInput.focus();
    return false;
  }
  if (!priceOk) {
    priceInput.focus();
    return false;
  }
  return true;
}

async function handleSubmit(catalog: OnlineCatalog): Promise<void> {
  submitBtn.disabled = true;
  submitBtn.textContent = editingId ? 'Saving…' : 'Creating…';

  try {
    const description = htmlToRichText(descEditor.innerHTML);
    const categoryId = categorySelect.value || null;
    const price = Number.parseInt(priceInput.value.trim(), 10);
    const sku = skuInput.value.trim() || null;

    const product = editingId
      ? await catalog.products.update(editingId, {
          name: nameInput.value.trim(),
          price,
          sku,
          categoryId,
          description,
        })
      : await catalog.products.create({
          name: nameInput.value.trim(),
          price,
          sku,
          categoryId,
          description,
        });

    const imageUrl = imageUrlInput.value.trim();
    const imageAlt = imageAltInput.value.trim();

    if (imageUrl) {
      if (editingId && originalImages[0]) {
        if (originalImages[0].url !== imageUrl) {
          await catalog.images.delete(originalImages[0].id);
          await catalog.images.addUrl({
            productId: product.id,
            url: imageUrl,
            altText: imageAlt || product.name,
          });
        } else if (imageAlt && originalImages[0].altText !== imageAlt) {
          // No update method on images — delete and recreate.
          await catalog.images.delete(originalImages[0].id);
          await catalog.images.addUrl({
            productId: product.id,
            url: imageUrl,
            altText: imageAlt,
          });
        }
      } else if (!editingId) {
        await catalog.images.addUrl({
          productId: product.id,
          url: imageUrl,
          altText: imageAlt || product.name,
        });
      }
    } else if (editingId && originalImages[0]) {
      await catalog.images.delete(originalImages[0].id);
    }

    showToast(editingId ? 'Product updated.' : 'Product created.');
    setTimeout(() => {
      location.href = 'index.html';
    }, 800);
  } catch (err) {
    showToast(`Error: ${(err as Error).message}`, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = editingId ? 'Update product' : 'Save product';
  }
}

mountDonateCard();

init().catch((err: Error) => {
  console.error(err);
  showToast(`Initialization error: ${err.message}`, 'error');
});
