<template>
  <button
    v-theme="theme"
    class="mk-AppButton"
    :data-type="type"
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
  return 'plain';
});
const onPrimary = computed(() => props.onPrimary || undefined);
const disabled = computed(() => props.disabled || undefined);

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppButton {
    --mk-button-padding-x: var(--app-m-2);
    --mk-button-padding-y: var(--app-m-1);
    --mk-button-bordered-padding-x: calc(var(--mk-button-padding-x) - var(--mk-button-border-width));
    --mk-button-bordered-padding-y: calc(var(--mk-button-padding-y) - var(--mk-button-border-width));
    --mk-button-spacing-content: var(--app-m-1);
    --mk-button-background-color: var(--app-primary-color);
    --mk-button-text-color: var(--app-text-color-on-primary);
    --mk-button-hollowed-text-color: var(--app-primary-color);
    --mk-button-border-color: var(--app-primary-color);
    --mk-button-border-width: 1px;
    --mk-button-border-radius: var(--app-border-radius);
    --mk-button-cursor: pointer;
    --mk-button-font-size: var(--app-font-size);
    --mk-button-line-height: var(--app-line-height);
    --mk-button-font-weight: 500;

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

    &[data-type="plain"] {
        color: var(--mk-button-text-color);
        background-color: var(--mk-button-background-color);

        &[data-on-primary="true"] {
            color: var(--app-primary-color);
            background-color: var(--app-background-color-on-primary);
            border-color: var(--app-background-color-on-primary);
        }
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
