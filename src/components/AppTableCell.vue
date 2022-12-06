<template>
  <td
    v-theme="theme"
    class="mk-AppTableCell"
    :data-header="props.header || undefined"
  >
    <slot />
  </td>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

type Props = {
  header?: boolean;
  highlighted? : boolean;
  active? : boolean;
};

const props = withDefaults(
  defineProps<Props>(),
  {
    header: false,
    highlighted: false,
    active: false,
  },
);

const { theme } = useTheme();

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppTableCell {
    // Cell
    --mk-table-cell-border-color: var(--app-border-color);
    --mk-table-cell-border-color-highlighted: rgb(var(--app-primary-tone-color) / 0.1);
    --mk-table-cell-background-color: var(--app-background-color);
    --mk-table-cell-background-color-highlighted: rgb(var(--app-primary-tone-color) / 0.05);
    --mk-table-cell-background-color-active: rgb(var(--app-primary-tone-color) / 0.15);

    // Header
    --mk-table-cell-header-border-color: var(--c-grey-90);
    --mk-table-cell-header-border-color-highlighted: rgb(var(--app-primary-tone-color) / 0.2);
    --mk-table-header-background-color: var(--c-grey-95);
    --mk-table-header-background-color-highlighted: rgb(var(--app-primary-tone-color) / 0.15);

    // Row
    --mk-table-row-even-background-color: var(--app-background-color-soft);

    position: relative;
    padding: var(--app-m-1) var(--app-m-2);
    background-color: var(--mk-table-cell-background-color);
    border-bottom: 1px solid var(--mk-table-cell-border-color);

    & + & {
        border-left: 1px solid var(--mk-table-cell-border-color);
    }

    &[data-header="true"] {
        --mk-table-cell-background-color: var(--mk-table-header-background-color);
        --mk-table-cell-border-color: var(--mk-table-cell-header-border-color);

        &[data-filtered="true"] {
            --mk-table-cell-background-color: var(--mk-table-header-background-color-highlighted);
            --mk-table-cell-border-color: var(--mk-table-cell-header-border-color-highlighted);
        }

        &:hover {
            cursor: pointer;
        }
    }

    &[data-row-even="true"] {
        --mk-table-cell-background-color: var(--mk-table-row-even-background-color);
    }

    &[data-current-row="true"] {
        border-bottom-color: var(--mk-table-cell-border-color-highlighted);
    }

    &[data-current-row="true"],
    &[data-filtered="true"] {
        --mk-table-cell-background-color: var(--mk-table-cell-background-color-highlighted);
    }

    &[data-current-row="true"][data-filtered="true"] {
        --mk-table-cell-background-color: var(--mk-table-cell-background-color-active);
    }

    &[data-target="true"] {
        // custom style for target
    }
}
</style>
