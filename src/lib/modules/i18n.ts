import { isValue } from '@src/lib/modules/definition';

let availableLocales: string[] = [];

export function setLocales(newLocales: string[]) {
  availableLocales = newLocales;
}

export function getPersistedLocale(locales?: string[]): string | null {
  if (isValue(locales)) {
    setLocales(locales);
  }
  const locale = localStorage.getItem('app-locale');
  if (isValue(locale) && availableLocales.includes(locale)) {
    return locale;
  }
  return null;
}

export function persistLocale(locale: string | null) {
  if (isValue(locale)) {
    localStorage.setItem('app-locale', locale);
  } else {
    localStorage.removeItem('app-locale');
  }
}
