<template>
  <div
    id="mk-floating-layer"
    v-theme="theme"
    class="mk-TheFloatingLayer"
  />
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

const { theme } = useTheme();
</script>

<style lang="scss">
@import "@style/mixins";

.mk-TheFloatingLayer {
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--app-floating-layer-order);
    width: 100%;
}

</style>
