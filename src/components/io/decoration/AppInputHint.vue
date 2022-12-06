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
    --input-hint-color: var(--app-text-color-soft);

    font-size: 0.75rem;
    color: var(--input-hint-color);
}
</style>
