<template>
  <AppInputCheckable
    :model-value="props.modelValue"
    :name="props.name"
    :validate="props.validate"
    :checked="props.checked"
    :unchecked="props.unchecked"
    @update:model-value="(state: Value) => emit('update:modelValue', state)"
  >
    <template #default="{ inputName, checked: isChecked, onChange, error }">
      <label
        v-theme="{ scheme }"
        class="mk-AppInputCheckbox"
      >
        <input
          :name="inputName"
          type="checkbox"
          :checked="isChecked"
          @input="onChange"
        >
        <AppInputError v-if="error">
          {{ error }}
        </AppInputError>
      </label>
    </template>
  </AppInputCheckable>
</template>

<script lang="ts" setup>
import type { InputState, ValidateInput } from '@src/definition';
import AppInputCheckable from '@src/components/io/abstract/AppInputCheckable.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';

import useComponentTheme from '@src/composables/useComponentTheme';

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

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { scheme } = useComponentTheme();

</script>
