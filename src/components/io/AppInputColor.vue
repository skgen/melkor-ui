<template>
  <div
    v-theme="theme"
    class="mk-AppInputColor"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
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
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
        <span class="mk-AppInputColor-value">
          #<input
            type="text"
            :value="absoluteValue ?? ''"
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
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import useInput from '@src/composables/useInput';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppIcon from '@src/components/AppIcon.vue';
import useTheme from '@src/composables/useTheme';

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

const { theme } = useTheme();

const {
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
  props: computed(() => props),
  emits,
});

const absoluteValue = computed(() => (state.value.value ? state.value.value.replace('#', '') : null));

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

  if (value === '') {
    onChange(null);
  } else {
    onChange(`#${value}`);
  }
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputColor {
    --mk-input-color-spacing: var(--app-input-padding-x);
    --mk-input-color-padding-x: var(--app-input-padding-x);
    --mk-input-color-padding-y: var(--app-input-padding-y);
    --mk-input-color-border-radius: var(--app-border-radius);
    --mk-input-color-background-color: var(--app-input-background-color);
    --mk-input-color-border-color: var(--app-input-border-color);
    --mk-input-color-icon-color: var(--app-input-icon-color);
    --mk-input-color-icon-size: 20px;

    display: inline-block;

    input[type="color"] {
        @include a11y-hidden;
    }

    input[type="text"] {
        padding: 0;
        background-color: transparent;
        border: none;
        outline: none;
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
        border: 1px solid var(--mk-input-color-border-color);
        border-radius: var(--mk-input-color-border-radius);
        transition: border-color var(--app-transition-duration-border);

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
