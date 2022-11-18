import { inject } from 'vue';
import { themeContextKey } from '@src/definition';

export default function useComponentTheme() {
  const scheme = inject(themeContextKey);

  return {
    scheme,
  };
}
