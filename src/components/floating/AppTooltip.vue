<template>
  <Tooltip
    ref="root"
    v-bind="props"
    class="mk-AppTooltip"
    :data-fill="props.fill || undefined"
    @hide="handleHide"
  >
    <slot />
    <template #popper>
      <slot name="tooltip" />
    </template>
  </Tooltip>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Tooltip } from 'floating-vue';
import useFloatingModal from '@src/composables/useFloatingModal';

type Props = {
  fill?: boolean;
};

const props = defineProps<Props>();

const root = ref<typeof Tooltip | null>(null);

const { handleHide } = useFloatingModal({
  floatingEl: root,
});

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppTooltip {
    display: inline-block;

    &[data-fill="true"] {
        @include mk-fill;
    }
}

.v-popper {
    $this: &;

    &--theme-tooltip {
        // --mk-tooltip-text-color: var(--app-text-color-on-primary);
        --mk-tooltip-text-color: var(--app-text-color-on-surface);

        // --mk-tooltip-background-color: var(--app-primary-color);
        --mk-tooltip-background-color: var(--app-background-color-surface);

        z-index: initial;
        visibility: visible !important;

        &[data-popper-placement^="top"] {

            #{$this} {
                &__arrow {
                    &-outer {
                        left: -2px;
                        transform: translate(0, -0.5px);
                    }
                }
            }
        }

        &#{$this}__popper {
            &--shown,
            &--hidden {
                // Dont forget to change FloatingVue.options.disposeTimeout in tooltip.ts
                transition: opacity var(--app-transition-duration-opacity) !important;
            }
        }

        #{$this} {
            &__inner {
                padding: var(--app-m-1) var(--app-m-2);
                color: var(--mk-tooltip-text-color);
                background-color: transparent;
                border-radius: 50px;
                box-shadow: none;

                &::before {
                    @include pseudo;

                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: var(--mk-tooltip-background-color);
                    opacity: 0.8;
                }
            }

            &__arrow {
                &-container {
                    opacity: 0.8;
                }

                &-outer {
                    border-color: var(--mk-tooltip-background-color);
                }
            }
        }
    }
}
</style>
