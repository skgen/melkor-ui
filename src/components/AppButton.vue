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
    --mk-button-border-color: var(--app-primary-color);
    --mk-button-border-width: 1px;

    display: inline-flex;
    gap: var(--mk-button-spacing-content);
    align-items: center;
    justify-content: center;
    padding: var(--mk-button-padding-y) var(--mk-button-padding-x);
    font-weight: 500;
    color: var(--mk-button-text-color);
    cursor: pointer;
    background-color: var(--mk-button-background-color);
    border-color: var(--mk-button-border-color);
    border-width: var(--mk-button-border-width);
    border-radius: var(--app-border-radius);

    &:not([data-type]) {
        &[data-on-primary="true"] {
            --mk-button-background-color: var(--app-background-color-on-primary);
            --mk-button-text-color: var(--app-primary-color);
        }
    }

    &[data-type="outlined"],
    &[data-type="text"] {
        --mk-button-background-color: transparent;
        --mk-button-text-color: var(--app-primary-color);

        &[data-on-primary="true"] {
            --mk-button-text-color: var(--app-text-color-on-primary);
            --mk-button-border-color: var(--app-background-color-on-primary);
        }
    }

    &[data-type="outlined"] {
        --mk-button-padding-x: calc(var(--app-m-2) - var(--mk-button-border-width));
        --mk-button-padding-y: calc(var(--app-m-1) - var(--mk-button-border-width));

        border-style: solid;
    }

    &[disabled] {
        cursor: not-allowed;
        opacity: var(--app-opacity-disabled);
    }
}
</style>
