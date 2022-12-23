<template>
  <Menu
    ref="root"
    class="mk-AppMenu"
    v-bind="spreadProps"
    :shown="props.modelValue"
    :data-fill="props.fill || undefined"
    :auto-hide="props.autoHide"
    :placement="props.placement"
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
import { Menu } from 'floating-vue';
import { computed, ref } from 'vue';

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

const { handleHide: handleFloatingHide } = useFloatingModal({
  floatingEl: root,
});

const spreadProps = computed(() => {
  const { fill, modelValue, ...p } = props;
  return p;
});

function handleHide() {
  if (!props.modelValue) {
    return;
  }
  if (props.autoHide) {
    emit('update:modelValue', false);
    emit('hide');
  }

  handleFloatingHide();
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppMenu {
    display: inline-block;

    &[data-fill="true"] {
        @include mk-fill;
    }
}

.v-popper {
    $this: &;

    &--theme-menu {
        z-index: initial;
        visibility: visible !important;

        --mk-menu-text-color: var(--app-text-color-on-surface);
        --mk-menu-background-color: var(--app-background-color);

        &#{$this}__popper {
            &--shown,
            &--hidden {
                // Dont forget to change FloatingVue.options.disposeTimeout in tooltip.ts
                transition: opacity var(--app-transition-duration-opacity) !important;
            }
        }

        #{$this} {
            &__inner {
                color: var(--mk-menu-text-color);
                background-color: var(--mk-menu-background-color);
                border: 1px solid var(--app-border-color);
                box-shadow: none;
            }

            &__arrow {
                &-container {
                    display: none;
                }
            }
        }
    }
}
</style>
