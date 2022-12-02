import { inject } from 'vue';
import { themeContextKey } from '@src/definition';

export default function useTheme() {
  const injectedTheme = inject(themeContextKey);

  return {
    theme: injectedTheme,
  };
}
