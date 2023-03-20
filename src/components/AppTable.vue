<template>
  <table
    v-theme="theme"
    class="mk-AppTable"
  >
    <thead
      v-if="isValue(renderHeaders) && renderHeaders.length > 0"
      class="mk-AppTable-head"
    >
      <AppTableRow
        :y="-1"
        :is-odd="-1 % 2 !== 0"
        :is-current="getIsCurrentRow(-1)"
      >
        <template
          v-for="(header, index) in renderHeaders"
          :key="header.key"
        >
          <AppTableCell
            v-if="!isHiddenKey(header.key)"
            header
            :x-key="header.key"
            :x="index"
            :y="-1"
            :is-filtered-x="isFilteredKey(header.key)"
            @click="() => isSortable(header.key) ? handleHeaderClick(header) : void 0"
          >
            <slot
              :name="`header-${header.key}`"
              :value="header.value"
              :pos="{ x: index, y: -1, key: header.key}"
              :entry="header"
            />
            <template v-if="!$slots[`header-${header.key}`]">
              <span class="mk-AppTable-head-entry">
                <span
                  v-if="header.value"
                  class="mk-AppTable-head-text"
                >
                  {{ header.value }}
                </span>
                <mk-icon
                  v-if="header.key === activeHeaderKey && headerIcon"
                  :icon="headerIcon"
                />
              </span>
            </template>
          </AppTableCell>
        </template>
      </AppTableRow>
    </thead>
    <tbody
      v-if="renderItems.length > 0"
      class="mk-AppTable-body"
    >
      <AppTableRow
        v-for="(item, y) in renderItems"
        :key="y"
        :y="y"
        :is-odd="y % 2 !== 0"
        :is-current="getIsCurrentRow(y)"
      >
        <template
          v-for="(key, x) in keys"
          :key="x"
        >
          <AppTableCell
            v-if="!getCellState([x, y, key]).isHidden"
            :x-key="key"
            :x="x"
            :y="y"
            :is-current="getCellState([x, y, key]).isCurrent"
            :is-current-x="getCellState([x, y, key]).isCurrentX"
            :is-current-y="getCellState([x, y, key]).isCurrentY"
            :is-filtered-x="getCellState([x, y, key]).isFilteredX"
            :is-target="getCellState([x, y, key]).isTarget"
            :has-target="getCellState([x, y, key]).hasTarget"
            :is-top-target="getCellState([x, y, key]).isTopTarget"
            :is-right-target="getCellState([x, y, key]).isRightTarget"
            :is-bottom-target="getCellState([x, y, key]).isBottomTarget"
            :is-left-target="getCellState([x, y, key]).isLeftTarget"
            :is-odd="getCellState([x, y, key]).isOdd"
            @mouseover="() => handleMouseOverCell([x, y, key])"
            @mouseleave="() => handleMouseLeaveCell([x, y, key])"
          >
            <slot
              :name="key"
              :value="item[key]"
              :pos="{ x, y, key}"
              :entry="item"
            />
            <template v-if="!$slots[key]">
              <template v-if="key === '__index'">
                {{ (item[key] as number) + 1 }}
              </template>
              <template v-else>
                {{ item[key] }}
              </template>
            </template>
          </AppTableCell>
        </template>
      </AppTableRow>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import AppTableRow from '@src/components/AppTableRow.vue';
import AppTableCell from '@src/components/AppTableCell.vue';
import {
  isDef, isNumber, isString, isValue,
} from '@src/lib/modules/definition';
import type {
  TableHeader, TableKey, TableItemLeadingKeys, TableItemTrailingKeys,
} from '@src/definition';
import useTheme from '@src/composables/useTheme';

type Value = {
  [key: string]: unknown;
};

type HeaderValue = unknown;

// x, y, key
type CellPos = [number, number, keyof Value];
// y, key
type RowPos = number;

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
  isHidden: boolean;
};

type StateMatrix = { [key: string]: CellState };

type Props = {
  headers?: TableHeader<Value, HeaderValue>[];
  items: Value[];
  indexRows?: boolean;
  sortableKeys?: TableKey<Value>[];
  hiddenKeys?: TableKey<Value>[];
  activeColumn?: TableHeader<Value, HeaderValue>['key'];
};

const props = withDefaults(defineProps<Props>(), {
  headers: undefined,
  sortableKeys: () => [],
  hiddenKeys: () => [],
  activeColumn: undefined,
});

const { theme } = useTheme();

const leadingInternalKeys = computed(() => {
  const keys: (keyof TableItemLeadingKeys)[] = [];
  if (props.indexRows) {
    keys.push('__index');
  }
  return keys;
});
const trailingInternalKeys: (keyof TableItemTrailingKeys)[] = [];

const keys = computed<TableKey<Value>[]>(() => {
  let headerKeys: TableKey<Value>[] = [];
  if (isValue(props.headers)) {
    headerKeys = props.headers.map((header) => header.key);
  }
  const rawKeys: string[] = [];
  props.items.forEach((item) => rawKeys.push(...Object.keys(item)));
  const itemKeys = new Set([...headerKeys, ...rawKeys]);
  return [
    ...leadingInternalKeys.value,
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
    const header = headers.find((h) => h.key === key) ?? null;
    return { value: header?.value ?? null, key };
  });
});

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
  return renderHeaders.value.find((header) => header.key === activeHeaderKey.value) ?? null;
});

const currentCell = ref<CellPos | null>(null);
const currentRow = ref<RowPos | null>(null);

type EnhancedItem = TableItemLeadingKeys & TableItemTrailingKeys & Value;

const enhancedItems = computed(() => props.items.map<EnhancedItem>((item, index) => {
  let leading: TableItemLeadingKeys = {};
  if (props.indexRows) {
    leading = { ...leading, __index: index };
  }
  const trailing: TableItemTrailingKeys = {};
  const itemFilled: Value = { ...item };
  for (const key of keys.value) {
    if (
      !isDef(itemFilled[key])
      && !leadingInternalKeys.value.includes(key as keyof TableItemLeadingKeys)
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
    const itemA = activeHeaderSort.value === HeaderSort.ASC ? a[header.key] : b[header.key];
    const itemB = activeHeaderSort.value === HeaderSort.ASC ? b[header.key] : a[header.key];
    if (isString(itemA) && isString(itemB)) {
      return itemA.localeCompare(itemB);
    }
    if (isNumber(itemA) && isNumber(itemB)) {
      return itemA - itemB;
    }
    throw new Error('Elements of the same column must have same type');
  });
});

function isCell(refPos: CellPos, targetPos: CellPos) {
  const [xRef, yRef] = refPos;
  const [xTarget, yTarget] = targetPos;
  return xRef === xTarget && yRef === yTarget;
}

function isSortable(key: TableKey<Value>) {
  return props.sortableKeys.includes(key);
}

function getTarget(): CellPos | null {
  if (!isValue(activeHeaderKey.value) || !isValue(currentCell.value)) {
    return null;
  }
  const currentY = currentCell.value[1];
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
  const currentY = currentCell.value[1];
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
  const refKey = isDef(props.activeColumn) ? props.activeColumn : activeHeader.value?.key;
  return key === refKey;
}

function handleHeaderClick(header: TableHeader<Value, HeaderValue>) {
  if (!isValue(activeHeaderKey.value) || activeHeaderKey.value !== header.key) {
    activeHeaderKey.value = header.key;
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

function isHiddenKey(key: TableKey<Value>) {
  return props.hiddenKeys.includes(key);
}

const stateMatrix = computed<StateMatrix>(() => {
  const matrix: StateMatrix = {};
  const target = getTarget();
  for (let y = 0; y < renderItems.value.length; y += 1) {
    for (let x = 0; x < keys.value.length; x += 1) {
      const key = keys.value[x];
      const pos: CellPos = [x, y, key];
      const isCX = isCurrentX(x);
      const isCY = isCurrentY(y);
      const isFX = isFilteredKey(key);
      const isHidden = isHiddenKey(key);
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
        isHidden,
      };
    }
  }
  return matrix;
});

function getCellState(pos: CellPos) {
  return stateMatrix.value[stateMatrixKey(pos)];
}

function getIsCurrentRow(y: number) {
  return currentRow.value === y;
}

watch(currentCell, (newCurrentCell) => {
  if (!isValue(newCurrentCell)) {
    currentRow.value = null;
  } else {
    // eslint-disable-next-line prefer-destructuring
    currentRow.value = newCurrentCell[1];
  }
});

</script>

<style lang="scss">
.mk-AppTable {
    width: 100%;
    height: 1px;
    border-collapse: collapse;

    &-head {
        &-text {
            font-weight: 500;
        }

        &-entry {
            display: flex;
            gap: var(--app-m-1);
            align-items: center;

            .mk-AppIcon {
                --mk-icon-size: 12px;
            }
        }
    }
}
</style>
