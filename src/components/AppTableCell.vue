<template>
  <td
    class="mk-AppTableCell"
    :data-header="props.header || undefined"
  >
    <slot />
  </td>
</template>

<script lang="ts" setup>

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

</script>

<style lang="scss">
@import "@style/mixins";

@include light {
    // Cell
    --mk-table-cell-border-color: var(--app-border-color);
    --mk-table-cell-border-color-highlighted: var(--app-primary-color-10);
    --mk-table-cell-background-color: var(--app-background-color);
    --mk-table-cell-background-color-highlighted: var(--app-primary-color-5);
    --mk-table-cell-background-color-active: var(--app-primary-color-15);

    // Header
    --mk-table-cell-header-border-color: var(--c-grey-90);
    --mk-table-cell-header-border-color-highlighted: var(--app-primary-color-20-highlight);
    --mk-table-header-background-color: var(--c-grey-95);
    --mk-table-header-background-color-highlighted: var(--app-primary-color-15-highlight);

    // Row
    --mk-table-row-even-background-color: var(--app-background-color-soft);
}

@include dark {
    // Cell
    --mk-table-cell-border-color: var(--app-border-color);
    --mk-table-cell-border-color-highlighted: var(--app-primary-color-10);
    --mk-table-cell-background-color: var(--app-background-color);
    --mk-table-cell-background-color-highlighted: var(--app-primary-color-5);
    --mk-table-cell-background-color-active: var(--app-primary-color-15);

    // Header
    --mk-table-cell-header-border-color: var(--c-grey-90);
    --mk-table-cell-header-border-color-highlighted: var(--app-primary-color-20-highlight);
    --mk-table-header-background-color: var(--c-grey-95);
    --mk-table-header-background-color-highlighted: var(--app-primary-color-15-highlight);

    // Row
    --mk-table-row-even-background-color: var(--app-background-color-soft);
}

.mk-AppTableCell {
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
