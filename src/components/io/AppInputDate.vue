<template>
  <div
    v-theme="{ scheme }"
    class="mk-AppInputDate"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
  >
    <label>
      <span class="mk-AppInputDate-label">
        <AppInputLabel v-if="props.label">
          {{ props.label }}

        </AppInputLabel>
        <span
          v-if="props.showTimezone"
          class="mk-AppInputDate-timezone"
        >
          {{ formatDate(state.value, 'OOO') }}
        </span>
      </span>
      <div class="mk-AppInputDate-input">
        <input
          ref="datePicker"
          :name="props.name"
          :type="type"
          @input="handleChange"
          @focus="handleFocus"
          @blur="onBlur"
        >
        <span class="mk-AppInputDate-value">
          {{ formatedValue }}
        </span>
        <AppIcon
          icon="calendar_month"
          class="mk-AppInputDate-icon"
        />
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
import {
  computed, ref,
} from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import useInput from '@src/composables/useInput';
import AppIcon from '@src/components/AppIcon.vue';
import useComponentTheme from '@src/composables/useComponentTheme';
import { classicDate, classicTime, formatDate } from '@src/lib/modules/date';

type Value = Date;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  fill?: boolean;
  datetime?: boolean;
  showTimezone?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const datePicker = ref<HTMLInputElement | null>(null);

const { scheme } = useComponentTheme();

const {
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
  props: computed(() => props),
  emits,
});

const type = computed(() => (props.datetime ? 'datetime-local' : 'date'));

const formatedValue = computed(() => {
  if (props.datetime) {
    return `${classicDate(state.value.value)} - ${classicTime(state.value.value)}`;
  }
  return classicDate(state.value.value);
});

function handleFocus() {
  if (!datePicker.value) {
    return;
  }
  // @todo find why this triggers error on TS review
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  datePicker.value.showPicker();
  onFocus();
}

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  onChange(new Date(value));
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputDate {
    --mk-input-date-spacing: var(--app-input-padding-x);
    --mk-input-date-padding-x: var(--app-input-padding-x);
    --mk-input-date-padding-y: var(--app-input-padding-y);
    --mk-input-date-border-radius: var(--app-border-radius);
    --mk-input-date-background-color: var(--app-input-background-color);
    --mk-input-date-border-color: var(--app-input-border-color);

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
        padding: var(--mk-input-date-padding-y) var(--mk-input-date-padding-x);
        background-color: var(--mk-input-date-background-color);
        border: 1px solid var(--mk-input-date-border-color);
        border-radius: var(--mk-input-date-border-radius);
        transition: border-color var(--app-transition-duration-border);
    }

    &-icon {
        font-size: 20px;
    }

    &-value {
        flex: 1;
    }

    &[data-focus="true"] {
        .mk-AppInputDate {
            &-input {
                border-color: var(--app-primary-color);
            }
        }
    }

    &[data-fill="true"] {
        display: block;
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
}
</style>
