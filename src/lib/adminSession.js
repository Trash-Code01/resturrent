import { ADMIN_PANEL_EMAIL, ADMIN_PANEL_PASSWORD } from './env';

const ADMIN_SESSION_STORAGE_KEY = 'obsidian.backoffice.session';

function isBrowser() {
  return typeof window !== 'undefined';
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function isAdminCredentialMatch(email, password) {
  return (
    normalizeEmail(email) === normalizeEmail(ADMIN_PANEL_EMAIL) &&
    password === ADMIN_PANEL_PASSWORD
  );
}

export function getAdminSession() {
  if (!isBrowser()) {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const session = JSON.parse(rawValue);

    if (!session?.email) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function hasAdminSession() {
  return Boolean(getAdminSession());
}

export function persistAdminSession(email) {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.setItem(
    ADMIN_SESSION_STORAGE_KEY,
    JSON.stringify({
      email: normalizeEmail(email),
      authenticatedAt: new Date().toISOString(),
    }),
  );
}

export function clearAdminSession() {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}
