<template>
  <AppInputCheckable
    v-bind="props"
    @update:model-value="(state: Value) => emit('update:modelValue', state)"
  >
    <template #default="{ inputName, checked: isChecked, onChange }">
      <div
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
        <!-- <AppInputError
          v-if="error"
          :error="error"
        /> -->
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
// import AppInputError from '@src/components/io/decoration/AppInputError.vue';

type Value = any;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  checked?: Value;
  unchecked?: Value;
  fill?: boolean;
  hint?: string;
  label?: string;
  checkedLabel?: string;
  uncheckedLabel?: string;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const checked = computed(() => isEqual(props.modelValue.value, props.checked));
const stateLabel = computed(() => (checked.value ? props.checkedLabel : props.uncheckedLabel));

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputToggle {
    --input-toggle-spacing: var(--app-m-1);
    --input-toggle-size: 16px;
    --input-toggle-padding: 2px;
    --input-toggle-color-active: var(--app-success-color);
    --input-toggle-background-color: var(--app-background-color-surface) / 0.6;
    --input-toggle-text-color: var(--input-toggle-color-active);
    --input-toggle-inner-space: var(--input-toggle-size) * 2;
    --input-toggle-outer-space: var(--input-toggle-padding) * 2;
    --input-togle-icon-size: calc(var(--input-toggle-size) - calc(var(--input-toggle-padding)));

    display: inline-block;

    &-label {
        display: flex;
        gap: var(--input-toggle-spacing);
        align-items: center;
    }

    &-input {
        display: block;
        width: calc(var(--input-toggle-inner-space) + var(--input-toggle-outer-space));
        padding: var(--input-toggle-padding);
        font-size: var(--input-togle-icon-size);
        color: rgb(var(--input-toggle-text-color));
        cursor: pointer;
        background-color: rgb(var(--input-toggle-background-color));
        border-radius: var(--input-toggle-size);
        transition: background-color var(--app-transition-duration-1), color var(--app-transition-duration-1);
    }

    &-target {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--input-toggle-size);
        height: var(--input-toggle-size);
        content: "";
        user-select: none;
        background-color: rgb(var(--app-background-color));
        border-radius: 10px;
        transition: transform 128ms;

        .mk-AppIcon {
            opacity: 0;
            transition: opacity var(--app-transition-duration-1);
        }
    }

    input {
        @include a11y-hidden;
    }

    &[data-checked="true"] {
        --input-toggle-background-color: var(--input-toggle-color-active);

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
    }
}
</style>
