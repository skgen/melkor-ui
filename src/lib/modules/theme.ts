import { isValue } from '@src/lib/modules/definition';

export enum Theme {
  auto,
  light,
  dark,
}

export function isThemeEnum(value: unknown): value is Theme {
  return Object.values(Theme).includes(value as string | Theme);
}

export function getPreferedTheme(): Theme | null {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.dark;
  }
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return Theme.light;
  }
  return null;
}

export function getPersistedTheme(): Theme | null {
  const theme = localStorage.getItem('app-theme');
  if (isValue(theme)) {
    return Theme[theme as keyof typeof Theme];
  }
  return null;
}

export function persistTheme(theme: Theme | null) {
  if (isValue(theme)) {
    localStorage.setItem('app-theme', Theme[theme]);
  } else {
    localStorage.removeItem('app-theme');
  }
}
