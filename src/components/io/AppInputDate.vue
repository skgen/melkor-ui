<template>
  <div
    v-theme="theme"
    class="mk-AppInputDate"
    :data-focus="focused || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <span
        v-if="props.label || props.showTimezone && isValue(state.value)"
        class="mk-AppInputDate-label"
      >
        <AppInputLabel v-if="props.label">
          {{ props.label }}
        </AppInputLabel>
        <span
          v-if="props.showTimezone && isValue(state.value)"
          class="mk-AppInputDate-timezone"
        >
          {{ formatDate(state.value, 'OOO') }}
        </span>
      </span>
      <div class="mk-AppInputDate-input">
        <input
          ref="dateInput"
          :value="inputValue"
          :name="props.name"
          :type="type"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="handleFocus"
          @blur="onBlur"
        >
        <span class="mk-AppInputDate-value">
          <slot

            name="preview"
            :datetime="props.datetime"
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
          <AppIcon icon="calendar_month" />
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
import { classicDate, classicTime, formatDate } from '@src/lib/modules/date';
import { isValue } from '@src/lib/modules/definition';

type Value = Date | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fill?: boolean;
  cancelable?: boolean;
  datetime?: boolean;
  showTimezone?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const dateInput = ref<HTMLInputElement | null>(null);

const { theme } = useTheme();

const {
  onChange, onFocus, onBlur, state, focused,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

const type = computed(() => (props.datetime ? 'datetime-local' : 'date'));

const previewValue = computed(() => {
  if (!isValue(state.value.value)) {
    return null;
  }
  if (props.datetime) {
    return `${classicDate(state.value.value)} - ${classicTime(state.value.value)}`;
  }
  return classicDate(state.value.value);
});

const inputValue = computed(() => {
  if (!isValue(state.value.value)) {
    return null;
  }
  if (props.datetime) {
    return formatDate(state.value.value, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS');
  }
  return formatDate(state.value.value, 'yyyy-MM-dd');
});

function handleFocus() {
  if (!dateInput.value) {
    return;
  }
  // @todo find why this triggers error on TS review
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  dateInput.value.showPicker();
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
    onChange({ value: new Date(value) });
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

.mk-AppInputDate {
    --mk-input-date-background-color: var(--app-input-background-color);
    --mk-input-date-border-color: var(--app-input-border-color);
    --mk-input-date-border-radius: var(--app-input-border-radius);
    --mk-input-date-border-width: var(--app-input-border-width);
    --mk-input-date-color: var(--app-input-color);
    --mk-input-date-font-size: var(--app-input-font-size);
    --mk-input-date-line-height: var(--app-input-line-height);
    --mk-input-date-icon-color: var(--app-input-icon-color);
    --mk-input-date-icon-size: var(--app-input-icon-size);
    --mk-input-date-padding-x: var(--app-input-padding-x);
    --mk-input-date-padding-y: var(--app-input-padding-y);
    --mk-input-date-spacing: var(--app-input-padding-x);

    $this: &;

    display: inline-block;

    input {
        @include a11y-hidden;
    }

    &-input {
        display: flex;
        gap: var(--mk-input-date-spacing);
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-width: 200px;
        padding: var(--mk-input-date-padding-y) var(--mk-input-date-padding-x);
        font-size: var(--mk-input-date-font-size);
        line-height: var(--mk-input-date-line-height);
        color: var(--mk-input-date-color);
        background-color: var(--mk-input-date-background-color);
        border: var(--mk-input-date-border-width) solid var(--mk-input-date-border-color);
        border-radius: var(--mk-input-date-border-radius);
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);

        .mk-AppIcon {
            --mk-icon-size: var(--mk-input-date-icon-size);
            --mk-icon-color: var(--mk-input-date-icon-color);
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
        --mk-input-textable-cancel-color: var(--mk-input-date-icon-color);
        --mk-input-textable-cancel-size: var(--mk-input-date-icon-size);
    }
}
</style>
