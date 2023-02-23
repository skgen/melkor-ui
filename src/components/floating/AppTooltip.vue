<template>
  <Tooltip
    ref="root"
    class="mk-AppTooltip-trigger"
    :popper-class="spreadClass"
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
import { computed, ref, useAttrs } from 'vue';
import { Tooltip } from 'floating-vue';
import useFloatingModal from '@src/composables/useFloatingModal';
import { isValue } from '@src/lib/modules/definition';

type Props = {
  fill?: boolean;
};

const props = defineProps<Props>();

const root = ref<typeof Tooltip | null>(null);

const attrs = useAttrs();

const spreadClass = computed(() => (isValue(attrs.class) ? `mk-AppTooltip ${attrs.class}` : 'mk-AppTooltip'));

const { handleHide } = useFloatingModal({
  floatingEl: root,
});

</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppTooltip {
    --mk-tooltip-text-color: var(--app-text-color-on-contrast);
    --mk-tooltip-background-color: var(--app-background-color-contrast);
    --mk-tooltip-background-opacity: 0.8;
    --mk-tooltip-padding-x: var(--app-m-2);
    --mk-tooltip-padding-y: var(--app-m-1);
    --mk-tooltip-border-color: var(--mk-tooltip-background-color);
    --mk-tooltip-border-radius: 2000px;
    --mk-tooltip-border-width: 0;

    &-trigger {
        display: inline-block;

        &[data-fill="true"] {
            @include mk-fill;
        }
    }

    &.v-popper {
        $this: &;

        &__popper {
            z-index: initial;
            visibility: visible !important;

            &--shown,
            &--hidden {
                // Dont forget to change FloatingVue.options.disposeTimeout in tooltip.ts
                transition: opacity var(--app-transition-duration-opacity) !important;
            }

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
        }
    }

    .v-popper {
        &__inner {
            padding: var(--mk-tooltip-padding-y) var(--mk-tooltip-padding-x);
            color: var(--mk-tooltip-text-color);
            background-color: transparent;
            border-radius: var(--mk-tooltip-border-radius);
            box-shadow: none;

            &::before {
                @include pseudo;

                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--mk-tooltip-background-color);
                border: var(--mk-tooltip-border-width) solid var(--mk-tooltip-border-color);
                border-radius: var(--mk-tooltip-border-radius);
                opacity: var(--mk-tooltip-background-opacity);
            }
        }

        &__arrow {
            &-container {
                opacity: var(--mk-tooltip-background-opacity);
            }

            &-outer {
                border-color: var(--mk-tooltip-border-color);
            }
        }
    }
}

</style>
