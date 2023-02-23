<template>
  <Menu
    ref="root"
    class="mk-AppMenu-trigger"
    :shown="props.modelValue"
    :data-fill="props.fill || undefined"
    :auto-hide="props.autoHide"
    :placement="props.placement"
    :popper-class="spreadClass"
    @hide="handleHide"
  >
    <slot />
    <template #popper="popperProps">
      <slot
        name="menu"
        v-bind="popperProps"
      />
    </template>
  </Menu>
</template>

<script lang="ts" setup>
import useFloatingModal from '@src/composables/useFloatingModal';
import type { FloatingPlacement } from '@src/definition';
import { isValue } from '@src/lib/modules/definition';
import { Menu } from 'floating-vue';
import { computed, ref, useAttrs } from 'vue';

type Props = {
  modelValue: boolean;
  autoHide?: boolean;
  fill?: boolean;
  placement?: FloatingPlacement;
};

type Emits = {
  (event: 'update:modelValue', value : boolean): void;
  (event: 'hide'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const root = ref<typeof Menu | null>(null);

const attrs = useAttrs();

const spreadClass = computed(() => (isValue(attrs.class) ? `mk-AppMenu ${attrs.class}` : 'mk-AppMenu'));

const { handleHide: handleFloatingHide } = useFloatingModal({
  floatingEl: root,
});

function handleHide() {
  handleFloatingHide();
  if (!props.modelValue) {
    return;
  }
  if (props.autoHide) {
    emit('update:modelValue', false);
    emit('hide');
  }
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppMenu {
    --mk-menu-text-color: var(--app-text-color);
    --mk-menu-background-color: var(--app-background-color);
    --mk-menu-border-width: 1px;
    --mk-menu-border-color: var(--app-border-color);
    --mk-menu-border-radius: var(--app-border-radius);

    &-trigger {
        display: inline-block;

        &[data-fill="true"] {
            @include mk-fill;
        }
    }

    &.v-popper {
        &__popper {
            z-index: initial;
            visibility: visible !important;

            &--shown,
            &--hidden {
                // Dont forget to change FloatingVue.options.disposeTimeout in tooltip.ts
                transition: opacity var(--app-transition-duration-opacity) !important;
            }
        }
    }

    .v-popper {
        &__inner {
            color: var(--mk-menu-text-color);
            background-color: var(--mk-menu-background-color);
            border: var(--mk-menu-border-width) solid var(--mk-menu-border-color);
            border-radius: var(--mk-menu-border-radius);
            box-shadow: none;
        }

        &__arrow {
            &-container {
                display: none;
            }
        }
    }
}

</style>
