import type { App } from 'vue';
import { isThemeScheme } from '@src/lib/modules/theme';
import { isDebugMode } from '@src/plugin';
import { ThemeScheme } from '@src/definition';

export default function registerDirectives(app: App) {
  app.directive('theme', (el, binding) => {
    const { scheme } = binding.value;
    if (isThemeScheme(scheme)) {
      el.setAttribute('data-theme', ThemeScheme[scheme]);
      return;
    }
    if (isDebugMode()) {
      throw new Error('scheme attribute must be of type ThemeScheme');
    }
  });
}
