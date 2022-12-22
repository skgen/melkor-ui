import type { App } from 'vue';
import { setElementTheme } from '@src/lib/modules/theme';

export default function registerDirectives(app: App) {
  app.directive('theme', (el, binding) => {
    const { theme, hijack } = binding.value;
    setElementTheme(el, theme, hijack);
  });
}
