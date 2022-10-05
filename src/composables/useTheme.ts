import { computed } from 'vue';
import { Theme } from '@src/lib/modules/theme';
import { useThemeStore } from '@src/stores/theme';
import { isNumber } from '@src/lib/modules/definition';

export default function useTheme() {
  const themeStore = useThemeStore();

  const themes = Object.values(Theme).filter((element) => isNumber(element)) as Theme[];

  const theme = computed(() => themeStore.theme);

  return {
    themes,
    update: themeStore.updateTheme,
    theme,
  };
}
