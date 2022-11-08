<template>
  <span
    v-theme="{ scheme }"
    class="mk-AppInputHint"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
import useComponentTheme from '@src/composables/useComponentTheme';

const { scheme } = useComponentTheme();
</script>

<style lang="scss">
.mk-AppInputHint {
    --input-hint-color: var(--app-text-color-soft);

    font-size: 0.8rem;
    color: var(--input-hint-color);
}
</style>
