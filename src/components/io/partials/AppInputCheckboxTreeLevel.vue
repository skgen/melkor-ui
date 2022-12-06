<template>
  <div class="pux-AppInputCheckboxTreeLevel">
    <AppInputCheckbox
      :model-value="props.input.state"
      v-bind="props.input.options"
      @update:model-value="handleInputChange"
    >
      <template
        v-if="props.children && (anyChildChecked && !allChildrenChecked)"
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
import { validateStateProperties } from '@src/composables/useInput';

type Props = {
  input: CheckboxInputModel<Value, Value>;
  children?: CheckboxTreeLevel<Value, Value>[];
};

type Emits = {
  (event: 'update:level', value: CheckboxTreeLevel<Value, Value>): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const anyChildChecked = computed(() => isAnyChildTreeChecked(props.children));
const allChildrenChecked = computed(() => areAllChildTreesChecked(props.children));

function handleInputChange(newInputState: InputState<Value>) {
  const newLevel = {
    ...props,
    input: {
      ...props.input,
      state: newInputState,
    },
  };
  const scopedAnyChildChecked = isAnyChildTreeChecked(newLevel.children);
  const scopedAllChildrenChecked = areAllChildTreesChecked(newLevel.children);
  if ((scopedAnyChildChecked && !scopedAllChildrenChecked)) {
    newLevel.input.state.value = newLevel.input.options.checked;
    newLevel.input.state = validateStateProperties(newLevel.input.state, newLevel.input.options.validate);
  }
  if (newLevel.children) {
    if (isEqual(newLevel.input.state.value, newLevel.input.options.checked)) {
      newLevel.children = toggleAllCheckboxTreeLevelChildren(newLevel.children, true);
    } else if (isEqual(newLevel.input.state.value, newLevel.input.options.unchecked)) {
      newLevel.children = toggleAllCheckboxTreeLevelChildren(newLevel.children, false);
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

  const scopedAnyChildChecked = isAnyChildTreeChecked(newLevel.children);
  if (!scopedAnyChildChecked) {
    newLevel.input.state.value = newLevel.input.options.unchecked;
  } else {
    newLevel.input.state.value = newLevel.input.options.checked;
  }
  newLevel.input.state = validateStateProperties(newLevel.input.state, newLevel.input.options.validate);

  emit('update:level', newLevel);
}
</script>

<script lang="ts">
type Value = unknown;

export function isAnyChildTreeChecked<T>(children?: CheckboxTreeLevel<T, T>[]): boolean {
  if (!children) {
    return false;
  }
  for (const child of children) {
    if (child.children && child.children.length > 0) {
      if (isAnyChildTreeChecked(child.children)) {
        return true;
      }
    } else if (isEqual(child.input.state.value, child.input.options.checked)) {
      return true;
    }
  }
  return false;
}

export function areAllChildTreesChecked<T>(children?: CheckboxTreeLevel<T, T>[]): boolean {
  if (!children) {
    return false;
  }
  const results: boolean[] = [];
  for (const child of children) {
    if (child.children && child.children.length > 0) {
      results.push(areAllChildTreesChecked(child.children));
    } else if (isEqual(child.input.state.value, child.input.options.checked)) {
      results.push(true);
    } else {
      results.push(false);
    }
  }
  return !results.includes(false);
}

export function toggleAllCheckboxTreeLevelChildren<T>(children: CheckboxTreeLevel<T, T>[], checked: boolean): CheckboxTreeLevel<T, T>[] {
  const newChildren = [...children];
  for (const child of children) {
    child.input.state.value = checked ? child.input.options.checked : child.input.options.unchecked;
    child.input.state = validateStateProperties(child.input.state, child.input.options.validate);
    if (child.children) {
      child.children = toggleAllCheckboxTreeLevelChildren(child.children, checked);
    }
  }
  return newChildren;
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

export function exportCheckboxTreeLevelStates<T>(children: CheckboxTreeLevel<T, T>[]) {
  return exportCheckboxTreeLevelData(children, mapStateToState);
}

export function exportCheckboxTreeLevelValues<T>(children: CheckboxTreeLevel<T, T>[]) {
  return exportCheckboxTreeLevelData(children, mapStateToValue);
}

export function exportCheckboxTreeLevelErrors<T>(children: CheckboxTreeLevel<T, T>[]) {
  return exportCheckboxTreeLevelData(children, mapStateToError);
}
</script>

<style lang="scss">
.pux-AppInputCheckboxTreeLevel {
    .pux-AppInputCheckboxTreeLevel {
        padding: 0 0 0 var(--app-m-3);
    }
}
</style>
