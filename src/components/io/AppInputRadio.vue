<template>
  <div
    v-theme="theme"
    class="mk-AppInputRadio"
    :data-is-disabled="props.disabled || undefined"
  >
    <AppInputLabel v-if="props.label">
      {{ props.label }}
    </AppInputLabel>
    <div class="mk-AppInputRadio-options">
      <label
        v-for="(option, index) in props.options"
        :key="index"
        class="mk-AppInputRadio-input"
      >
        <input
          :name="name"
          type="radio"
          :value="index"
          :checked="isSelectedOption(option.value)"
          :disabled="props.disabled"
          @click="handleChange"
        >
        <AppRadio
          :disabled="props.disabled"
          :checked="isSelectedOption(option.value)"
        />
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
import AppRadio from '@src/components/checkables/AppRadio.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';

type Value = unknown;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  options: {
    label: string;
    value: Value;
  }[];
  nullable?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

const {
  onChange, state,
} = useInput<Value>({
  props: computed(() => props),
  emit,
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
    --mk-input-radio-color: var(--app-input-color);
    --mk-input-radio-font-size: var(--app-input-font-size);
    --mk-input-radio-line-height: var(--app-input-line-height);
    --mk-input-radio-spacing: var(--app-m-1);

    $this: &;

    display: inline-block;

    input {
        @include a11y-hidden;
    }

    &-input {
        display: flex;
        gap: var(--mk-input-radio-spacing);
        align-items: center;
        padding: var(--app-m-1) 0;
        cursor: pointer;
        transition: opacity var(--app-transition-duration-opacity);

        &-label {
            font-size: 0.9375rem;
        }
    }

    &-option {
        &-label {
            font-size: var(--mk-input-radio-font-size);
            line-height: var(--mk-input-radio-line-height);
            color: var(--mk-input-radio-color);
        }
    }

    &[data-is-disabled="true"] {
        #{$this} {
            &-input {
                opacity: var(--app-input-opacity-disabled);
            }
        }
    }

    .mk-AppInputLabel {
        display: block;
        margin-bottom: var(--app-m-1);
    }

    .mk-AppInputHint {
        display: block;
        margin-top: var(--app-m-1);
    }

    .mk-AppInputError {
        display: block;
        margin-top: var(--app-m-1);
    }

    .mk-AppRadio {
        opacity: 1;
    }
}
</style>
