<template>
  <div
    v-theme="theme"
    class="mk-AppInputTextarea"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputTextarea-input">
        <textarea
          :name="props.name"
          :value="state.value?? undefined"
          :rows="props.rows"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        />
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
  rows?: number;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  validate: undefined,
  hint: undefined,
  label: undefined,
  placeholder: undefined,
  rows: 2,
});
const emits = defineEmits<Emits>();

const { theme } = useTheme();

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
  const { value } = evt.target as HTMLTextAreaElement;

  if (value === '') {
    onChange(null);
  } else {
    onChange(value);
  }
}

</script>

<style lang="scss">
.mk-AppInputTextarea {
    --mk-input-textarea-padding-x: var(--app-input-padding-x);
    --mk-input-textarea-padding-y: var(--app-input-padding-y);
    --mk-input-textarea-border-radius: var(--app-border-radius);
    --mk-input-textarea-background-color: var(--app-input-background-color);
    --mk-input-textarea-border-color: var(--app-input-border-color);
    --mk-input-textarea-placeholder-color: var(--app-input-placeholder-color);

    $this: &;

    display: inline-block;

    textarea {
        width: 100%;
        padding: var(--mk-input-textarea-padding-y) var(--mk-input-textarea-padding-x);
        color: currentcolor;
        background-color: var(--mk-input-textarea-background-color);
        border: 1px solid var(--mk-input-textarea-border-color);
        border-radius: var(--mk-input-textarea-border-radius);
        outline: none;
        transition: border-color var(--app-transition-duration-color);

        &::placeholder {
            color: var(--mk-input-textarea-placeholder-color);
        }
    }

    &-input {
        transition: opacity var(--app-transition-duration-opacity);
    }

    &[data-focus="true"] {
        textarea {
            border-color: var(--app-primary-color);
        }
    }

    &[data-fill="true"] {
        display: block;
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
