<template>
  <div
    v-theme="theme"
    class="mk-AppInputCheckboxTreeLevel"
  >
    <AppInputCheckbox
      :model-value="modelValue"
      v-bind="props.input.options"
      :disabled="props.disabled || props.input.options.disabled"
      @update:model-value="handleInputChange"
    >
      <template
        v-if="shadowValue"
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
        :disabled="props.disabled"
        @update:level="(newLevel) => handleChildLevelChange(newLevel, index)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import type {
  CheckboxInputModel, InputState, CheckboxTreeLevel, NonArray,
} from '@src/definition';
import AppInputCheckbox from '@src/components/io/AppInputCheckbox.vue';
import AppIcon from '@src/components/AppIcon.vue';
import isEqual from 'lodash/isEqual';
import { computed } from 'vue';
import { createInputState, validateInputState } from '@src/composables/useInput';
import { isDef, isValue } from '@src/lib/modules/definition';
import useTheme from '@src/composables/useTheme';

type Props = {
  input: CheckboxInputModel<Value, Value>;
  children?: CheckboxTreeLevel<Value, Value>[];
  disabled?: boolean;
};

type Emits = {
  (event: 'update:level', value: CheckboxTreeLevel<Value, Value>): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

const someCheckboxTreeLevelsChecked = computed(() => (props.children ? isSomeCheckboxTreeLevelsChecked(props.children) : false));
const allCheckboxTreeLevelsChecked = computed(() => (props.children ? isAllCheckboxTreeLevelsChecked(props.children) : false));

const shadowValue = computed(() => props.children && (someCheckboxTreeLevelsChecked.value && !allCheckboxTreeLevelsChecked.value));

const modelValue = computed(() => {
  if (shadowValue.value) {
    return createInputState({
      ...props.input.state,
      value: props.input.options.checked,
    });
  }
  return props.input.state;
});

function handleInputChange(newInputState: InputState<Value>) {
  const newLevel = {
    ...props,
    input: {
      ...props.input,
      state: newInputState,
    },
  };
  if (shadowValue.value) {
    newLevel.input.state.value = newLevel.input.options.checked;
  }
  newLevel.input.state = validateInputState(newLevel.input.state, newLevel.input.options.validate);

  const checkedValue = getCheckedOptionValue(newLevel.input.options.checked);
  const uncheckedValue = getUncheckedOptionValue(newLevel.input.options.unchecked);

  if (newLevel.children) {
    if (isEqual(newLevel.input.state.value, checkedValue)) {
      newLevel.children = checkAllCheckboxTreeLevels(newLevel.children);
    } else if (isEqual(newLevel.input.state.value, uncheckedValue)) {
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
  const checkedValue = getCheckedOptionValue(newLevel.input.options.checked);
  const uncheckedValue = getUncheckedOptionValue(newLevel.input.options.unchecked);

  if (allChecked) {
    newLevel.input.state.value = checkedValue;
  } else {
    newLevel.input.state.value = uncheckedValue;
  }
  newLevel.input.state = validateInputState(newLevel.input.state, newLevel.input.options.validate);

  emit('update:level', newLevel);
}
</script>

<script lang="ts">
type Value = unknown;

function getCheckedOptionValue<T>(checked?: T): T {
  if (isDef(checked)) {
    return checked;
  }
  return true as unknown as T;
}

function getUncheckedOptionValue<T>(unchecked?: T): T {
  if (isDef(unchecked)) {
    return unchecked;
  }
  return false as unknown as T;
}

function toggleAllCheckboxTreeLevels<TChecked, TUnchecked>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
  checked: boolean,
): CheckboxTreeLevel<TChecked, TUnchecked>[] {
  const newChildren = [...children];
  for (const child of children) {
    const checkedValue = getCheckedOptionValue(child.input.options.checked);
    const uncheckedValue = getUncheckedOptionValue(child.input.options.unchecked);
    child.input.state.value = checked ? checkedValue : uncheckedValue;
    child.input.state = validateInputState(child.input.state, child.input.options.validate);
    if (child.children) {
      child.children = toggleAllCheckboxTreeLevels(child.children, checked);
    }
  }
  return newChildren;
}

export function checkAllCheckboxTreeLevels<TChecked, TUnchecked>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
): CheckboxTreeLevel<TChecked, TUnchecked>[] {
  return toggleAllCheckboxTreeLevels(children, true);
}

export function uncheckAllCheckboxTreeLevels<TChecked, TUnchecked>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
): CheckboxTreeLevel<TChecked, TUnchecked>[] {
  return toggleAllCheckboxTreeLevels(children, false);
}

export function exportCheckboxTreeLevelData<TChecked, TUnchecked, R>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
  mappingFunction: (level: CheckboxTreeLevel<TChecked, TUnchecked>) => R,
): Record<string, R> {
  let value: Record<string, R> = {};
  for (const child of children) {
    if (child.input.options.name) {
      value[child.input.options.name] = mappingFunction(child);
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

function mapLevelToState<TChecked, TUnchecked>(level: CheckboxTreeLevel<TChecked, TUnchecked>)
  : InputState<TChecked | TUnchecked> {
  return { ...level.input.state };
}

function mapLevelToValue<TChecked, TUnchecked>(level: CheckboxTreeLevel<TChecked, TUnchecked>): TChecked | TUnchecked {
  return level.input.state.value;
}

function mapLevelToError<TChecked, TUnchecked>(level: CheckboxTreeLevel<TChecked, TUnchecked>)
  : InputState<TChecked | TUnchecked>['error'] {
  return level.input.state.error;
}
// Exporting states
export function exportCheckboxTreeLevelStates<TChecked, TUnchecked>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
): Record<string, InputState<TChecked | TUnchecked>> {
  return exportCheckboxTreeLevelData(children, mapLevelToState);
}

// Exporting values
export function exportCheckboxTreeLevelValues<TChecked, TUnchecked>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
): Record<string, TChecked | TUnchecked> {
  return exportCheckboxTreeLevelData(children, mapLevelToValue);
}

// Exporting errors
export function exportCheckboxTreeLevelErrors<TChecked, TUnchecked>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
) : Record<string, InputState<TChecked | TUnchecked>['error']> {
  return exportCheckboxTreeLevelData(children, mapLevelToError);
}

// Exporting errors as array (a simpler way to generate another error)
export function exportCheckboxTreeLevelErrorsAsArray<TChecked, TUnchecked>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
): NonNullable<InputState<TChecked | TUnchecked>['error']>[] {
  const errors = Object.values(exportCheckboxTreeLevelErrors(children));
  type FilteredErrorType = NonNullable<NonArray<typeof errors>>;
  return errors.filter<FilteredErrorType>(isValue);
}

// Exporting levels
export function exportCheckboxTreeLevels<TChecked, TUnchecked>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
): Record<string, CheckboxTreeLevel<TChecked, TUnchecked>> {
  return exportCheckboxTreeLevelData(children, (v) => v);
}

export function findCheckboxTreeLevel<TChecked, TUnchecked>(
  children: CheckboxTreeLevel<TChecked, TUnchecked>[],
  name: string,
) : CheckboxTreeLevel<TChecked, TUnchecked> | null {
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
function countToggledCheckboxTreeLevels<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[], checked?: boolean): number {
  let count = 0;
  for (const child of children) {
    if (!isDef(checked)) {
      count += 1;
    } else {
      const checkedValue = getCheckedOptionValue(child.input.options.checked);
      const uncheckedValue = getUncheckedOptionValue(child.input.options.unchecked);
      const reference = checked ? checkedValue : uncheckedValue;
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

export function countCheckedCheckboxTreeLevels<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[]): number {
  return countToggledCheckboxTreeLevels(children, true);
}

export function countUncheckedCheckboxTreeLevels<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[]): number {
  return countToggledCheckboxTreeLevels(children, false);
}

export function countCheckboxTreeLevels<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[]): number {
  return countToggledCheckboxTreeLevels(children);
}

function isAllCheckboxTreeLevelsCheckedToggled<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[], checked: boolean): boolean {
  if (!children) {
    return false;
  }
  const totalCount = countCheckboxTreeLevels(children);
  const count = countToggledCheckboxTreeLevels(children, checked);
  return totalCount === count;
}

export function isAllCheckboxTreeLevelsChecked<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[]): boolean {
  return isAllCheckboxTreeLevelsCheckedToggled(children, true);
}

export function isAllCheckboxTreeLevelsUnchecked<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[]): boolean {
  return isAllCheckboxTreeLevelsCheckedToggled(children, false);
}

function isSomeCheckboxTreeLevelsToggled<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[], checked: boolean): boolean {
  if (!children) {
    return false;
  }
  const count = countToggledCheckboxTreeLevels(children, checked);
  return count > 0;
}

export function isSomeCheckboxTreeLevelsChecked<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[]): boolean {
  return isSomeCheckboxTreeLevelsToggled(children, true);
}

export function isSomeCheckboxTreeLevelsUnchecked<TChecked, TUnchecked>(children: CheckboxTreeLevel<TChecked, TUnchecked>[]): boolean {
  return isSomeCheckboxTreeLevelsToggled(children, false);
}
</script>

<style lang="scss">
.mk-AppInputCheckboxTreeLevel {
    --app-input-checkbox-tree-level-offset-x: var(--app-m-3);

    .mk-AppInputCheckboxTreeLevel {
        padding: 0 0 0 var(--app-input-checkbox-tree-level-offset-x);
    }
}
</style>
