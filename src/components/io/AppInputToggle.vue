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
        v-bind="$attrs"
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
              <template v-if="!props.iconInBackground">
                <transition name="mk-AppIcon">
                  <slot
                    v-if="checked"
                    name="checked-icon"
                  />
                </transition>
                <transition name="mk-AppIcon">
                  <slot
                    v-if="!checked"
                    name="unchecked-icon"
                  />
                </transition>
              </template>
            </div>
            <div
              v-if="props.iconInBackground"
              class="mk-AppInputToggle-icons"
            >
              <transition name="mk-AppIcon">
                <div
                  v-if="checked && $slots['checked-icon']"
                  class="mk-AppInputToggle-icon"
                  data-state="checked"
                >

                  <slot name="checked-icon" />
                </div>
              </transition>
              <transition name="mk-AppIcon">
                <div
                  v-if="!checked && $slots['unchecked-icon']"
                  class="mk-AppInputToggle-icon"
                  data-state="unchecked"
                >
                  <slot name="unchecked-icon" />
                </div>
              </transition>
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
  iconInBackground?: boolean;
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
    --mk-input-toggle-color-active: var(--app-success-color);
    --mk-input-toggle-color-on-active: var(--c-white);
    --mk-input-toggle-background-color: var(--c-grey-60);
    --mk-input-toggle-color-on-background: var(--c-white);
    --mk-input-toggle-spacing: var(--app-m-1);
    --mk-input-toggle-size: 16px;
    --mk-input-toggle-padding: 2px;
    --mk-input-toggle-target-padding: calc(var(--mk-input-toggle-padding) / 2);
    --mk-input-toggle-icon-size: calc(var(--mk-input-toggle-size) - calc(var(--mk-input-toggle-target-padding) * 2));

    display: inline-block;

    &-label {
        display: flex;
        gap: var(--mk-input-toggle-spacing);
        align-items: center;
        cursor: pointer;
    }

    &-input {
        position: relative;
        display: block;
        width: calc(var(--mk-input-toggle-size) * 2 + var(--mk-input-toggle-padding) * 2);
        padding: var(--mk-input-toggle-padding);
        font-size: var(--input-togle-icon-size);
        color: var(--mk-input-toggle-target-color);
        background-color: var(--mk-input-toggle-background-color);
        border-radius: var(--mk-input-toggle-size);
        transition: background-color var(--app-transition-duration-background), color var(--app-transition-duration-color);
    }

    &-target {
        position: relative;
        width: var(--mk-input-toggle-size);
        height: var(--mk-input-toggle-size);
        user-select: none;
        background-color: var(--mk-input-toggle-color-on-background);
        border-radius: 50%;
        transition: transform var(--app-transition-duration-1);

        .mk-AppIcon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            --mk-icon-color: var(--mk-input-toggle-background-color);
        }
    }

    .mk-AppIcon {
        --mk-icon-size: var(--mk-input-toggle-icon-size);

        &-enter-active,
        &-leave-active {
            transition: opacity var(--app-transition-duration-opacity);
        }

        &-enter-from,
        &-leave-to {
            opacity: 0;
        }
    }

    &-icon {
        position: absolute;
        top: 50%;

        .mk-AppIcon {
            display: block;
            opacity: 0.6;
        }

        &[data-state="checked"] {
            left: calc((var(--mk-input-toggle-padding) + var(--mk-input-toggle-size) / 2));
            transform: translate(-50%, -50%);

            .mk-AppIcon {
                --mk-icon-color: var(--mk-input-toggle-color-on-active);
            }
        }

        &[data-state="unchecked"] {
            right: calc((var(--mk-input-toggle-padding) + var(--mk-input-toggle-size) / 2));
            transform: translate(50%, -50%);

            .mk-AppIcon {
                --mk-icon-color: var(--mk-input-toggle-color-on-background);
            }
        }
    }

    input {
        @include a11y-hidden;
    }

    &[data-checked="true"] {
        .mk-AppInputToggle {
            &-target {
                background-color: var(--mk-input-toggle-color-on-active);
                transform: translate(100%, 0);

                .mk-AppIcon {
                    --mk-icon-color: var(--mk-input-toggle-color-active);
                }
            }

            &-input {
                background-color: var(--mk-input-toggle-color-active);
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
