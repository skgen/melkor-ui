<template>
  <td
    v-theme="theme"
    class="mk-AppTableCell"
    :data-header="props.header || undefined"
    :data-key="props.xKey ?? undefined"
    :data-x="props.x ?? undefined"
    :data-y="props.y ?? undefined"
    :data-is-current="props.isCurrent || undefined"
    :data-is-current-x="props.isCurrentX || undefined"
    :data-is-current-y="props.isCurrentY || undefined"
    :data-is-filtered-x="props.isFilteredX || undefined"
    :data-is-target="props.isTarget || undefined"
    :data-has-target="props.hasTarget || undefined"
    :data-is-top-target="props.isTopTarget || undefined"
    :data-is-right-target="props.isRightTarget || undefined"
    :data-is-bottom-target="props.isBottomTarget || undefined"
    :data-is-left-target="props.isLeftTarget || undefined"
    :data-is-odd="props.isOdd|| undefined"
  >
    <div class="mk-AppTableCell-content">
      <slot />
    </div>
  </td>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

type Props = {
  header?: boolean;
  xKey?: string | number;
  x?: number;
  y?: number;
  isCurrent?: boolean;
  isCurrentX?: boolean;
  isCurrentY?: boolean;
  isFilteredX?: boolean;
  isTarget?: boolean;
  hasTarget?: boolean;
  isTopTarget?: boolean;
  isRightTarget?: boolean;
  isLeftTarget?: boolean;
  isBottomTarget?: boolean;
  isOdd?: boolean;
};

const props = withDefaults(
  defineProps<Props>(),
  {
    header: false,
    xKey: undefined,
    x: undefined,
    y: undefined,
  },
);

const { theme } = useTheme();

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppTableCell {
    @include light {
        // Cell
        --mk-table-cell-background-color-active: rgb(var(--app-primary-tone-color) / 0.1);
        --mk-table-cell-background-color-highlighted: rgb(var(--app-primary-tone-color) / 0.05);
        --mk-table-cell-border-color-active: rgb(var(--app-primary-tone-color) / 0.4);
        --mk-table-cell-border-color-highlighted: rgb(var(--app-primary-tone-color) / 0.2);

        // Header
        --mk-table-cell-header-background-color-highlighted: rgb(var(--app-primary-tone-color) / 0.15);
        --mk-table-cell-header-border-color: var(--c-grey-70);
    }

    @include dark {
        // Cell
        --mk-table-cell-background-color-active: rgb(var(--app-primary-tone-color) / 0.35);
        --mk-table-cell-background-color-highlighted: rgb(var(--app-primary-tone-color) / 0.2);
        --mk-table-cell-border-color-active: rgb(var(--app-primary-tone-color) / 0.5);
        --mk-table-cell-border-color-highlighted: rgb(var(--app-primary-tone-color) / 0.4);

        // Header
        --mk-table-cell-header-background-color-highlighted: rgb(var(--app-primary-tone-color) / 0.3);
        --mk-table-cell-header-border-color: var(--c-grey-50);
    }

    // Cell
    --mk-table-cell-background-color: var(--app-background-color);
    --mk-table-cell-border-color: var(--app-border-color);
    --mk-table-cell-padding-x: var(--app-m-2);
    --mk-table-cell-padding-y: var(--app-m-1);

    // Header
    --mk-table-cell-header-background-color: var(--app-background-color-highlight);

    // Row
    --mk-table-cell-row-odd-background-color: var(--app-background-color-soft);

    $this: &;

    height: 100%;
    padding: 0;
    border-bottom: 1px solid var(--mk-table-cell-border-color);

    &-content {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        padding: var(--mk-table-cell-padding-y) var(--mk-table-cell-padding-x);
        background-color: var(--mk-table-cell-background-color);
    }

    & + & {
        border-left: 1px solid var(--mk-table-cell-border-color);
    }

    &[data-header="true"] {

        #{$this} {
            border-color: var(--mk-table-cell-header-border-color);

            &-content {
                background-color: var(--mk-table-cell-header-background-color);
            }
        }

        &[data-is-filtered-x="true"] {
            border-bottom-color: var(--mk-table-cell-border-color);

            #{$this} {
                &-content {
                    background-color: var(--mk-table-cell-header-background-color-highlighted);
                }
            }
        }

        &:hover {
            cursor: pointer;
        }
    }

    &[data-is-odd="true"] {

        #{$this} {
            &-content {
                background-color: var(--mk-table-cell-row-odd-background-color);
            }
        }
    }

    &[data-is-current-y="true"] {
        border-color: var(--mk-table-cell-border-color-highlighted);

        #{$this} {
            &-content {
                background-color: var(--mk-table-cell-background-color-highlighted);
            }
        }
    }

    // &[data-is-current-x="true"] {
    // }

    // &[data-is-current="true"] {
    // }

    &[data-is-filtered-x="true"] {
        #{$this} {
            &-content {
                background-color: var(--mk-table-cell-background-color-highlighted);
            }
        }
    }

    // &[data-has-target="true"] {
    // }

    &[data-is-target="true"] {
        border-color: var(--mk-table-cell-border-color);

        #{$this} {
            &-content {
                background-color: var(--mk-table-cell-background-color-active);

                &::before {
                    @include pseudo;

                    top: -1px;
                    right: -1px;
                    bottom: -1px;
                    left: -1px;
                    z-index: 1;
                    pointer-events: none;
                    border: 1px solid var(--mk-table-cell-border-color-active);
                }
            }
        }
    }

    &[data-is-top-target="true"] {
        border-bottom-color: var(--mk-table-cell-border-color);
    }

    &[data-is-right-target="true"] {
        border-left-color: var(--mk-table-cell-border-color);
    }

    // &[data-is-bottom-target="true"] {
    // }

    // &[data-is-left-target="true"] {
    // }
}
</style>
