<template>
  <div
    class="mk-AppInputNumber"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputNumber-input">
        <input
          :name="props.name"
          type="number"
          :value="state.value"
          :min="props.min"
          :max="props.max"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
      </div>
    </label>
    <AppInputHint v-if="props.hint">
      {{ props.hint }}
    </AppInputHint>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import useInput from '@src/composables/useInput';

type Value = number | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  fill?: boolean;
  min?: number;
  max?: number;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const {
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
  props: computed(() => props),
  emits,
});

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  if (value === '') {
    onChange(null);
  } else {
    onChange(parseFloat(value));
  }
}
</script>

<style lang="scss">
.mk-AppInputNumber {
    --mk-input-number-padding-x: var(--app-input-padding-x);
    --mk-input-number-padding-y: var(--app-input-padding-y);
    --mk-input-number-border-radius: var(--app-border-radius);
    --mk-input-number-background-color: var(--app-input-background-color);
    --mk-input-number-border-color: var(--app-input-border-color);

    display: inline-block;

    input {
        width: 100%;
        padding: var(--mk-input-number-padding-y) var(--mk-input-number-padding-x);
        background-color: transparent;
        border: none;
        outline: none;
    }

    &-input {
        width: 100%;
        background-color: var(--mk-input-number-background-color);
        border: 1px solid var(--mk-input-number-border-color);
        border-radius: var(--mk-input-number-border-radius);
        transition: border-color var(--app-transition-duration-border);
    }

    &[data-focus="true"] {
        --mk-input-number-border-color: var(--app-primary-color);
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
