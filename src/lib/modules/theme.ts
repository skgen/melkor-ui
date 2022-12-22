import { Theme } from '@src/definition';
import { isValue } from '@src/lib/modules/definition';
import { isDebugMode } from '@src/plugin';
import { useThemeStore } from '@src/stores/theme';

const defaultThemes: string[] = [Theme.light, Theme.dark, Theme.auto];
let themes: string[] = [];

export function setThemes(newThemes: string[]) {
  themes = [...defaultThemes, ...newThemes];
}

export function getThemes() {
  return themes;
}

export function getAutoTheme(): string {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.dark;
  }
  return Theme.light;
}

export function getPersistedTheme(): string | null {
  const theme = localStorage.getItem('app-theme');
  if (isValue(theme) && getThemes().includes(theme)) {
    return theme;
  }
  return null;
}

export function getPreferedTheme(): string {
  const persisted = getPersistedTheme();
  if (isValue(persisted)) {
    return persisted;
  }
  return Theme.auto;
}

export function persistTheme(scheme: string | null) {
  if (isValue(scheme) && scheme !== Theme.auto) {
    localStorage.setItem('app-theme', scheme);
  } else {
    localStorage.removeItem('app-theme');
  }
}

export function getThemeValue(theme: string): string {
  if (theme === Theme.auto) {
    return getAutoTheme();
  }
  return theme;
}

export function setDocumentTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', getThemeValue(theme));
}

export function setElementTheme(el: HTMLElement, theme: string, hijack = false) {
  if (getThemes().includes(theme) || hijack) {
    el.setAttribute('data-theme', getThemeValue(theme));
    return;
  }
  if (isDebugMode()) {
    throw new Error(`Theme "${theme}" is not registered`);
  }
}

export function watchSystemThemeChange(systemKey: string) {
  window.matchMedia(`(prefers-color-scheme: ${systemKey})`).addEventListener('change', (e) => {
    const themeStore = useThemeStore();
    if (!e.matches || themeStore.theme !== Theme.auto) {
      return;
    }
    themeStore.updateTheme(Theme.auto);
  });
}

watchSystemThemeChange('light');
watchSystemThemeChange('dark');
