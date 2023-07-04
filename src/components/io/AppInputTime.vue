<template>
  <div
    v-theme="theme"
    class="mk-AppInputTime"
    :data-focus="focused || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <span class="mk-AppInputTime-label">
        <AppInputLabel v-if="props.label">
          {{ props.label }}
        </AppInputLabel>
      </span>
      <div class="mk-AppInputTime-input">
        <input
          ref="timeInputElement"
          :value="inputValue"
          :name="props.name"
          type="time"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="handleFocus"
          @blur="onBlur"
        >
        <span class="mk-AppInputTime-value">
          <slot
            name="preview"
            :value="state.value"
          >
            {{ previewValue }}
          </slot>
        </span>
        <AppInputTextableCancel
          v-if="isCancelable"
          :disabled="props.disabled"
          @click="handleCancel"
        >
          <slot name="cancel" />
        </AppInputTextableCancel>

        <slot name="icon">
          <AppIcon icon="schedule" />
        </slot>
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
import type { InputState, ValidateInput } from '@src/definition';
import AppIcon from '@src/components/AppIcon.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import AppInputTextableCancel from '@src/components/io/partials/AppInputTextableCancel.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';
import { classicTime, formatDate } from '@src/lib/modules/date';
import { isValue } from '@src/lib/modules/definition';
import { Time } from '@src/lib/models/time';

type Value = Time | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fill?: boolean;
  cancelable?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const timeInputElement = ref<HTMLInputElement | null>(null);

const { theme } = useTheme();

const {
  onChange, onFocus, onBlur, state, focused,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

const previewValue = computed(() => {
  if (!isValue(state.value.value)) {
    return null;
  }
  return classicTime(state.value.value.toDate());
});

const inputValue = computed(() => {
  if (!isValue(state.value.value)) {
    return null;
  }
  return formatDate(state.value.value.toDate(), 'HH:mm');
});

function handleFocus() {
  if (!timeInputElement.value) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  timeInputElement.value.showPicker();
  onFocus();
}

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  if (value === '') {
    onChange({ value: null });
  } else {
    onChange({ value: new Time(value) });
  }
}

const isCancelable = computed(() => props.cancelable && isValue(state.value.value));

function handleCancel() {
  onChange({ value: null });
  onBlur();
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputTime {
    --mk-input-time-background-color: var(--app-input-background-color);
    --mk-input-time-border-color: var(--app-input-border-color);
    --mk-input-time-border-radius: var(--app-input-border-radius);
    --mk-input-time-border-width: var(--app-input-border-width);
    --mk-input-time-color: var(--app-input-color);
    --mk-input-time-font-size: var(--app-input-font-size);
    --mk-input-time-line-height: var(--app-input-line-height);
    --mk-input-time-icon-color: var(--app-input-icon-color);
    --mk-input-time-icon-size: var(--app-input-icon-size);
    --mk-input-time-padding-x: var(--app-input-padding-x);
    --mk-input-time-padding-y: var(--app-input-padding-y);
    --mk-input-time-spacing: var(--app-input-padding-x);

    $this: &;

    display: inline-block;

    input {
        @include a11y-hidden;

        top: calc(var(--mk-input-time-border-width) * -1);
        left: calc(var(--mk-input-time-border-width) * -1);
        width: calc(var(--mk-input-time-border-width) * 2 + 100%);
        height: calc(var(--mk-input-time-border-width) * 2 + 100%);
    }

    &-input {
        position: relative;
        display: flex;
        gap: var(--mk-input-time-spacing);
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-width: 200px;
        padding: var(--mk-input-time-padding-y) var(--mk-input-time-padding-x);
        font-size: var(--mk-input-time-font-size);
        line-height: var(--mk-input-time-line-height);
        color: var(--mk-input-time-color);
        background-color: var(--mk-input-time-background-color);
        border: var(--mk-input-time-border-width) solid var(--mk-input-time-border-color);
        border-radius: var(--mk-input-time-border-radius);
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);

        .mk-AppIcon {
            --mk-icon-size: var(--mk-input-time-icon-size);
            --mk-icon-color: var(--mk-input-time-icon-color);
        }
    }

    &-value {
        flex: 1;
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

    &-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    .mk-AppInputTextableCancel {
        --mk-input-textable-cancel-color: var(--mk-input-time-icon-color);
        --mk-input-textable-cancel-size: var(--mk-input-time-icon-size);
    }
}
</style>
