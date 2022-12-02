<template>
  <slot v-if="!props.withNode" />
  <div
    v-else
    v-theme="theme"
    class="mk-AppThemeContext"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue';
import { themeContextKey, type ThemeInstance } from '@src/definition';
import { useThemeStore } from '@src/stores/theme';

type Props = {
  withNode?: boolean;
  theme?: string;
};

const props = defineProps<Props>();

const themeStore = useThemeStore();
const theme = computed<ThemeInstance>(() => ({
  theme: props.theme ?? themeStore.theme,
  seed: themeStore.seed,
}));

provide(themeContextKey, theme);
</script>
