<template>
  <div
    v-theme="{ scheme: themeStore.theme.scheme }"
    class="mk-TheApp"
  >
    <AppThemeContext>
      <slot />
      <teleport to="body">
        <TheFloatingLayer />
      </teleport>
      <teleport to="body">
        <TheFullScreenLayer />
      </teleport>
    </AppThemeContext>
  </div>
</template>

<script lang="ts" setup>
import TheFullScreenLayer from '@src/components/layout/TheFullScreenLayer.vue';
import TheFloatingLayer from '@src/components/floating/TheFloatingLayer.vue';
import AppThemeContext from '@src/components/AppThemeContext.vue';
import { useThemeStore } from '@src/stores/theme';

const themeStore = useThemeStore();
</script>

<style lang="scss">
body[data-fs-modal="true"] {
    .mk-TheApp {
        filter: blur(1px);
    }
}
</style>
