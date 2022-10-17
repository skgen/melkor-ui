<template>
  <div
    class="mk-AppInputText"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputText-input">
        <input
          :name="props.name"
          type="text"
          :value="state.value"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
      </div>
    </label>
    <AppInputHint v-if="props.hint">
      {{ props.hint }}
    </AppInputHint>
    <!-- <AppInputError
      v-if="state.error"
      :error="state.error"
    /> -->
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import useInput from '@src/composables/useInput';

type Value = string;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  fill?: boolean;
  hint?: string;
  label?: string;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const {
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
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

<style lang="scss">
.mk-AppInputText {
    --mk-input-text-padding-x: var(--app-input-padding-x);
    --mk-input-text-padding-y: var(--app-input-padding-y);
    --mk-input-text-border-radius: var(--app-border-radius);
    --mk-input-text-background-color: var(--app-input-background-color);
    --mk-input-text-border-color: var(--app-input-border-color);

    display: inline-block;

    input {
        width: 100%;
        padding: var(--mk-input-text-padding-y) var(--mk-input-text-padding-x);
        background-color: transparent;
        border: none;
        outline: none;
    }

    &-input {
        width: 100%;
        background-color: var(--mk-input-text-background-color);
        border: 1px solid var(--mk-input-text-border-color);
        border-radius: var(--mk-input-text-border-radius);
        transition: border-color var(--app-transition-duration-1);
    }

    &[data-focus="true"] {
        --mk-input-text-border-color: var(--app-primary-color);
    }

    &[data-fill="true"] {
        display: block;
    }

    .mk-AppInputLabel {
        display: block;
        margin-bottom: var(--app-m-1);
    }

    .mk-AppInputHint {
        display: block;
        margin-top: var(--app-m-1);
    }
}
</style>
