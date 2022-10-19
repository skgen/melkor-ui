<template>
  <slot
    :checked="renderChecked"
    :input-name="props.name"
    :on-change="handleChange"
    :error="state.error"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import isEqual from 'lodash/isEqual';
import type { InputState, ValidateInput } from '@src/definition';
import useInput from '@src/composables/useInput';

type Value = any;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  checked?: Value;
  unchecked?: Value;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = withDefaults(
  defineProps<Props>(),
  {
    name: undefined,
    validate: undefined,
    checked: true,
    unchecked: false,
  },
);
const emits = defineEmits<Emits>();

const { onChange, state } = useInput<Value>({
  props: computed(() => props),
  emits,
});

const renderChecked = computed(() => isEqual(state.value.value, props.checked));

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { checked } = evt.target as HTMLInputElement;

  if (checked) {
    onChange(props.checked);
  } else {
    onChange(props.unchecked);
  }
}
</script>
