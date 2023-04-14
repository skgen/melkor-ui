<template>
  <AppInputCheckable
    :model-value="props.modelValue"
    :name="props.name"
    :validate="props.validate"
    :checked="props.checked"
    :unchecked="props.unchecked"
    @update:model-value="(state: InputState<Value>) => emit('update:modelValue', state)"
  >
    <template #default="{ inputName, checked: isChecked, onChange, state }">
      <div
        v-theme="theme"
        v-bind="$attrs"
        class="mk-AppInputCheckbox"
        :data-is-checked="isChecked || undefined"
        :data-is-disabled="props.disabled || undefined"
      >
        <label>
          <AppInputLabel v-if="props.label">
            {{ props.label }}
          </AppInputLabel>
          <div class="mk-AppInputCheckbox-input">
            <input
              :name="inputName"
              type="checkbox"
              :checked="isChecked"
              :disabled="props.disabled"
              @input="onChange"
            >
            <AppCheckbox
              :checked="isChecked"
              :disabled="props.disabled"
            >
              <slot name="checked-icon" />
            </AppCheckbox>
            <span
              v-if="stateLabel(isChecked)"
              class="mk-AppInputCheckbox-option-label"
            >
              {{ stateLabel(isChecked) }}
            </span>
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
  </AppInputCheckable>
</template>

<script lang="ts" setup>
import type { InputState, ValidateInput } from '@src/definition';
import AppInputCheckable from '@src/components/io/abstract/AppInputCheckable.vue';
import AppCheckbox from '@src/components/checkables/AppCheckbox.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import { computed } from 'vue';
import useTheme from '@src/composables/useTheme';

type Value = unknown;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  checked?: Value;
  unchecked?: Value;
  checkedLabel?: string;
  uncheckedLabel?: string;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

const uncheckedLabel = computed(() => props.uncheckedLabel ?? props.checkedLabel);

function stateLabel(checked: boolean) {
  return checked ? props.checkedLabel : uncheckedLabel.value;
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputCheckbox {
    --mk-input-checkbox-color: var(--app-input-color);
    --mk-input-checkbox-font-size: var(--app-input-font-size);
    --mk-input-checkbox-line-height: var(--app-input-line-height);
    --mk-input-checkbox-spacing: var(--app-m-1);

    $this: &;

    display: inline-block;

    input {
        @include a11y-hidden;
    }

    &-input {
        display: flex;
        gap: var(--mk-input-checkbox-spacing);
        align-items: center;
        padding: var(--app-m-1) 0;
        cursor: pointer;
        transition: opacity var(--app-transition-duration-opacity);
    }

    &-option {
        &-label {
            font-size: var(--mk-input-checkbox-font-size);
            line-height: var(--mk-input-checkbox-line-height);
            color: var(--mk-input-checkbox-color);
        }
    }

    &[data-is-disabled="true"] {
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

    .mk-AppCheckbox {
        opacity: 1;
    }
}
</style>
