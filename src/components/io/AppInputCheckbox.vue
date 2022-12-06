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
        class="mk-AppInputCheckbox"
        :data-checked="isChecked"
        v-bind="$attrs"
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
              @input="onChange"
            >
            <div class="mk-AppInputCheckbox-target">
              <template v-if="isChecked">
                <template v-if="!$slots['checked-icon']">
                  <transition name="mk-AppIcon">
                    <mk-icon
                      v-if="!$slots['checked-icon']"
                      icon="check"
                    />
                  </transition>
                </template>
                <template v-else>
                  <transition name="mk-AppIcon">
                    <slot name="checked-icon" />

                  </transition>
                </template>
              </template>
            </div>
            <span v-if="stateLabel(isChecked)">{{ stateLabel(isChecked) }}</span>
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
  checked?: Value;
  unchecked?: Value;
  checkedLabel?: string;
  uncheckedLabel?: string;
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

.mk-AppInputCheckbox {
    --mk-input-checkbox-color-active: var(--app-primary-color);
    --mk-input-checkbox-color-on-active: var(--app-text-color-on-primary);
    --mk-input-checkbox-spacing: var(--app-m-1);
    --mk-input-checkbox-size: 16px;
    --mk-input-checkbox-target-padding: 1px;
    --mk-input-checkbox-icon-size: calc(var(--mk-input-checkbox-size) - calc(var(--mk-input-checkbox-target-padding) * 2));
    --mk-input-checkbox-border-color: var(--app-border-color-highlight);
    --mk-input-checkbox-border-width: 1px;

    display: inline-block;

    &-input {
        position: relative;
        display: flex;
        gap: var(--mk-input-checkbox-spacing);
        align-items: center;
        padding: var(--app-m-1) 0;
        cursor: pointer;
    }

    &-target {
        position: relative;
        flex: 0 0 var(--mk-input-checkbox-size);
        width: var(--mk-input-checkbox-size);
        height: var(--mk-input-checkbox-size);
        user-select: none;
        border: var(--mk-input-checkbox-border-width) solid var(--mk-input-checkbox-border-color);
        border-radius: var(--app-border-radius);
        transition:
            background-color var(--app-transition-duration-background),
            border-color var(--app-transition-duration-border);

        .mk-AppIcon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            --mk-icon-size: var(--mk-input-checkbox-icon-size);
            --mk-icon-color: var(--mk-input-checkbox-color-on-active);
        }
    }

    .mk-AppIcon {
        &-enter-active,
        &-leave-active {
            transition: opacity var(--app-transition-duration-opacity);
        }

        &-enter-from,
        &-leave-to {
            opacity: 0;
        }
    }

    input {
        @include a11y-hidden;
    }

    &[data-checked="true"] {
        .mk-AppInputCheckbox {
            &-target {
                background-color: var(--mk-input-checkbox-color-active);
                border-color: var(--mk-input-checkbox-color-active);
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
