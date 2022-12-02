<template>
  <span
    v-theme="theme"
    class="mk-AppInputLabel"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

const { theme } = useTheme();
</script>

<style lang="scss">
.mk-AppInputLabel {
    font-weight: 500;
}
</style>
