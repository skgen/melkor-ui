<template>
  <label class="mk-AppInputCheckable">
    <input
      :name="name"
      type="radio"
      :checked="renderChecked"
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
import isEqual from 'lodash/isEqual';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';

type Value = any;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  value: Value;
  validate?: ValidateInput<Value>;
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

const renderChecked = computed(() => isEqual(state.value.value, props.value));

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }

  onChange(props.value);
}
</script>
