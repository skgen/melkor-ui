<template>
  <div
    v-theme="{ scheme }"
    class="mk-AppInputRadio"
  >
    <AppInputLabel v-if="props.label">
      {{ props.label }}
    </AppInputLabel>
    <div class="mk-AppInputRadio-options">
      <label
        v-for="(option, index) in props.options"
        :key="index"
        class="mk-AppInputRadio-option"
        :data-checked="isSelectedOption(option.value)"
      >
        <input
          :name="name"
          type="radio"
          :value="index"
          :checked="isSelectedOption(option.value)"
          @click="handleChange"
        >
        <div class="mk-AppInputRadio-input" />
        <span class="mk-AppInputRadio-option-label">
          {{ option.label }}
        </span>
      </label>
    </div>
    <AppInputHint v-if="props.hint">
      {{ props.hint }}
    </AppInputHint>
    <AppInputError v-if="state.error">
      {{ state.error }}
    </AppInputError>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import isEqual from 'lodash/isEqual';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import useInput from '@src/composables/useInput';
import useComponentTheme from '@src/composables/useComponentTheme';

type Value = any;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  fill?: boolean;
  options: {
    label: string;
    value: Value;
  }[];
  nullable?: boolean;
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

function isSelectedOption(option: Value) {
  return isEqual(option, state.value.value);
}

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value: index } = evt.target as HTMLInputElement;

  const newOption = props.options[parseInt(index, 10)];
  const newValue = newOption.value;

  if (props.nullable && isSelectedOption(newValue)) {
    onChange(null);
    return;
  }

  onChange(newValue);
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputRadio {
    --mk-input-radio-spacing: var(--app-m-1);
    --mk-input-radio-size: 16px;
    --mk-input-radio-color-active: var(--app-primary-color);
    --mk-input-radio-border-color: var(--app-border-color-highlight);
    --mk-input-radio-border-width: 1px;
    --mk-input-radio-border-width-active: 4px;

    display: inline-block;

    &-option {
        display: flex;
        gap: var(--mk-input-radio-spacing);
        align-items: center;
        padding: var(--app-m-1) 0;
        cursor: pointer;

        &-label {
            font-size: 0.9375rem;
        }

        &[data-checked="true"] {
            --mk-input-radio-border-color: var(--mk-input-radio-color-active);
            --mk-input-radio-border-width: var(--mk-input-radio-border-width-active);
        }
    }

    &-input {
        display: block;
        width: calc(var(--mk-input-radio-inner-spacing) + var(--mk-input-radio-outer-spacing));
        width: var(--mk-input-radio-size);
        height: var(--mk-input-radio-size);
        user-select: none;
        border: var(--mk-input-radio-border-width) solid var(--mk-input-radio-border-color);
        border-radius: 50%;
        transition: border-width var(--app-transition-duration-border);
    }

    input {
        @include a11y-hidden;
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
