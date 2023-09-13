<template>
  <span
    v-theme="theme"
    class="mk-AppInputHint"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

const { theme } = useTheme();
</script>

<style lang="scss">
.mk-AppInputHint {
    --mk-input-hint-color: var(--app-text-color-soft);
    --mk-input-hint-font-size: 0.75rem;

    font-size: var(--mk-input-hint-font-size);
    color: var(--mk-input-hint-color);
    white-space: pre-line;
}
</style>
