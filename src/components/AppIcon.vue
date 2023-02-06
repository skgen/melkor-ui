<template>
  <span
    v-theme="theme"
    class="mk-AppIcon"
    :data-fill="props.fill || undefined"
    :data-round="props.round || undefined"
  >
    {{ props.icon }}
  </span>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';
import { computed } from 'vue';

type Props = {
  icon: string;
  fill?: boolean;
  round?: boolean;
};

const props = defineProps<Props>();

const fillSetting = computed(() => (props.fill ? 1 : 0));

const { theme } = useTheme();
</script>

<style lang="scss">
.mk-AppIcon {
    --mk-icon-size: inherit;
    --mk-icon-color: currentcolor;
    --mk-icon-weight: 400;

    display: inline-block;
    font-family: "Material Symbols Outlined", sans-serif;
    font-size: var(--mk-icon-size);
    font-variation-settings: "FILL" v-bind(fillSetting), "wght" var(--mk-icon-weight);
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

    &[data-round="true"] {
        font-family: "Material Symbols Rounded", sans-serif;
    }
}
</style>
