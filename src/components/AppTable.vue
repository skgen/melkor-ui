<template>
  <table
    v-theme="theme"
    class="mk-AppTable"
  >
    <thead
      v-if="isValue(renderHeaders) && renderHeaders.length > 0"
      class="mk-AppTable-head"
    >
      <AppTableRow>
        <AppTableCell
          v-for="(header) in renderHeaders"
          :key="header.value"
          header
          :data-filtered="isFilteredKey(header.value)"
          @click="() => isSortable(header) ? handleHeaderClick(header) : void 0"
        >
          <span class="mk-AppTable-head-entry">
            <span
              v-if="header.text"
              class="mk-AppTable-head-text"
            >
              {{ header.text }}
            </span>
            <mk-icon
              v-if="header.value === activeHeaderKey && headerIcon"
              :icon="headerIcon"
            />
          </span>
        </AppTableCell>
      </AppTableRow>
    </thead>
    <tbody
      v-if="renderItems.length > 0"
      class="mk-AppTable-body"
    >
      <AppTableRow
        v-for="(item, y) in renderItems"
        :key="y"
      >
        <AppTableCell
          v-for="(key, x) in keys"
          :key="x"
          :data-key="key"
          :data-x="x"
          :data-y="y"
          :data-is-current="getCellState([x, y, key]).isCurrent"
          :data-is-current-x="getCellState([x, y, key]).isCurrentX"
          :data-is-current-y="getCellState([x, y, key]).isCurrentY"
          :data-is-filtered-x="getCellState([x, y, key]).isFilteredX"
          :data-is-target="getCellState([x, y, key]).isTarget"
          :data-has-target="getCellState([x, y, key]).hasTarget"
          :data-is-top-target="getCellState([x, y, key]).isTopTarget"
          :data-is-right-target="getCellState([x, y, key]).isRightTarget"
          :data-is-bottom-target="getCellState([x, y, key]).isBottomTarget"
          :data-is-left-target="getCellState([x, y, key]).isLeftTarget"
          :data-is-odd="getCellState([x, y, key]).isOdd"
          @mouseover="() => handleMouseOverCell([x, y, key])"
          @mouseleave="() => handleMouseLeaveCell([x, y, key])"
        >
          <slot
            v-if="slots[key]"
            :name="key"
            :data="item[key]"
            :pos="[x, y, key]"
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
import {
  isDef, isNumber, isString, isValue,
} from '@src/lib/modules/definition';
import type {
  TableHeader, TableItem, TableKey, TableItemLeadingKeys, TableOptions, TableItemTrailingKeys,
} from '@src/definition';
import useTheme from '@src/composables/useTheme';

// x, y, key
type CellPos = [number, number, keyof Value];

type CellState = {
  isCurrent: boolean;
  isCurrentX: boolean;
  isCurrentY: boolean;
  isFilteredX: boolean;
  isTarget: boolean;
  hasTarget: boolean;
  isTopTarget: boolean;
  isRightTarget: boolean;
  isBottomTarget: boolean;
  isLeftTarget: boolean;
  isOdd: boolean;
};

type StateMatrix = { [key: string]: CellState };

type Props = {
  headers?: TableHeader<Value>[];
  items: TableItem<Value>[];
  options?: TableOptions<Value>;
};

const props = withDefaults(defineProps<Props>(), {
  headers: undefined,
  options: () => defaultOptions,
});

const { theme } = useTheme();

const options = computed(() => ({ ...defaultOptions, ...props.options }));

const leadingInternalKeys: (keyof TableItemLeadingKeys)[] = ['__index'];
const trailingInternalKeys: (keyof TableItemTrailingKeys)[] = [];

const keys = computed<TableKey<Value>[]>(() => {
  if (isValue(props.headers)) {
    const headerKeys = props.headers.map((header) => header.value);
    return [
      ...leadingInternalKeys,
      ...headerKeys,
      ...trailingInternalKeys,
    ];
  }
  const rawKeys: string[] = [];
  props.items.forEach((item) => rawKeys.push(...Object.keys(item)));
  const itemKeys = new Set(rawKeys);
  return [
    ...leadingInternalKeys,
    ...itemKeys,
    ...trailingInternalKeys,
  ];
});

const renderHeaders = computed(() => {
  const { headers } = props;
  if (!isValue(headers)) {
    return null;
  }

  return keys.value.map((key) => {
    const header = headers.find((header) => header.value === key);
    return { value: key, text: header?.text ?? '' };
  });
});

const slots = useSlots();

enum HeaderSort {
  DESC,
  ASC,
}

const activeHeaderKey = ref<keyof Value | null>(null);
const activeHeaderSort = ref<HeaderSort | null>(null);
const activeHeader = computed(() => {
  if (!isValue(renderHeaders.value) || !isValue(activeHeaderKey.value)) {
    return null;
  }
  return renderHeaders.value.find((header) => header.value === activeHeaderKey.value) ?? null;
});

const currentCell = ref<CellPos | null>(null);

type EnhancedItem = TableItemLeadingKeys & TableItemTrailingKeys & TableItem<Value>;

const enhancedItems = computed(() => props.items.map<EnhancedItem>((item, index) => {
  const leading: TableItemLeadingKeys = {
    __index: index,
  };
  const trailing: TableItemTrailingKeys = {};
  const itemFilled: TableItem<Value> = { ...item };
  for (const key of keys.value) {
    if (
      !isDef(itemFilled[key])
      && !leadingInternalKeys.includes(key as keyof TableItemLeadingKeys)
      && !trailingInternalKeys.includes(key as keyof TableItemTrailingKeys)
    ) {
      itemFilled[key] = undefined;
    }
  }
  return {
    ...leading,
    ...itemFilled,
    ...trailing,
  } as EnhancedItem;
}));

const headerIcon = computed(() => {
  if (!isValue(activeHeaderSort.value)) {
    return null;
  }
  return activeHeaderSort.value === HeaderSort.ASC ? 'arrow_upward' : 'arrow_downward';
});

const renderItems = computed(() => {
  if (!isValue(activeHeader.value) || !isValue(activeHeaderSort.value)) {
    return enhancedItems.value;
  }

  const header = activeHeader.value;
  return [...enhancedItems.value].sort((a, b) => {
    const itemA = activeHeaderSort.value === HeaderSort.ASC ? a[header.value] : b[header.value];
    const itemB = activeHeaderSort.value === HeaderSort.ASC ? b[header.value] : a[header.value];
    if (isString(itemA) && isString(itemB)) {
      return itemA.localeCompare(itemB);
    }
    if (isNumber(itemA) && isNumber(itemB)) {
      return itemA - itemB;
    }
    throw new Error('Elements of the same column must have same type');
  });
});

const stateMatrix = computed<StateMatrix>(() => {
  const matrix: StateMatrix = {};
  const target = getTarget();
  for (let y = 0; y < renderItems.value.length; y += 1) {
    const row = renderItems.value[y];
    const keys = Object.keys(row);
    for (let x = 0; x < keys.length; x += 1) {
      const key = keys[x];
      const pos: CellPos = [x, y, key];
      const isCX = isCurrentX(x);
      const isCY = isCurrentY(y);
      const isFX = isFilteredKey(key);
      matrix[stateMatrixKey(pos)] = {
        isCurrent: isCX && isCY,
        isCurrentX: isCX,
        isCurrentY: isCY,
        isFilteredX: isFX,
        isTarget: isFX && isCY,
        hasTarget: !!target,
        isTopTarget: isTopTarget(pos, target),
        isRightTarget: isRightTarget(pos, target),
        isBottomTarget: isBottomTarget(pos, target),
        isLeftTarget: isLeftTarget(pos, target),
        isOdd: y % 2 !== 0,
      };
    }
  }
  return matrix;
});

function getCellState(pos: CellPos) {
  return stateMatrix.value[stateMatrixKey(pos)];
}

function isCell(refPos: CellPos, targetPos: CellPos) {
  const [xRef, yRef] = refPos;
  const [xTarget, yTarget] = targetPos;
  return xRef === xTarget && yRef === yTarget;
}

function isSortable(header: TableHeader<Value>) {
  const { sortableKeys } = options.value;
  return sortableKeys.includes(header.value);
}

function getTarget(): CellPos | null {
  if (!isValue(activeHeaderKey.value) || !isValue(currentCell.value)) {
    return null;
  }
  const [currentX, currentY] = currentCell.value;
  const headerX = keys.value.indexOf(activeHeaderKey.value);
  return [headerX, currentY, activeHeaderKey.value];
}

function isTopTarget(pos: CellPos, target: CellPos | null) {
  if (!isValue(target)) {
    return false;
  }
  const [x, y] = pos;
  const [targetX, targetY] = target;
  return x === targetX && y + 1 === targetY;
}

function isRightTarget(pos: CellPos, target: CellPos | null) {
  if (!isValue(target)) {
    return false;
  }
  const [x, y] = pos;
  const [targetX, targetY] = target;
  return x - 1 === targetX && y === targetY;
}

function isBottomTarget(pos: CellPos, target: CellPos | null) {
  if (!isValue(target)) {
    return false;
  }
  const [x, y] = pos;
  const [targetX, targetY] = target;
  return x === targetX && y - 1 === targetY;
}

function isLeftTarget(pos: CellPos, target: CellPos | null) {
  if (!isValue(target)) {
    return false;
  }
  const [x, y] = pos;
  const [targetX, targetY] = target;
  return x + 1 === targetX && y === targetY;
}

function isCurrentY(y: number) {
  if (!isValue(currentCell.value)) {
    return false;
  }
  const [currentX, currentY] = currentCell.value;
  return currentY === y;
}

function isCurrentX(x: number) {
  if (!isValue(currentCell.value)) {
    return false;
  }
  const [currentX] = currentCell.value;
  return currentX === x;
}

function isFilteredKey(key: keyof Value) {
  return key === activeHeader.value?.value;
}

function handleHeaderClick(header: TableHeader<Value>) {
  if (!isValue(activeHeaderKey.value) || activeHeaderKey.value !== header.value) {
    activeHeaderKey.value = header.value;
    activeHeaderSort.value = HeaderSort.DESC;
    return;
  }
  if (isValue(activeHeaderSort.value) && activeHeaderSort.value === HeaderSort.DESC) {
    activeHeaderSort.value = HeaderSort.ASC;
    return;
  }
  activeHeaderKey.value = null;
  activeHeaderSort.value = null;
}

function handleMouseOverCell(pos: CellPos) {
  currentCell.value = pos;
}

function handleMouseLeaveCell(pos: CellPos) {
  if (isValue(currentCell.value) && isCell(pos, currentCell.value)) {
    currentCell.value = null;
  }
}

function stateMatrixKey(pos: CellPos) {
  const [x, y, key] = pos;
  return `${x}-${y}-${key}`;
}

</script>

<script lang="ts">
type Value = {
  [key: string]: unknown;
};

// eslint-disable-next-line import/prefer-default-export
export const defaultOptions: Required<TableOptions<Value>> = {
  indexColumns: true,
  sortableKeys: [],
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
