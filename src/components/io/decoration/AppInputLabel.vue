<template>
  <span
    v-theme="{ scheme }"
    class="mk-AppInputLabel"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
import useComponentTheme from '@src/composables/useComponentTheme';

const { scheme } = useComponentTheme();
</script>

<style lang="scss">
.mk-AppInputLabel {
    font-weight: 500;
}
</style>
