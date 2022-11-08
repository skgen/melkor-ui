<template>
  <AppInputCheckable
    :model-value="props.modelValue"
    :name="props.name"
    :validate="props.validate"
    :checked="props.checked"
    :unchecked="props.unchecked"
    @update:model-value="(state: Value) => emit('update:modelValue', state)"
  >
    <template #default="{ inputName, checked: isChecked, onChange }">
      <div
        v-theme="{ scheme }"
        class="mk-AppInputToggle"
        :data-checked="isChecked"
        :data-fill="props.fill || undefined"
      >
        <label class="mk-AppInputToggle-label">
          <AppInputLabel v-if="props.label">
            {{ props.label }}
          </AppInputLabel>
          <span v-if="stateLabel">{{ stateLabel }}</span>
          <div class="mk-AppInputToggle-input">
            <input
              :name="inputName"
              type="checkbox"
              :checked="isChecked"
              @input="onChange"
            >
            <div class="mk-AppInputToggle-target">
              <AppIcon icon="check" />
            </div>
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
  </AppInputCheckable>
</template>

<script lang="ts" setup>
import type { InputState, ValidateInput } from '@src/definition';
import AppInputCheckable from '@src/components/io/abstract/AppInputCheckable.vue';
import AppIcon from '@src/components/AppIcon.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import { computed } from 'vue';
import { isEqual } from 'lodash';

import useComponentTheme from '@src/composables/useComponentTheme';
// import AppInputError from '@src/components/io/decoration/AppInputError.vue';

type Value = any;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  fill?: boolean;
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

const { scheme } = useComponentTheme();

const checked = computed(() => isEqual(props.modelValue.value, props.checked));
const stateLabel = computed(() => (checked.value ? props.checkedLabel : props.uncheckedLabel));

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputToggle {
    @include light {
        --mk-input-toggle-background-color: var(--c-grey-60);
    }

    @include dark {
        --mk-input-toggle-background-color: var(--c-grey-60);
    }

    --mk-input-toggle-spacing: var(--app-m-1);
    --mk-input-toggle-size: 16px;
    --mk-input-toggle-padding: 2px;
    --mk-input-toggle-color-active: var(--app-success-color);
    --mk-input-toggle-text-color: var(--mk-input-toggle-color-active);
    --mk-input-toggle-inner-spacing: var(--mk-input-toggle-size) * 2;
    --mk-input-toggle-outer-spacing: var(--mk-input-toggle-padding) * 2;
    --mk-input-toggle-icon-size: calc(var(--mk-input-toggle-size) - calc(var(--mk-input-toggle-padding)));

    display: inline-block;

    &-label {
        display: flex;
        gap: var(--mk-input-toggle-spacing);
        align-items: center;
        cursor: pointer;
    }

    &-input {
        display: block;
        width: calc(var(--mk-input-toggle-inner-spacing) + var(--mk-input-toggle-outer-spacing));
        padding: var(--mk-input-toggle-padding);
        font-size: var(--input-togle-icon-size);
        color: var(--mk-input-toggle-text-color);
        background-color: var(--mk-input-toggle-background-color);
        border-radius: var(--mk-input-toggle-size);
        transition: background-color var(--app-transition-duration-background), color var(--app-transition-duration-color);
    }

    &-target {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--mk-input-toggle-size);
        height: var(--mk-input-toggle-size);
        content: "";
        user-select: none;
        background-color: var(--app-background-color);
        border-radius: 10px;
        transition: transform 128ms;

        .mk-AppIcon {
            opacity: 0;
            transition: opacity var(--app-transition-duration-opacity);
        }
    }

    input {
        @include a11y-hidden;
    }

    &[data-checked="true"] {
        --mk-input-toggle-background-color: var(--mk-input-toggle-color-active);

        .mk-AppInputToggle {
            &-target {
                transform: translate(100%, 0);

                .mk-AppIcon {
                    opacity: 1;
                }
            }
        }
    }

    &[data-fill="true"] {
        display: block;
    }

    .mk-AppInputHint {
        display: block;
        margin-top: var(--app-m-1);
        text-align: right;
    }

    .mk-AppInputLabel {
        flex: 1;
        padding: 0 var(--app-m-2) 0 0;
    }
}
</style>
