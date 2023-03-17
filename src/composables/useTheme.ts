import { inject } from 'vue';
import { themeContextKey } from '@src/definition';
import { useThemeStore } from '@src/stores/theme';
import { isValue } from '@src/lib/modules/definition';

export default function useTheme() {
  const context = inject(themeContextKey);

  if (!isValue(context)) {
    throw new Error('useTheme must be called inside an <AppThemeContext />');
  }

  const themeStore = useThemeStore();

  function updateTheme(newTheme: string) {
    themeStore.updateTheme(newTheme);
  }

  return {
    theme: context,
    updateTheme,
  };
}
