<template>
  <table
    v-theme="{ scheme }"
    class="mk-AppTable"
  >
    <thead
      v-if="isValue(headers) && headers?.length > 0"
      class="mk-AppTable-head"
    >
      <AppTableRow>
        <AppTableCell
          v-for="(header, index) in headers"
          :key="header.value"
          header
          :data-filtered="isMatchingFilteredCol(index)"
          @click="() => handleHeaderClicked(header, index)"
        >
          <span class="mk-AppTable-head-entry">
            <span class="mk-AppTable-head-text">
              {{ header.text }}
            </span>
            <mk-icon
              v-if="header.value === activeHeader?.header.value"
              :icon="headerIcon"
            />
          </span>
        </AppTableCell>
      </AppTableRow>
    </thead>
    <tbody
      v-if="items.length > 0"
      class="mk-AppTable-body"
    >
      <AppTableRow
        v-for="(item, rowIndex) in items"
        :key="rowIndex"
      >
        <AppTableCell
          v-for="(key, colIndex) in keys"
          :key="colIndex"
          :data-col="key"
          :data-row="rowIndex"
          :data-current-row="isMatchingRow(rowIndex)"
          :data-current-col="isMatchingCol(key)"
          :data-filtered="isMatchingFilteredCol(colIndex)"
          :data-target="isMatchingCell([rowIndex, key, item[key]])"
          :data-row-even="rowIndex % 2 === 0"
          @mouseover="() => handleMouseOverCell([rowIndex, key, item[key]])"
          @mouseleave="() => handleMouseLeaveCell([rowIndex, key, item[key]])"
        >
          <slot
            v-if="slots[key]"
            :name="key"
            :data="item[key]"
            :pos="[rowIndex, key]"
            :entry="item"
          />
          <template v-else>
            {{ item[key] }}
          </template>
        </AppTableCell>
      </AppTableRow>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import {
  ref, computed, useSlots,
} from 'vue';
import AppTableRow from '@src/components/AppTableRow.vue';
import AppTableCell from '@src/components/AppTableCell.vue';
import { isNumber, isString, isValue } from '@src/lib/modules/definition';
import type {
  TableCellAsGeneric, TableHeader, TableItem, TableOptions,
} from '@src/definition';
import useComponentTheme from '@src/composables/useComponentTheme';

type Props = {
  headers?: TableHeader[];
  items: TableItem[];
  options?: Partial<TableOptions>;
};

const props = withDefaults(defineProps<Props>(), {
  headers: undefined,
  options: () => defaultOptions,
});

const { scheme } = useComponentTheme();

const options = computed(() => ({ ...defaultOptions, ...props.options }));

const headers = computed(() => {
  if (!options.value.indexColumns) {
    return props.headers;
  }
  return [
    { text: '', value: '__index' },
    ...props.headers,
  ];
});
const rawItems = computed(() => {
  if (!options.value.indexColumns) {
    return props.items;
  }
  return props.items.map((item, index) => ({
    __index: index,
    ...item,
  }));
});

const slots = useSlots();

enum HeaderSort {
  DESC,
  ASC,
}

const activeHeader = ref<{ header: TableHeader; order: HeaderSort } | null>(null);
const activeHeaderColIndex = ref<number | null>(null);
const hoveredCell = ref<TableCellAsGeneric | null>(null);
const keys = computed(() => {
  if (isValue(headers.value)) {
    return headers.value?.map((header) => header.value);
  }
  const rawKeys: string[] = [];
  rawItems.value.forEach((item) => rawKeys.push(...Object.keys(item)));
  return [...new Set(rawKeys)];
});

const headerIcon = computed(() => {
  if (!activeHeader.value) {
    return null;
  }
  return activeHeader.value.order === HeaderSort.ASC ? 'arrow_upward' : 'arrow_downward';
});

const items = computed(() => {
  if (!activeHeader.value) {
    return rawItems.value;
  }
  const { order, header } = activeHeader.value;
  return [...rawItems.value].sort((a, b) => {
    const itemA = order === HeaderSort.ASC ? a[header.value] : b[header.value];
    const itemB = order === HeaderSort.ASC ? b[header.value] : a[header.value];
    if (isString(itemA) && isString(itemB)) {
      return itemA.localeCompare(itemB);
    }
    if (isNumber(itemA) && isNumber(itemB)) {
      return itemA - itemB;
    }
    throw new Error('Elements of the same column must have same type');
  });
});

function isMatchingCell(tableCell: TableCellAsGeneric) {
  if (!isValue(hoveredCell.value)) {
    return false;
  }
  const [index, key, value] = hoveredCell.value;
  const [targetIndex, targetKey, targetValue] = tableCell;
  return targetIndex === index && targetKey === key && targetValue === value;
}

function isMatchingRow(index: number) {
  return (hoveredCell.value && hoveredCell.value[0] === index) ?? false;
}

function isMatchingCol(key: keyof TableItem) {
  return (hoveredCell.value && hoveredCell.value[1] === key) ?? false;
}

function isMatchingFilteredCol(index: number) {
  return index === activeHeaderColIndex.value;
}

function handleHeaderClicked(header: TableHeader, index: number) {
  if (!activeHeader.value || header.value !== activeHeader?.value.header.value) {
    activeHeader.value = {
      header,
      order: HeaderSort.DESC,
    };
    activeHeaderColIndex.value = index;
    return;
  }
  if (activeHeader.value.order === HeaderSort.DESC) {
    activeHeader.value = {
      header,
      order: HeaderSort.ASC,
    };
    activeHeaderColIndex.value = index;
    return;
  }
  activeHeader.value = null;
  activeHeaderColIndex.value = null;
}

function handleMouseOverCell(tableCell: TableCellAsGeneric) {
  hoveredCell.value = tableCell;
}

function handleMouseLeaveCell(tableCell: TableCellAsGeneric) {
  if (isMatchingCell(tableCell)) {
    hoveredCell.value = null;
  }
}

</script>

<script lang="ts">
// eslint-disable-next-line import/prefer-default-export
export const defaultOptions: Required<TableOptions> = {
  indexColumns: true,
};
</script>

<style lang="scss">
.mk-AppTable {
    width: 100%;
    font-size: 0.875rem;
    border-collapse: collapse;

    &-head {
        &-text {
            font-weight: 500;
        }

        &-entry {
            display: flex;
            gap: 5px;
            align-items: center;

            .mk-AppIcon {
                --mk-icon-size: 12px;
            }
        }
    }
}
</style>
