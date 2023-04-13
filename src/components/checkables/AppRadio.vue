<template>
  <div
    class="mk-AppRadio"
    :data-is-checked="props.checked || undefined"
    :data-is-disabled="props.disabled || undefined"
  />
</template>

<script lang="ts" setup>
type Props = {
  checked?: boolean;
  disabled?: boolean;
};

const props = defineProps<Props>();
</script>

<style lang="scss">
.mk-AppRadio {
    --mk-radio-border-color: var(--app-border-color-highlight);
    --mk-radio-border-width: var(--app-input-border-width);
    --mk-radio-border-width-active: 4px;
    --mk-radio-color-active: var(--app-primary-color);
    --mk-radio-size: 16px;

    display: block;
    flex: 0 0 var(--mk-radio-size);
    width: var(--mk-radio-size);
    height: var(--mk-radio-size);
    user-select: none;
    border: var(--mk-radio-border-width) solid var(--mk-radio-border-color);
    border-radius: 50%;
    transition:
        border-width var(--app-transition-duration-color),
        border-color var(--app-transition-duration-color);

    &[data-is-checked="true"] {
        border-color: var(--mk-radio-color-active);
        border-width: var(--mk-radio-border-width-active);
    }

    &[data-is-disabled="true"] {
        border-color: var(--app-input-color-disabled);
    }
}
</style>
