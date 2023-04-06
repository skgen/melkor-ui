<template>
  <div
    v-theme="theme"
    class="mk-AppInputColor"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputColor-input">
        <div
          class="mk-AppInputColor-color"
          :style="`background-color: ${state.value};`"
        />
        <input
          :name="props.name"
          type="color"
          :value="state.value"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
        <span class="mk-AppInputColor-value">
          <span
            class="mk-AppInputColor-hashtag"
            :data-placeholder="!isValue(absoluteValue)"
          >#</span>
          <input
            type="text"
            :value="absoluteValue ?? undefined"
            :placeholder="placeholder ?? undefined"
            :disabled="props.disabled"
            @input="handleTextChange"
            @focus="onFocus"
            @blur="onBlur"
          >
        </span>
        <AppIcon
          v-if="!$slots['icon']"
          icon="palette"
          class="mk-AppInputColor-icon"
        />
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
import { computed } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import useInput from '@src/composables/useInput';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import AppIcon from '@src/components/AppIcon.vue';
import useTheme from '@src/composables/useTheme';
import { isValue } from '@src/lib/modules/definition';

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

const placeholder = computed(() => (props.placeholder ? props.placeholder.replaceAll(/[^0-9a-f]+/gi, '') : null));
const absoluteValue = computed(() => (state.value.value ? state.value.value.replaceAll('#', '') : null));

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  onChange(value);
}

function handleTextChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  const filteredValue = value.replaceAll(/[^0-9a-f]+/gi, '').slice(0, 8);

  if (filteredValue === '') {
    onChange(null);
  } else {
    onChange(`#${filteredValue}`);
  }
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputColor {
    --mk-input-color-background-color: var(--app-input-background-color);
    --mk-input-color-border-color: var(--app-input-border-color);
    --mk-input-color-border-radius: var(--app-input-border-radius);
    --mk-input-color-border-width: var(--app-input-border-width);
    --mk-input-color-color: var(--app-input-color);
    --mk-input-color-font-size: var(--app-input-font-size);
    --mk-input-color-icon-color: var(--app-input-icon-color);
    --mk-input-color-icon-size: var(--app-input-icon-size);
    --mk-input-color-padding-x: var(--app-input-padding-x);
    --mk-input-color-padding-y: var(--app-input-padding-y);
    --mk-input-color-placeholder-color: var(--app-input-placeholder-color);
    --mk-input-color-spacing: var(--app-input-padding-x);

    $this: &;

    display: inline-block;

    input[type="color"] {
        @include a11y-hidden;
    }

    &-hashtag {
        font-size: var(--mk-input-color-font-size);
        line-height: var(--mk-input-color-line-height);
        color: var(--mk-input-color-color);

        &[data-placeholder="true"] {
            color: var(--mk-input-color-placeholder-color);
        }
    }

    input[type="text"] {
        padding: 0;
        font-size: var(--mk-input-color-font-size);
        line-height: var(--mk-input-color-line-height);
        color: var(--mk-input-color-color);
        background-color: transparent;
        border: none;
        outline: none;

        &::placeholder {
            color: var(--mk-input-color-placeholder-color);
        }
    }

    &-input {
        display: flex;
        gap: var(--mk-input-color-spacing);
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: var(--mk-input-color-padding-y) var(--mk-input-color-padding-x);
        cursor: pointer;
        background-color: var(--mk-input-color-background-color);
        border: var(--mk-input-color-border-width) solid var(--mk-input-color-border-color);
        border-radius: var(--mk-input-color-border-radius);
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);

        .mk-AppIcon {
            --mk-icon-size: var(--mk-input-color-icon-size);
            --mk-icon-color: var(--mk-input-color-icon-color);
        }
    }

    &-color {
        width: 40px;
        height: 20px;
        border: 1px solid var(--mk-input-color-border-color);
        border-radius: var(--mk-input-color-border-radius);
    }

    &-value {
        display: flex;
        flex: 1;
    }

    &[data-focus="true"] {
        .mk-AppInputColor {
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
                cursor: default;
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
