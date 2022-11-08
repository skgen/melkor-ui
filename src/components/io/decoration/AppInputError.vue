<template>
  <div
    v-theme="{ scheme }"
    class="mk-AppInputError"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import useComponentTheme from '@src/composables/useComponentTheme';

const { scheme } = useComponentTheme();
</script>

<style lang="scss">
.mk-AppInputError {
    color: red;
}
</style>
