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
    color: red;
}
</style>
