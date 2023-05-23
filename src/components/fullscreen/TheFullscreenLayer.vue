<template>
  <div
    id="mk-fullscreen-layer"
    v-theme="theme"
    class="mk-TheFullscreenLayer"
  />
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

const { theme } = useTheme();
</script>

<style lang="scss">
@import "@style/mixins";

.mk-TheFullscreenLayer {
    --mk-fullscreen-layer-background-color: var(--app-background-color);
    --mk-fullscreen-layer-opacity: 0.8;
    --mk-fullscreen-layer-opacity-transition-duration: var(--app-transition-duration-opacity);

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
        background-color: var(--mk-fullscreen-layer-background-color);
        opacity: var(--mk-fullscreen-layer-opacity);
        transition: opacity var(--mk-fullscreen-layer-opacity-transition-duration);
    }
}

body {
    &:not([data-is-fullscreen-layer-active="true"]) {
        .mk-TheFullscreenLayer {
            pointer-events: none;
            user-select: none;

            &::before {
                opacity: 0;
            }
        }
    }

    &[data-is-fullscreen-layer-active="true"] {
        overflow: hidden;
    }
}
  </style>
