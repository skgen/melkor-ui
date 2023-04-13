<template>
  <div
    class="mk-AppCheckbox"
    :data-is-checked="props.checked || undefined"
    :data-is-disabled="props.disabled || undefined"
  >
    <transition-group name="mk-AppIcon">
      <slot>
        <AppIcon
          v-if="props.checked"
          icon="check"
        />
      </slot>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import AppIcon from '@src/components/AppIcon.vue';

type Props = {
  checked?: boolean;
  disabled?: boolean;
};

const props = defineProps<Props>();
</script>

<style lang="scss">
.mk-AppCheckbox {
    --mk-checkbox-border-color: var(--app-border-color-highlight);
    --mk-checkbox-border-radius: var(--app-input-border-radius);
    --mk-checkbox-border-width: var(--app-input-border-width);
    --mk-checkbox-color-active: var(--app-primary-color);
    --mk-checkbox-color-on-active: var(--app-text-color-on-primary);
    --mk-checkbox-icon-size: 14px;
    --mk-checkbox-size: 16px;

    position: relative;
    flex: 0 0 var(--mk-checkbox-size);
    width: var(--mk-checkbox-size);
    height: var(--mk-checkbox-size);
    user-select: none;
    border: var(--mk-checkbox-border-width) solid var(--mk-checkbox-border-color);
    border-radius: var(--mk-checkbox-border-radius);
    transition:
        background-color var(--app-transition-duration-background),
        border-color var(--app-transition-duration-color);

    .mk-AppIcon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        --mk-icon-size: var(--mk-checkbox-icon-size);
        --mk-icon-color: var(--mk-checkbox-color-on-active);
    }

    &[data-is-checked="true"] {
        background-color: var(--mk-checkbox-color-active);
        border-color: var(--mk-checkbox-color-active);

        &[data-is-disabled="true"] {
            background-color: var(--app-input-color-disabled);
        }
    }

    &[data-is-disabled="true"] {
        border-color: var(--app-input-color-disabled);
    }
}
</style>
