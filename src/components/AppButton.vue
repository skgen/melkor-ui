<template>
  <button
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

type Props = {
  outlined?: boolean;
  disabled?: boolean;
  onPrimary?: boolean;
  text?: boolean;
};

const props = defineProps<Props>();

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
.mk-AppButton {
    --mk-button-border-opacity: 0.2;
    --mk-button-padding-x: var(--app-m-2);
    --mk-button-padding-y: var(--app-m-1);
    --mk-button-spacing-content: var(--app-m-1);
    --mk-button-background-color: var(--app-primary-color);
    --mk-button-text-color: var(--app-text-color-on-primary);
    --mk-button-border-color: var(--app-primary-color) / var(--mk-button-border-opacity);

    display: inline-flex;
    gap: var(--mk-button-spacing-content);
    align-items: center;
    justify-content: center;
    padding: var(--mk-button-padding-y) var(--mk-button-padding-x);
    font-weight: 500;
    color: rgb(var(--mk-button-text-color));
    cursor: pointer;
    background-color: rgb(var(--mk-button-background-color));
    border-color: rgb(var(--mk-button-border-color));
    border-width: 1px;
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
            --mk-button-border-color: var(--app-background-color-on-primary) / var(--mk-button-border-opacity);
        }
    }

    &[data-type="outlined"] {
        border-style: solid;
    }

    &[disabled] {
        cursor: not-allowed;
        opacity: var(--app-opacity-disabled);
    }

    // &:hover {
    //     border-color: rgb(var(--app-border-color-hover));
    // }
}
</style>
