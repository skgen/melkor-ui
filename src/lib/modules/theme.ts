import {
  Theme, ThemeMode, ThemeScheme, type ThemeData,
} from '@src/definition';
import { isValue } from '@src/lib/modules/definition';
import { useThemeStore } from '@src/stores/theme';

export function isThemeEnum(value: unknown): value is Theme {
  return Object.values(Theme).includes(value as string | Theme);
}

export function isThemeSchemeKey(value: unknown): value is keyof typeof ThemeScheme {
  return Object.keys(ThemeScheme).includes(value as string | keyof typeof ThemeScheme);
}

export function isThemeScheme(value: unknown): value is ThemeScheme {
  return Object.values(ThemeScheme).includes(value as string | ThemeScheme);
}

export function getAutoPreferedThemeScheme(): ThemeScheme {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return ThemeScheme.dark;
  }
  return ThemeScheme.light;
}

export function getThemeSchemeFromTheme(value: Theme): ThemeScheme {
  const key = Theme[value];
  if (isThemeSchemeKey(key)) {
    const scheme = ThemeScheme[key];
    return scheme;
  }
  return getAutoPreferedThemeScheme();
}

export function getPersistedTheme(): ThemeData | null {
  const scheme = localStorage.getItem('app-theme');
  if (isValue(scheme) && isThemeSchemeKey(scheme)) {
    return {
      scheme: ThemeScheme[scheme],
      mode: ThemeMode.manual,
    };
  }
  return null;
}

export function getAutoPreferedTheme(): ThemeData {
  return {
    scheme: getAutoPreferedThemeScheme(),
    mode: ThemeMode.auto,
  };
}

export function getPreferedTheme(): ThemeData {
  const persisted = getPersistedTheme();
  if (isValue(persisted)) {
    return persisted;
  }
  return getAutoPreferedTheme();
}

export function persistTheme(scheme: ThemeScheme | null) {
  if (isValue(scheme)) {
    localStorage.setItem('app-theme', ThemeScheme[scheme]);
  } else {
    localStorage.removeItem('app-theme');
  }
}

export function watchSystemThemeChange(systemKey: string) {
  window.matchMedia(`(prefers-color-scheme: ${systemKey})`).addEventListener('change', (e) => {
    const themeStore = useThemeStore();
    if (!e.matches || themeStore.theme.mode !== ThemeMode.auto) {
      return;
    }
    themeStore.updateTheme(Theme.auto);
  });
}
