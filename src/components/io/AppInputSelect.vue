<template>
  <div
    v-theme="theme"
    class="mk-AppInputSelect"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputSelect-input">
        <select
          :name="props.name"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
          <option
            v-for="(option, index) in props.options"
            :key="index"
            :value="index"
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
import { computed } from 'vue';
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
  fill?: boolean;
  options: {
    label: string;
    value: Value;
  }[];
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
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

function isSelectedOption(option: Value) {
  return isEqual(option, state.value.value);
}

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value: index } = evt.target as HTMLInputElement;

  const newOption = props.options[parseInt(index, 10)];

  onChange(newOption.value);
}
</script>

<style lang="scss">
.mk-AppInputSelect {
    --mk-input-select-padding-x-left: var(--app-input-padding-x);
    --mk-input-select-padding-x-right: calc(var(--app-input-padding-x) * 2);
    --mk-input-select-padding-y: var(--app-input-padding-y);
    --mk-input-select-border-radius: var(--app-border-radius);
    --mk-input-select-background-color: var(--app-input-background-color);
    --mk-input-select-border-color: var(--app-input-border-color);

    display: inline-block;

    select {
        width: 100%;
        padding:
            var(--mk-input-select-padding-y)
            var(--mk-input-select-padding-x-right)
            var(--mk-input-select-padding-y)
            var(--mk-input-select-padding-x-left);
        background-color: var(--mk-input-select-background-color);
        border: 1px solid var(--mk-input-select-border-color);
        border-radius: var(--mk-input-select-border-radius);
        outline: none;
        transition: border-color var(--app-transition-duration-border);
        appearance: none;
    }

    &-input {
        position: relative;

        .mk-AppIcon {
            --mk-icon-size: 24px;

            position: absolute;
            top: 50%;
            right: calc((var(--mk-input-select-padding-x-right) - var(--mk-icon-size)) / 2);
            font-weight: 200;
            pointer-events: none;
            transform: translate(0, -50%);
        }
    }

    &[data-focus="true"] {
        select {
            border-color: var(--app-primary-color);
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

    .mk-AppInputError {
        display: block;
        margin-top: var(--app-m-1);
    }
}
</style>
