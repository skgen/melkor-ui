<template>
  <button
    v-theme="theme"
    class="mk-AppButton"
    :data-type="type"
    :data-size="size"
    :data-on-primary="onPrimary"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import useTheme from '@src/composables/useTheme';

type Props = {
  outlined?: boolean;
  disabled?: boolean;
  onPrimary?: boolean;
  text?: boolean;
  light?: boolean;
  wide?: boolean;
};

const props = defineProps<Props>();

const { theme } = useTheme();

const type = computed(() => {
  if (props.text) {
    return 'text';
  }
  if (props.outlined) {
    return 'outlined';
  }
  if (props.light) {
    return 'light';
  }
  return 'plain';
});

const size = computed(() => {
  if (props.wide) {
    return 'wide';
  }
  return undefined;
});

const onPrimary = computed(() => props.onPrimary || undefined);
const disabled = computed(() => props.disabled || undefined);

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppButton {
    --mk-button-padding-x: var(--app-m-2);
    --mk-button-padding-y: var(--app-m-1);
    --mk-button-spacing-content: var(--app-m-1);
    --mk-button-background-color: var(--app-primary-color);
    --mk-button-text-color: var(--app-text-color-on-primary);
    --mk-button-hollowed-text-color: var(--app-primary-color);
    --mk-button-light-text-color: var(--app-text-color);
    --mk-button-border-color: var(--app-primary-color);
    --mk-button-border-width: 1px;
    --mk-button-border-radius: var(--app-border-radius);
    --mk-button-cursor: pointer;
    --mk-button-font-size: var(--app-font-size);
    --mk-button-line-height: var(--app-line-height);
    --mk-button-font-weight: 500;

    // Bordered
    --mk-button-bordered-padding-x: calc(var(--mk-button-padding-x) - var(--mk-button-border-width));
    --mk-button-bordered-padding-y: calc(var(--mk-button-padding-y) - var(--mk-button-border-width));

    // Wide
    --mk-button-wide-font-size: calc(var(--app-font-size) * 1.2);
    --mk-button-wide-bordered-padding-x: calc(var(--mk-button-wide-padding-x) - var(--mk-button-border-width));
    --mk-button-wide-bordered-padding-y: calc(var(--mk-button-wide-padding-y) - var(--mk-button-border-width));
    --mk-button-wide-padding-x: calc(var(--app-m-2) * 1.5);
    --mk-button-wide-padding-y: calc(var(--app-m-1) * 1.5);

    @include light {
        --mk-button-light-background-color: rgb(var(--app-primary-tone-color) / 0.1);
    }

    @include dark {
        --mk-button-light-background-color: rgb(var(--app-primary-tone-color) / 0.35);
    }

    display: inline-flex;
    gap: var(--mk-button-spacing-content);
    align-items: center;
    justify-content: center;
    padding: var(--mk-button-padding-y) var(--mk-button-padding-x);
    font-size: var(--mk-button-font-size);
    font-weight: var(--mk-button-font-weight);
    line-height: var(--mk-button-line-height);
    cursor: var(--mk-button-cursor);
    border-color: var(--mk-button-border-color);
    border-width: var(--mk-button-border-width);
    border-radius: var(--mk-button-border-radius);

    &[data-size="wide"] {
        padding: var( --mk-button-wide-padding-y) var(--mk-button-wide-padding-x);
        font-size: var(--mk-button-wide-font-size);
    }

    &[data-type="plain"], &[data-type="light"] {
        &[data-on-primary="true"] {
            color: var(--app-primary-color);
            background-color: var(--app-background-color-on-primary);
            border-color: var(--app-background-color-on-primary);
        }
    }

    &[data-type="plain"] {
        color: var(--mk-button-text-color);
        background-color: var(--mk-button-background-color);
    }

    &[data-type="light"] {
        color: var(--mk-button-light-text-color);
        background-color: var(--mk-button-light-background-color);
    }

    &[data-type="outlined"],
    &[data-type="text"] {
        color: var(--mk-button-hollowed-text-color);
        background-color: transparent;

        &[data-on-primary="true"] {
            color: var(--app-text-color-on-primary);
        }
    }

    &[data-type="outlined"] {
        padding: var(--mk-button-bordered-padding-y) var(--mk-button-bordered-padding-x);
        border-style: solid;

        &[data-size="wide"] {
            padding: var(--mk-button-wide-bordered-padding-y) var(--mk-button-wide-bordered-padding-x);
        }

        &[data-on-primary="true"] {
            border-color: var(--app-background-color-on-primary);
        }
    }

    &[disabled] {
        cursor: not-allowed;
        opacity: var(--app-opacity-disabled);
    }
}
</style>
