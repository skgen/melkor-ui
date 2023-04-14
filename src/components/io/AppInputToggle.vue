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
        class="mk-AppInputToggle"
        :data-is-checked="isChecked || undefined"
        :data-is-disabled="props.disabled || undefined"
        :data-fill="props.fill || undefined"
      >
        <label class="mk-AppInputToggle-label">
          <AppInputLabel v-if="props.label">
            {{ props.label }}
          </AppInputLabel>
          <div class="mk-AppInputToggle-input">
            <input
              :name="inputName"
              type="checkbox"
              :checked="isChecked"
              :disabled="props.disabled"
              @input="onChange"
            >
            <span
              v-if="stateLabel(isChecked)"
              class="mk-AppInputToggle-stateLabel"
            >
              {{ stateLabel(isChecked) }}
            </span>
            <AppToggle
              :checked="isChecked"
              :disabled="props.disabled"
              :icon-in-background="props.iconInBackground"
            >
              <template #checked-icon>
                <slot name="checked-icon" />
              </template>
              <template #unchecked-icon>
                <slot name="unchecked-icon" />
              </template>
            </AppToggle>
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
import AppToggle from '@src/components/checkables/AppToggle.vue';
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
  fill?: boolean;
  checked?: Value;
  unchecked?: Value;
  checkedLabel?: string;
  uncheckedLabel?: string;
  iconInBackground?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
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

.mk-AppInputToggle {
    --mk-input-toggle-color: var(--app-input-icon-color);
    --mk-input-toggle-font-size: var(--app-input-font-size);
    --mk-input-toggle-line-height: var(--app-input-line-height);
    --mk-input-toggle-spacing: var(--app-m-1);

    $this: &;

    display: inline-block;

    &-label {
        display: flex;
        gap: var(--mk-input-toggle-spacing);
        align-items: center;
    }

    &-input {
        display: flex;
        gap: var(--mk-input-toggle-spacing);
        align-items: center;
        cursor: pointer;
        transition: opacity var(--app-transition-duration-opacity);
    }

    &-stateLabel {
        font-size: var(--mk-input-toggle-font-size);
        line-height: var(--mk-input-toggle-line-height);
        color: var(--mk-input-toggle-color);
        transition: opacity var(--app-transition-duration-opacity);
    }

    input {
        @include a11y-hidden;
    }

    &[data-fill="true"] {
        @include mk-fill;
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
        flex: 1;
        padding: 0 var(--app-m-2) 0 0;
    }

    .mk-AppInputHint {
        display: block;
        margin-top: var(--app-m-1);
    }

    .mk-AppInputError {
        display: block;
        margin-top: var(--app-m-1);
    }

    .mk-AppToggle {
        opacity: 1;
    }
}
</style>
