<template>
  <label class="mk-AppInputTextarea">
    <textarea
      :name="props.name"
      :value="state.value"
      :rows="props.rows"
      @input="handleChange"
    />
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
  rows?: number;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = withDefaults(defineProps<Props>(), {
  rows: 2,
  name: undefined,
  validate: undefined,
});
const emits = defineEmits<Emits>();

const { state, onChange } = useInput<Value>({
  state: computed(() => props.modelValue),
  emits,
  validate: props.validate,
});

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLTextAreaElement;

  onChange(value);
}

</script>
