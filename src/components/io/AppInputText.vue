<template>
  <div
    v-theme="theme"
    class="mk-AppInputText"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputText-input">
        <slot name="leading-icon" />
        <input
          :name="props.name"
          type="text"
          :value="state.value"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
        <slot name="trailing-icon" />
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
import { computed } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';

type Value = string | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fill?: boolean;
  placeholder?: string;
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
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  if (value === '') {
    onChange(null);
  } else {
    onChange(value);
  }
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputText {
    --mk-input-text-background-color: var(--app-input-background-color);
    --mk-input-text-border-color: var(--app-input-border-color);
    --mk-input-text-border-radius: var(--app-input-border-radius);
    --mk-input-text-border-width: var(--app-input-border-width);
    --mk-input-text-color: var(--app-input-color);
    --mk-input-text-font-size: var(--app-input-font-size);
    --mk-input-text-icon-color: var(--app-input-icon-color);
    --mk-input-text-icon-size: var(--app-input-icon-size);
    --mk-input-text-padding-x: var(--app-input-padding-x);
    --mk-input-text-padding-y: var(--app-input-padding-y);
    --mk-input-text-placeholder-color: var(--app-input-placeholder-color);
    --mk-input-text-spacing: var(--app-input-padding-x);

    $this: &;

    display: inline-block;

    input {
        width: 100%;
        padding: var(--mk-input-text-padding-y) 0;
        font-size: var(--mk-input-text-font-size);
        color: var(--mk-input-text-color);
        background-color: transparent;
        border: none;
        outline: none;

        &::placeholder {
            color: var(--mk-input-text-placeholder-color);
        }
    }

    &-input {
        display: flex;
        gap: var(--mk-input-text-spacing);
        align-items: center;
        width: 100%;
        padding: 0 var(--mk-input-text-padding-x);
        background-color: var(--mk-input-text-background-color);
        border: var(--mk-input-text-border-width) solid var(--mk-input-text-border-color);
        border-radius: var(--mk-input-text-border-radius);
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);

        .mk-AppIcon {
            --mk-icon-size: var(--mk-input-text-icon-size);
            --mk-icon-color: var(--mk-input-text-icon-color);
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
