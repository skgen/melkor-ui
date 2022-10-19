<template>
  <div
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
        <span>
          #<input
            type="text"
            :value="absoluteValue"
            @input="handleTextChange"
            @focus="onFocus"
            @blur="onBlur"
          >
        </span>
        <AppIcon
          icon="palette"
          class="mk-AppInputColor-icon"
        />
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

type Value = string;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  fill?: boolean;
  hint?: string;
  label?: string;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const {
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
  props: computed(() => props),
  emits,
});

const absoluteValue = computed(() => state.value.value.replace('#', ''));

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

  onChange(`#${value}`);
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
    --mk-input-color-border-color-absolute: var(--app-input-border-color);

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
        width: 100%;
        padding: var(--mk-input-color-padding-y) var(--mk-input-color-padding-x);
        background-color: var(--mk-input-color-background-color);
        border: 1px solid var(--mk-input-color-border-color);
        border-radius: var(--mk-input-color-border-radius);
        transition: border-color var(--app-transition-duration-border);
    }

    &-color {
        width: 40px;
        height: 20px;
        border: 1px solid var(--mk-input-color-border-color-absolute);
        border-radius: var(--mk-input-color-border-radius);
    }

    &-icon {
        align-self: flex-end;
        font-size: 20px;
    }

    &[data-focus="true"] {
        --mk-input-color-border-color: var(--app-primary-color);
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
