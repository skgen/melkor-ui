<template>
  <div
    v-theme="theme"
    class="mk-AppInputError"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

const { theme } = useTheme();
</script>

<style lang="scss">
.mk-AppInputError {
    --mk-input-error-color: var(--app-error-color);
    --mk-input-error-font-size: 0.75rem;

    font-size: var(--mk-input-error-font-size);
    color: var(--mk-input-error-color);
    white-space: pre-line;
}
</style>
