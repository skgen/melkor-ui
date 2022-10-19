<template>
  <label class="mk-AppInpupSelect">
    <select
      :name="props.name"
      @input="handleChange"
    >
      <option
        v-for="(option, index) in props.options"
        :key="index"
        :value="index"
        :selected="isSelectedOption(option.value)"
      >
        {{ option.label }}
      </option>

    </select>
    <AppInputError
      v-if="state.error"
      :error="state.error"
    />
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import isEqual from 'lodash/isEqual';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';

type Value = any;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  options: {
    label: string;
    value: Value;
  }[];
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { onChange, state } = useInput<Value>({
  props: computed(() => props),
  emits,
});

function isSelectedOption(option: Value) {
  return isEqual(option, state.value.value);
}

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value: index } = evt.target as HTMLInputElement;

  const newOption = props.options[parseInt(index, 10)];

  onChange(newOption.value);
}
</script>
