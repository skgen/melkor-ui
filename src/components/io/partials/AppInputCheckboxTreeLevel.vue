<template>
  <div class="pux-AppInputCheckboxTreeLevel">
    <AppInputCheckbox
      :model-value="props.input.state"
      v-bind="props.input.options"
      @update:model-value="handleInputChange"
    >
      <template
        v-if="props.children && (someCheckboxTreeLevelsChecked && !allCheckboxTreeLevelsChecked)"
        #checked-icon
      >
        <AppIcon icon="remove" />
      </template>
    </AppInputCheckbox>
    <template v-if="props.children">
      <AppInputCheckboxTreeLevel
        v-for="(level, index) in props.children"
        :key="index"
        v-bind="level"
        @update:level="(newLevel) => handleChildLevelChange(newLevel, index)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { CheckboxInputModel, InputState, CheckboxTreeLevel } from '@src/definition';
import AppInputCheckbox from '@src/components/io/AppInputCheckbox.vue';
import AppIcon from '@src/components/AppIcon.vue';
import isEqual from 'lodash/isEqual';
import { computed } from 'vue';
import { validateInputState } from '@src/composables/useInput';
import { isDef, isValue } from '@src/lib/modules/definition';

type Props = {
  input: CheckboxInputModel<Value, Value>;
  children?: CheckboxTreeLevel<Value, Value>[];
};

type Emits = {
  (event: 'update:level', value: CheckboxTreeLevel<Value, Value>): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const someCheckboxTreeLevelsChecked = computed(() => (props.children ? isSomeCheckboxTreeLevelsChecked(props.children) : false));
const allCheckboxTreeLevelsChecked = computed(() => (props.children ? isAllCheckboxTreeLevelsChecked(props.children) : false));

function handleInputChange(newInputState: InputState<Value>) {
  const newLevel = {
    ...props,
    input: {
      ...props.input,
      state: newInputState,
    },
  };

  if (newLevel.children) {
    if (isEqual(newLevel.input.state.value, newLevel.input.options.checked)) {
      newLevel.children = checkAllCheckboxTreeLevels(newLevel.children);
    } else if (isEqual(newLevel.input.state.value, newLevel.input.options.unchecked)) {
      newLevel.children = uncheckAllCheckboxTreeLevels(newLevel.children);
    }
  }
  emit('update:level', newLevel);
}

function handleChildLevelChange(newChildLevel: CheckboxTreeLevel<Value, Value>, index: number) {
  if (!props.children) {
    return;
  }
  const newChildrenLevels = [...props.children];
  newChildrenLevels[index] = newChildLevel;

  const newLevel = {
    ...props,
    children: newChildrenLevels,
  };

  const allChecked = isAllCheckboxTreeLevelsChecked(newLevel.children);
  if (allChecked) {
    newLevel.input.state.value = newLevel.input.options.checked;
  } else {
    newLevel.input.state.value = newLevel.input.options.unchecked;
  }
  newLevel.input.state = validateInputState(newLevel.input.state, newLevel.input.options.validate);

  emit('update:level', newLevel);
}
</script>

<script lang="ts">
type Value = unknown;

function toggleAllCheckboxTreeLevels<T>(children: CheckboxTreeLevel<T, T>[], checked: boolean): CheckboxTreeLevel<T, T>[] {
  const newChildren = [...children];
  for (const child of children) {
    child.input.state.value = checked ? child.input.options.checked : child.input.options.unchecked;
    child.input.state = validateInputState(child.input.state, child.input.options.validate);
    if (child.children) {
      child.children = toggleAllCheckboxTreeLevelChildren(child.children, checked);
    }
  }
  return newChildren;
}

export function checkAllCheckboxTreeLevels<T>(children: CheckboxTreeLevel<T, T>[]): CheckboxTreeLevel<T, T>[] {
  return toggleAllCheckboxTreeLevels(children, true);
}

export function uncheckAllCheckboxTreeLevels<T>(children: CheckboxTreeLevel<T, T>[]): CheckboxTreeLevel<T, T>[] {
  return toggleAllCheckboxTreeLevels(children, false);
}

export function exportCheckboxTreeLevelData<T, R>(
  children: CheckboxTreeLevel<T, T>[],
  mappingFunction: (state: InputState<T>) => R,
): Record<string, R> {
  let value: Record<string, R> = {};
  for (const child of children) {
    if (child.input.options.name) {
      value[child.input.options.name] = mappingFunction(child.input.state);
    }
    if (child.children) {
      value = {
        ...value,
        ...exportCheckboxTreeLevelData(child.children, mappingFunction),
      };
    }
  }
  return value;
}

function mapStateToState<T>(state: InputState<T>): InputState<T> {
  return { ...state };
}

function mapStateToValue<T>(state: InputState<T>): T {
  return state.value;
}

function mapStateToError<T>(state: InputState<T>): InputState<T>['error'] {
  return state.error;
}
// Exporting states
export function exportCheckboxTreeLevelStates<T>(children: CheckboxTreeLevel<T, T>[]): Record<string, InputState<T>> {
  return exportCheckboxTreeLevelData(children, mapStateToState);
}

// Exporting values
export function exportCheckboxTreeLevelValues<T>(children: CheckboxTreeLevel<T, T>[]): Record<string, T> {
  return exportCheckboxTreeLevelData(children, mapStateToValue);
}

// Exporting errors
export function exportCheckboxTreeLevelErrors<T>(children: CheckboxTreeLevel<T, T>[]) : Record<string, InputState<T>['error']> {
  return exportCheckboxTreeLevelData(children, mapStateToError);
}

// Exporting errors as array (a simpler way to generate another error)
export function exportCheckboxTreeLevelErrorsAsArray<T>(children: CheckboxTreeLevel<T, T>[]): InputState<T>['error'][] {
  const errors = exportCheckboxTreeLevelErrors(children);
  return Object.values(errors).filter((v) => isValue(v));
}

export function findCheckboxTreeLevel<T>(children: CheckboxTreeLevel<T, T>[], name: string) : CheckboxTreeLevel<T, T> | null {
  for (const child of children) {
    if (isEqual(child.input.options.name, name)) {
      return child;
    }
    if (child.children) {
      const level = findCheckboxTreeLevel(child.children, name);
      if (isValue(level)) {
        return level;
      }
    }
  }
  return null;
}

// Counting checked / unchecked children
function countToggledCheckboxTreeLevels<T>(children: CheckboxTreeLevel<T, T>[], checked?: boolean): number {
  let count = 0;
  for (const child of children) {
    if (!isDef(checked)) {
      count += 1;
    } else {
      const reference = checked ? child.input.options.checked : child.input.options.unchecked;
      if (isEqual(child.input.state.value, reference)) {
        count += 1;
      }
    }
    if (child.children) {
      count += countToggledCheckboxTreeLevels(child.children, checked);
    }
  }
  return count;
}

export function countCheckedCheckboxTreeLevels<T>(children: CheckboxTreeLevel<T, T>[]): number {
  return countToggledCheckboxTreeLevels(children, true);
}

export function countUncheckedCheckboxTreeLevels<T>(children: CheckboxTreeLevel<T, T>[]): number {
  return countToggledCheckboxTreeLevels(children, false);
}

export function countCheckboxTreeLevels<T>(children: CheckboxTreeLevel<T, T>[]): number {
  return countToggledCheckboxTreeLevels(children);
}

function isAllCheckboxTreeLevelsCheckedToggled<T>(children: CheckboxTreeLevel<T, T>[], checked: boolean): boolean {
  if (!children) {
    return false;
  }
  const totalCount = countCheckboxTreeLevels(children);
  const count = countToggledCheckboxTreeLevels(children, checked);
  return totalCount === count;
}

export function isAllCheckboxTreeLevelsChecked<T>(children: CheckboxTreeLevel<T, T>[]): boolean {
  return isAllCheckboxTreeLevelsCheckedToggled(children, true);
}

export function isAllCheckboxTreeLevelsUnchecked<T>(children: CheckboxTreeLevel<T, T>[]): boolean {
  return isAllCheckboxTreeLevelsCheckedToggled(children, false);
}

function isSomeCheckboxTreeLevelsToggled<T>(children: CheckboxTreeLevel<T, T>[], checked: boolean): boolean {
  if (!children) {
    return false;
  }
  const count = countToggledCheckboxTreeLevels(children, checked);
  return count > 0;
}

export function isSomeCheckboxTreeLevelsChecked<T>(children: CheckboxTreeLevel<T, T>[]): boolean {
  return isSomeCheckboxTreeLevelsToggled(children, true);
}

export function isSomeCheckboxTreeLevelsUnchecked<T>(children: CheckboxTreeLevel<T, T>[]): boolean {
  return isSomeCheckboxTreeLevelsToggled(children, false);
}
</script>

<style lang="scss">
.pux-AppInputCheckboxTreeLevel {
    .pux-AppInputCheckboxTreeLevel {
        padding: 0 0 0 var(--app-m-3);
    }
}
</style>
