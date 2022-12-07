import { inject } from 'vue';
import { themeContextKey } from '@src/definition';
import { useThemeStore } from '@src/stores/theme';

export default function useTheme() {
  const injectedTheme = inject(themeContextKey);
  const themeStore = useThemeStore();

  function updateTheme(newTheme: string) {
    themeStore.updateTheme(newTheme);
  }

  return {
    theme: injectedTheme,
    updateTheme,
  };
}
