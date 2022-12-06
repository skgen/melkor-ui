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
    --input-hint-color: var(--app-error-color);

    font-size: 0.75rem;
    color: var(--input-hint-color);
    white-space: pre-line;
}
</style>
