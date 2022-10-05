import type { App } from 'vue';
import { isThemeEnum, Theme } from '@src/lib/modules/theme';
import { isDebugMode } from '@src/plugin';

export default function registerDirectives(app: App) {
  app.directive('theme', (el, binding) => {
    const { theme } = binding.value;
    if (!isThemeEnum(theme)) {
      if (isDebugMode()) {
        throw new Error('theme attribute must be of type Theme');
      }
      return;
    }
    el.setAttribute('data-theme', Theme[theme]);
  });
}
