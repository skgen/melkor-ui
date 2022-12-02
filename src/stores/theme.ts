import { defineStore } from 'pinia';
import {
  getPreferedTheme,
  getThemes,
  persistTheme,
  setDocumentTheme,
  watchSystemThemeChange,
} from '@src/lib/modules/theme';
import { Theme } from '..';

const defaultTheme = getPreferedTheme();
setDocumentTheme(defaultTheme);
watchSystemThemeChange('light');
watchSystemThemeChange('dark');

export type ThemeStoreState = {
  theme: string;
  seed: number;
};

export const useThemeStore = defineStore({
  id: 'theme',
  state: (): ThemeStoreState => ({
    theme: defaultTheme,
    seed: Math.random(),
  }),
  getters: {
    themes: () => getThemes(),
  },
  actions: {
    updateTheme(newTheme: string) {
      this.theme = newTheme;
      if (newTheme === Theme.auto) {
        let newSeed: number;
        do {
          newSeed = Math.random();
        } while (newSeed === this.seed);
        this.seed = newSeed;
      }
      persistTheme(newTheme);
      setDocumentTheme(newTheme);
    },
  },
});

export default {};
