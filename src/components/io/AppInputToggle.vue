<template>
  <AppInputCheckable
    v-bind="props"
    @update:model-value="(state: Value) => emit('update:modelValue', state)"
  >
    <template #default="{ inputName, checked: isChecked, onChange, error }">
      <label
        class="mk-AppInputToggle"
        :data-checked="isChecked"
      >
        <input
          :name="inputName"
          type="checkbox"
          :checked="isChecked"
          @input="onChange"
        >
        <AppInputError
          v-if="error"
          :error="error"
        />
      </label>
    </template>
  </AppInputCheckable>
</template>

<script lang="ts" setup>
import type { InputState, ValidateInput } from '@src/definition';
import AppInputCheckable from '@src/components/io/abstract/AppInputCheckable.vue';
import AppInputError from '@src/components/io/AppInputError.vue';

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

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputToggle {
    --input-toggle-size: 15px;
    --input-toggle-padding: 2px;
    --input-toggle-border: 1px;
    --input-toggle-inner-space: var(--input-toggle-size) * 2;
    --input-toggle-outer-space: var(--input-toggle-padding) * 2 + var(--input-toggle-border) * 2;

    display: block;
    width: calc(var(--input-toggle-inner-space) + var(--input-toggle-outer-space));
    padding: var(--input-toggle-padding);
    cursor: pointer;
    border: var(--input-toggle-border) solid var(--app-border-color);
    border-radius: var(--input-toggle-size);
    transition: background-color 128ms;

    &::before {
        display: block;
        width: var(--input-toggle-size);
        height: 100%;
        height: var(--input-toggle-size);
        content: "";
        background-color: var(--app-text-color);
        border-radius: 10px;
        transition: transform 128ms;
    }

    input {
        @include a11y-hidden;
    }

    &[data-checked="true"] {
        background-color: var(--app-background-color-hover);
        border-color: var(--app-text-color);

        &::before {
            transform: translate(100%, 0);
        }
    }
}
</style>
