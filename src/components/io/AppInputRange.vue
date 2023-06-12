<template>
  <div
    v-theme="theme"
    class="mk-AppInputRange"
    :data-focus="state.focused || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputRange-input">
        <div class="mk-AppInputRange-placeholder">
          <div class="mk-AppInputRange-placeholder-track">
            <div class="mk-AppInputRange-placeholder-track-active" />
          </div>
          <div
            ref="thumb"
            class="mk-AppInputRange-placeholder-thumb"
          />
        </div>
        <input
          :name="props.name"
          type="range"
          :value="state.value"
          :min="props.min"
          :max="props.max"
          :step="props.step"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
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
import {
  computed, onMounted, ref,
} from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';
import { norm } from '@src/lib/modules/math';

type Value = number;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fill?: boolean;
  min?: number;
  max?: number;
  step?: number;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  validate: undefined,
  label: undefined,
  hint: undefined,
  min: 0,
  max: 100,
  step: 1,
});
const emit = defineEmits<Emits>();

const rangeInput = ref<HTMLInputElement | null>(null);
const thumb = ref<HTMLDivElement | null>(null);

const { theme } = useTheme();

const {
  onChange, onFocus, onBlur, state,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

const thumbSize = ref(0);
const normalized = computed(() => norm(state.value.value, props.min, props.max));
const normAttr = computed(() => `${normalized.value}`);

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  const newValue = parseFloat(value);

  onChange({ value: newValue });
}

onMounted(() => {
  if (!thumb.value) {
    return;
  }
  const style = getComputedStyle(thumb.value);
  thumbSize.value = parseFloat(style.width);
});

function focus() {
  if (!rangeInput.value) {
    return;
  }
  rangeInput.value.focus();
}

function blur() {
  if (!rangeInput.value) {
    return;
  }
  rangeInput.value.blur();
}

defineExpose({
  focus,
  blur,
});
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputRange {
    --mk-input-range-color-active: var(--app-primary-color);
    --mk-input-range-thumb-border-width: 4px;
    --mk-input-range-thumb-size: 16px;
    --mk-input-range-track-background-color: var(--app-border-color);
    --mk-input-range-track-height: 4px;

    $this: &;

    display: inline-block;

    input {
        width: 100%;
        opacity: 0;
    }

    &-input {
        position: relative;
        display: flex;
        height: var(--mk-input-range-thumb-size);
        transition: opacity var(--app-transition-duration-opacity);
    }

    &-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: var(--mk-input-range-color-active);
        pointer-events: none;
        user-select: none;
        transition: color var(--app-transition-duration-color);

        &-track {
            position: absolute;
            top: 50%;
            width: 100%;
            height: var(--mk-input-range-track-height);
            max-height: var(--mk-input-range-thumb-size);
            overflow: hidden;
            background-color: var(--mk-input-range-track-background-color);
            border-radius: var(--mk-input-range-track-height);
            transform: translate(0, -50%);

            &-active {
                position: absolute;
                top: 0;
                left: 0;
                width:
                    calc(
                        (v-bind(normAttr) * 100%) - (var(--mk-input-range-thumb-size) * v-bind(normAttr)) + (var(--mk-input-range-thumb-size) / 2)
                    );
                height: 100%;
                background-color: currentcolor;
            }
        }

        &-thumb {
            position: absolute;
            top: 50%;
            left: calc((v-bind(normAttr) * 100%) - (var(--mk-input-range-thumb-size) * v-bind(normAttr)));
            width: var(--mk-input-range-thumb-size);
            height: var(--mk-input-range-thumb-size);
            background-color: var(--app-background-color-on-primary);
            border: var(--mk-input-range-thumb-border-width) solid currentcolor;
            border-radius: 50%;
            transform: translate(0, -50%);
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

            &-placeholder {
                color: var(--app-input-color-disabled);
            }
        }
    }

    .mk-AppInputLabel {
        display: block;
        margin-bottom: var(--app-m-2);
    }

    .mk-AppInputHint {
        display: block;
        margin-top: var(--app-m-2);
    }

    .mk-AppInputError {
        display: block;
        margin-top: var(--app-m-1);
    }
}
</style>
