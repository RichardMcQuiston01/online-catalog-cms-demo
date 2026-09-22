/**
 * Simple accessible toast notification. Rendered visually and announced via
 * the `#status-region` aria-live region every page includes.
 */
export function showToast(
  message: string,
  type: 'success' | 'error' = 'success'
): void {
  const statusRegion = document.getElementById('status-region');
  if (statusRegion) {
    statusRegion.textContent = message;
    // Clear after a tick so repeat identical messages still trigger SR announcement.
    setTimeout(() => {
      statusRegion.textContent = '';
    }, 100);
  }

  document.querySelector('.toast')?.remove();

  const toast = document.createElement('div');
  toast.className = `toast${type === 'error' ? ' toast--error' : ''}`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast--hidden');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
