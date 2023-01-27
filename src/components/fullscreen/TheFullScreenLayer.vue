<template>
  <div
    id="mk-fullscreen-layer"
    v-theme="theme"
    class="mk-TheFullScreenLayer"
  />
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

const { theme } = useTheme();
</script>

<style lang="scss">
@import "@style/mixins";

.mk-TheFullScreenLayer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--app-fullscreen-layer-order);

    &::before {
        @include pseudo;

        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: calc(var(--app-fullscreen-layer-order) + 1);
        background-color: var(--app-background-color);
        opacity: 0.8;
        transition: opacity 200ms;
    }
}

body {
    &:not([data-fullscreen-modal="true"]) {
        .mk-TheFullScreenLayer {
            pointer-events: none;
            user-select: none;

            &::before {
                opacity: 0;
            }
        }
    }

    &[data-fullscreen-modal="true"] {
        overflow: hidden;
    }
}
</style>
