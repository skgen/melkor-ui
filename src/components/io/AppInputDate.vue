<template>
  <label
    v-theme="{ scheme }"
    class="mk-AppInputDate"
  >
    <input
      :name="props.name"
      type="datetime-local"
      :value="state.value.toISOString()"
      @input="handleChange"
    >
    <AppInputError v-if="state.error">
      {{ state.error }}
    </AppInputError>
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';
import useComponentTheme from '@src/composables/useComponentTheme';

type Value = Date;

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

const { scheme } = useComponentTheme();

const {
  onChange, state,
} = useInput<Value>({
  props: computed(() => props),
  emits,
});

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  onChange(new Date(value));
}
</script>
