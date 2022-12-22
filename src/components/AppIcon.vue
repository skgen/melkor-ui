<template>
  <span
    v-theme="theme"
    class="mk-AppIcon"
    :data-fill="props.fill || undefined"
  >
    {{ props.icon }}
  </span>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

type Props = {
  icon: string;
  fill?: boolean;
};

const props = defineProps<Props>();

const { theme } = useTheme();
</script>

<style lang="scss">
.mk-AppIcon {
    --mk-icon-size: inherit;
    --mk-icon-color: currentcolor;

    display: inline-block;
    font-family: "Material Symbols Outlined", sans-serif;
    font-size: var(--mk-icon-size);
    font-style: normal;
    font-weight: normal;
    font-feature-settings: "liga";
    color: var(--mk-icon-color);
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    -webkit-font-smoothing: antialiased;

    &[data-fill="true"] {
        font-variation-settings: "FILL" 1;
    }
}
</style>
