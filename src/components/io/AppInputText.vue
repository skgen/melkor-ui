<template>
  <label class="mk-AppInputText">
    <input
      :name="props.name"
      type="text"
      :value="state.value"
      @input="handleChange"
    >
    <AppInputError
      v-if="state.error"
      :error="state.error"
    />
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputError from '@src/components/io/AppInputError.vue';
import useInput from '@src/composables/useInput';

type Value = string;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { onChange, state } = useInput<Value>({
  state: computed(() => props.modelValue),
  emits,
  validate: props.validate,
});

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  onChange(value);
}
</script>
