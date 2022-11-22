<template>
  <div
    v-theme="{ scheme }"
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
        <slot name="icon" />
      </div>
    </label>
    <AppInputHint v-if="props.hint">
      {{ props.hint }}
    </AppInputHint>
    <!-- <AppInputError v-if="state.error">
      {{ state.error }}
    </AppInputError> -->
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import useInput from '@src/composables/useInput';
import useComponentTheme from '@src/composables/useComponentTheme';

type Value = string | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  fill?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { scheme } = useComponentTheme();

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
    onChange(value);
  }
}
</script>

<style lang="scss">
.mk-AppInputText {
    --mk-input-text-padding-x: var(--app-input-padding-x);
    --mk-input-text-padding-y: var(--app-input-padding-y);
    --mk-input-text-border-radius: var(--app-border-radius);
    --mk-input-text-background-color: var(--app-input-background-color);
    --mk-input-text-border-color: var(--app-input-border-color);
    --mk-input-text-icon-color: var(--app-input-icon-color);
    --mk-input-text-icon-size: 20px;

    display: inline-block;

    input {
        width: 100%;
        padding: var(--mk-input-text-padding-y) 0;
        background-color: transparent;
        border: none;
        outline: none;
    }

    &-input {
        display: flex;
        gap: var(--mk-input-text-padding-x);
        align-items: center;
        width: 100%;
        padding: 0 var(--mk-input-text-padding-x);
        background-color: var(--mk-input-text-background-color);
        border: 1px solid var(--mk-input-text-border-color);
        border-radius: var(--mk-input-text-border-radius);
        transition: border-color var(--app-transition-duration-border);

        .mk-AppIcon {
            --mk-icon-size: var(--mk-input-text-icon-size);
            --mk-icon-color: var(--mk-input-text-icon-color);
        }
    }

    &[data-focus="true"] {
        .mk-AppInputText {
            &-input {
                border-color: var(--app-primary-color);
            }
        }
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
