/**
 * Floating "Support this project" card, mounted on every demo page.
 * Dismissal persists via localStorage; failures there are non-fatal — the
 * card just reappears next load rather than breaking the demo.
 */
import './donate-widget.css';

const STORAGE_KEY = 'donate-card-dismissed';
const DONATE_URL = 'https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800';

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeDismissed(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* Non-fatal: the card just reappears next load. */
  }
}

export function mountDonateCard(): void {
  if (document.getElementById('donateCard')) return;
  if (readDismissed()) return;

  const card = document.createElement('aside');
  card.className = 'donate-card';
  card.id = 'donateCard';
  card.setAttribute('aria-labelledby', 'donateCardTitle');
  card.innerHTML = `
    <button
      class="donate-card__dismiss"
      type="button"
      aria-label="Dismiss support message"
      data-donate-dismiss
    >&times;</button>

    <h2 class="donate-card__title" id="donateCardTitle">
      <span class="donate-card__heart" aria-hidden="true">&#9829;</span>
      Support this project
    </h2>

    <p class="donate-card__body">
      If this app, code, or repository has helped you or someone you know, please
      consider donating. I appreciate any help to offset the costs of development
      and/or AI Credits.
    </p>

    <div class="donate-card__qr">
      <img src="/donate.svg" alt="QR code linking to the Stripe donation page" width="180" height="180" />
    </div>

    <a
      class="donate-card__link"
      href="${DONATE_URL}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Donate via Stripe, opens in a new tab"
    >Donate via Stripe <span aria-hidden="true">&rarr;</span></a>
  `;

  document.body.appendChild(card);
  card.querySelector('[data-donate-dismiss]')?.addEventListener('click', () => {
    card.hidden = true;
    writeDismissed();
  });
}
