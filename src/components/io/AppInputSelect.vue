<template>
  <div
    v-theme="theme"
    class="mk-AppInputSelect"
    :data-focus="state.focused || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputSelect-input">
        <select
          :name="props.name"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
          <option
            v-for="(option, index) in props.options"
            :key="index"
            :value="index"
            :disabled="option.disabled"
            :selected="isSelectedOption(option.value)"
          >
            {{ option.label }}
          </option>
        </select>
        <AppIcon icon="expand_more" />
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
import { computed, ref } from 'vue';
import isEqual from 'lodash/isEqual';
import type {
  InputState, ValidateInput,
} from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import AppIcon from '@src/components/AppIcon.vue';
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
  fill?: boolean;
  options: {
    label: string;
    value: Value;
    disabled?: boolean;
  }[];
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectInput = ref<HTMLSelectElement | null>(null);

const { theme } = useTheme();

const {
  onChange, onFocus, onBlur, state,
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
  const { value: index } = evt.target as HTMLSelectElement;

  const newOption = props.options[parseInt(index, 10)];

  onChange({ value: newOption.value });
}

function focus() {
  if (!selectInput.value) {
    return;
  }
  selectInput.value.focus();
}

function blur() {
  if (!selectInput.value) {
    return;
  }
  selectInput.value.blur();
}

defineExpose({
  focus,
  blur,
});
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputSelect {
    --mk-input-select-background-color: var(--app-input-background-color);
    --mk-input-select-border-color: var(--app-input-border-color);
    --mk-input-select-border-radius: var(--app-input-border-radius);
    --mk-input-select-border-width: var(--app-input-border-width);
    --mk-input-select-color: var(--app-input-color);
    --mk-input-select-font-size: var(--app-input-font-size);
    --mk-input-select-line-height: var(--app-input-line-height);
    --mk-input-select-icon-size: 24px;
    --mk-input-select-padding-x-left: var(--app-input-padding-x);
    --mk-input-select-padding-x-right: calc(var(--app-input-padding-x) * 2 + var(--mk-input-select-icon-size));
    --mk-input-select-padding-y: var(--app-input-padding-y);

    $this: &;

    display: inline-block;

    select {
        width: 100%;
        padding:
            var(--mk-input-select-padding-y)
            var(--mk-input-select-padding-x-right)
            var(--mk-input-select-padding-y)
            var(--mk-input-select-padding-x-left);
        font-size: var(--mk-input-select-font-size);
        line-height: var(--mk-input-select-line-height);
        color: var(--mk-input-select-color);
        background: none;
        border: none;
        outline: none;
        transition: border-color var(--app-transition-duration-color);
        appearance: none;

        &[disabled] {
            opacity: 1;
        }
    }

    &-input {
        position: relative;
        min-width: 180px;
        overflow: hidden;
        background-color: var(--mk-input-select-background-color);
        border: var(--mk-input-select-border-width) solid var(--mk-input-select-border-color);
        border-radius: var(--mk-input-select-border-radius);
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);

        .mk-AppIcon {
            --mk-icon-size: var(--mk-input-select-icon-size);

            position: absolute;
            top: 50%;
            right: calc((var(--mk-input-select-padding-x-right) - var(--mk-icon-size)) / 2);
            font-weight: 200;
            pointer-events: none;
            transform: translate(0, -50%);
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
