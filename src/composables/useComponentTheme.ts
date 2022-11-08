import { inject } from 'vue';
import { themeContextKey, type ThemeScheme } from '@src/definition';

export default function useComponentTheme() {
  const scheme = inject<ThemeScheme>(themeContextKey) as ThemeScheme;

  return {
    scheme,
  };
}
