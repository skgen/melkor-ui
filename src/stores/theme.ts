import { defineStore } from 'pinia';
import {
  getPreferedTheme,
  getThemes,
  persistTheme,
  setDocumentTheme,
} from '@src/lib/modules/theme';
import { Theme } from '@src/definition';

export type ThemeStoreState = {
  theme: string;
  seed: number;
};

export const useThemeStore = defineStore({
  id: 'mk-theme',
  state: (): ThemeStoreState => ({
    theme: getPreferedTheme(),
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
