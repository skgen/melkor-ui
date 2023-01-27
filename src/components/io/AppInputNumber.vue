<template>
  <div
    v-theme="theme"
    class="mk-AppInputNumber"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputNumber-input">
        <input
          :name="props.name"
          type="number"
          :value="textValue"
          :min="props.min"
          :max="props.max"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
        <slot name="icon" />
      </div>
    </label>
    <AppInputHint v-if="props.hint">
      {{ props.hint }}
    </AppInputHint>
    <AppInputError v-if="state.error">
      {{ state.error }}
    </AppInputError>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';

type Value = number | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fill?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { theme } = useTheme();

const {
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
  props: computed(() => props),
  emits,
});

const textValue = ref(props.modelValue.value?.toString() || '');

watch(() => state.value.value, (newValue) => {
  const numbered = parseFloat(textValue.value);
  if (numbered !== newValue) {
    textValue.value = newValue?.toString() ?? '';
  }
});

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  textValue.value = value;

  const numbered = parseFloat(value);

  if (Number.isNaN(numbered)) {
    onChange(null);
  } else {
    onChange(numbered);
  }
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputNumber {
    --mk-input-number-padding-x: var(--app-input-padding-x);
    --mk-input-number-padding-y: var(--app-input-padding-y);
    --mk-input-number-border-radius: var(--app-border-radius);
    --mk-input-number-background-color: var(--app-input-background-color);
    --mk-input-number-border-color: var(--app-input-border-color);
    --mk-input-number-icon-color: var(--app-input-icon-color);
    --mk-input-number-icon-size: 20px;
    --mk-input-number-placeholder-color: var(--app-input-placeholder-color);

    $this: &;

    display: inline-block;

    input {
        width: 100%;
        padding: var(--mk-input-number-padding-y) 0;
        color: currentcolor;
        background-color: transparent;
        border: none;
        outline: none;

        &::placeholder {
            color: var(--mk-input-number-placeholder-color);
        }
    }

    &-input {
        display: flex;
        gap: var(--mk-input-number-padding-x);
        align-items: center;
        width: 100%;
        padding: 0 var(--mk-input-number-padding-x);
        background-color: var(--mk-input-number-background-color);
        border: 1px solid var(--mk-input-number-border-color);
        border-radius: var(--mk-input-number-border-radius);
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);

        .mk-AppIcon {
            --mk-icon-size: var(--mk-input-number-icon-size);
            --mk-icon-color: var(--mk-input-number-icon-color);
        }
    }

    &[data-focus="true"] {
        #{$this} {
            &-input {
                border-color: var(--app-primary-color);
            }
        }
    }

    &[data-fill="true"] {
        @include mk-fill;
    }

    &[data-disabled="true"] {
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
}
</style>
