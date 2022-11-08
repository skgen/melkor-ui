<template>
  <slot v-if="!props.withNode" />
  <div
    v-else
    v-theme="{ scheme: appThemeScheme }"
    class="mk-AppThemeContext"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue';
import { themeContextKey, type ThemeScheme } from '@src/definition';
import { useThemeStore } from '@src/stores/theme';

type Props = {
  withNode?: boolean;
  theme?: ThemeScheme;
};

const props = defineProps<Props>();

const themeStore = useThemeStore();
const appThemeScheme = computed(() => props.theme ?? themeStore.theme.scheme);

provide(themeContextKey, appThemeScheme);
</script>
