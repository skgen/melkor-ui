<template>
  <span
    v-theme="theme"
    class="mk-AppIcon"
    :data-fill="props.fill || undefined"
    :data-shape="shape"
  >
    {{ props.icon }}
  </span>
</template>

<script lang="ts" setup>
import useGlobalConfig from '@src/composables/useGlobalConfig';
import useTheme from '@src/composables/useTheme';
import { IconShape } from '@src/definition';
import { computed } from 'vue';

type Props = {
  icon: string;
  fill?: boolean;
  rounded?: boolean;
  sharp?: boolean;
};

const props = defineProps<Props>();

const fillSetting = computed(() => (props.fill ? 1 : 0));

const { theme } = useTheme();

const config = useGlobalConfig();

const shape = computed(() => {
  if (props.rounded) {
    return 'rounded';
  }
  if (props.sharp) {
    return 'sharp';
  }
  if (config.components?.icon?.shape === IconShape.sharp) {
    return 'sharp';
  }
  return 'rounded';
});
</script>

<style lang="scss">
.mk-AppIcon {
    --mk-icon-size: inherit;
    --mk-icon-line-height: 1;
    --mk-icon-color: currentcolor;
    --mk-icon-weight: 400;

    display: inline-block;
    font-size: var(--mk-icon-size);
    font-variation-settings: "FILL" v-bind(fillSetting), "wght" var(--mk-icon-weight);
    font-style: normal;
    font-weight: normal;
    font-feature-settings: "liga";
    line-height: var(--mk-icon-line-height);
    color: var(--mk-icon-color);
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    -webkit-font-smoothing: antialiased;

    &[data-shape="rounded"] {
        font-family: "Material Symbols Rounded", sans-serif;
    }

    &[data-shape="sharp"] {
        font-family: "Material Symbols Sharp", sans-serif;
    }
}
</style>
