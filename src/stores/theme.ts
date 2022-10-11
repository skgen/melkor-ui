import { defineStore } from 'pinia';
import {
  getPreferedTheme,
  getThemeSchemeFromTheme,
  getAutoPreferedTheme,
  persistTheme,
  watchSystemThemeChange,

} from '@src/lib/modules/theme';
import { Theme, ThemeMode, ThemeScheme } from '@src/definition';
import { isNumber } from '@src/lib/modules/definition';

const defaultTheme = getPreferedTheme();
const schemeKey = ThemeScheme[defaultTheme.scheme];
document.documentElement.setAttribute('data-theme', schemeKey);
watchSystemThemeChange('light');
watchSystemThemeChange('dark');

export const useThemeStore = defineStore({
  id: 'theme',
  state: () => ({
    theme: defaultTheme,
  }),
  getters: {
    themes: () => Object.values(Theme).filter((element) => isNumber(element)) as Theme[],
  },
  actions: {
    updateTheme(newTheme: Theme) {
      if (newTheme === Theme.auto) {
        persistTheme(null);
        this.theme = getAutoPreferedTheme();
      } else {
        const newScheme = getThemeSchemeFromTheme(newTheme);
        this.theme = {
          scheme: newScheme,
          mode: ThemeMode.manual,
        };
        persistTheme(this.theme.scheme);
      }
      document.documentElement.setAttribute('data-theme', Theme[this.theme.scheme]);
    },
    isCurrentTheme(themeCandidate: Theme) {
      const scheme = getThemeSchemeFromTheme(themeCandidate);
      if (this.theme.mode === ThemeMode.auto && themeCandidate === Theme.auto) {
        return true;
      }
      if (themeCandidate === Theme.auto) {
        return false;
      }
      return scheme === this.theme.scheme;
    },
  },
});

export default {};
