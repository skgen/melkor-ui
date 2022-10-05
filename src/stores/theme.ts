import { defineStore } from 'pinia';
import { Theme, getPersistedTheme, persistTheme } from '@src/lib/modules/theme';

const defaultTheme = getPersistedTheme() ?? Theme.auto;
if (defaultTheme !== Theme.auto) {
  document.documentElement.setAttribute('data-theme', Theme[defaultTheme]);
}

export const useThemeStore = defineStore({
  id: 'theme',
  state: () => ({
    theme: defaultTheme,
  }),
  actions: {
    updateTheme(newTheme: Theme) {
      this.theme = newTheme;
      if (newTheme !== Theme.auto) {
        document.documentElement.setAttribute('data-theme', Theme[newTheme]);
        persistTheme(newTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
        persistTheme(null);
      }
    },
  },
});

export default {};
