<template>
  <div
    v-theme="theme"
    class="mk-TheApp"
  >
    <AppThemeContext>
      <slot />
      <teleport to="body">
        <TheFloatingLayer />
      </teleport>
      <teleport to="body">
        <TheFullscreenLayer />
      </teleport>
    </AppThemeContext>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import TheFullscreenLayer from '@src/components/fullscreen/TheFullscreenLayer.vue';
import TheFloatingLayer from '@src/components/floating/TheFloatingLayer.vue';
import AppThemeContext from '@src/components/AppThemeContext.vue';
import { useThemeStore } from '@src/stores/theme';
import type { ThemeInstance } from '@src/definition';

const themeStore = useThemeStore();
const theme = computed<ThemeInstance>(() => ({
  theme: themeStore.theme,
  seed: themeStore.seed,
}));
</script>

<style lang="scss">
body[data-fullscreen-modal="true"] {
    .mk-TheApp {
        filter: blur(1px);
    }
}
</style>
