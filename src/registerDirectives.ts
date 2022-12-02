import type { App } from 'vue';
import { getThemes, getThemeValue } from '@src/lib/modules/theme';
import { isDebugMode } from '@src/plugin';

export default function registerDirectives(app: App) {
  app.directive('theme', (el, binding) => {
    const { theme, hijack } = binding.value;
    if (getThemes().includes(theme) || hijack) {
      el.setAttribute('data-theme', getThemeValue(theme));
      return;
    }
    if (isDebugMode()) {
      throw new Error(`Theme "${theme}" is not registered`);
    }
  });
}
