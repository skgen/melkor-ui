<template>
  <slot
    :checked="renderChecked"
    :input-name="props.name"
    :on-change="handleChange"
    :state="state"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import isEqual from 'lodash/isEqual';
import type { InputState, ValidateInput } from '@src/definition';
import useInput from '@src/composables/useInput';

type Value = unknown;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  checked?: Value;
  unchecked?: Value;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = withDefaults(
  defineProps<Props>(),
  {
    name: undefined,
    validate: undefined,
    checked: (() => true) as () => unknown,
    unchecked: (() => false) as () => unknown,
  },
);
const emit = defineEmits<Emits>();

const { onChange, state } = useInput<Value>({
  props: computed(() => props),
  emit,
});

const renderChecked = computed(() => isEqual(state.value.value, props.checked));

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }

  if (renderChecked.value) {
    onChange(props.unchecked);
  } else {
    onChange(props.checked);
  }
}
</script>
