<template>
  <div
    v-theme="theme"
    class="mk-AppInputSelectX"
    :data-is-focused="state.focused || undefined"
    :data-fill="props.fill || undefined"
    :aria-disabled="props.disabled || undefined"
  >
    <div class="mk-AppInputSelectX-label">
      <AppInputLabel
        v-if="props.label"
        ref="label"
        @click="handleFocus"
      >
        {{ props.label }}
      </AppInputLabel>
      <AppMenu
        :fill="props.fill"
        :model-value="state.focused"
        :placement="FloatingPlacement.bottomStart"
      >
        <div
          ref="input"
          class="mk-AppInputSelectX-input"
        >
          <button
            ref="cta"
            class="mk-AppInputSelectX-cta"
            :disabled="props.disabled"
            @click="handleFocus"
          >
            <div class="mk-AppInputSelectX-value">
              <slot
                name="value"
                v-bind="{ option: currentOption }"
              >
                <template v-if="currentOption">
                  {{ currentOption.label }}
                </template>
              </slot>
            </div>
            <AppIcon icon="expand_more" />
          </button>
        </div>
        <template #menu>
          <div
            ref="menu"
            class="mk-AppInputSelectX-menu"
            :style="{ minWidth }"
            role="listbox"
          >
            <AppMenuGroup>
              <AppMenuEntry
                v-for="computedOption in computedOptions"
                :key="computedOption.index"
                :aria-disabled="computedOption.option.disabled ?? undefined"
                :interactive="computedOption.interactive"
                role="option"
                :aria-selected="computedOption.selected"
                @click="() => computedOption.interactive ? handleChange(computedOption.option) : void 0"
              >
                <slot
                  name="option"
                  v-bind="computedOption"
                >
                  <div class="mk-AppInputSelectX-option">
                    <span class="mk-AppInputSelectX-option-label">
                      <slot
                        name="option-label"
                        v-bind="computedOption"
                      >
                        {{ computedOption.option.label }}
                      </slot>
                    </span>
                    <span class="mk-AppInputSelectX-option-icon">
                      <slot
                        name="option-icon"
                        v-bind="computedOption"
                      >
                        <AppIcon
                          v-if="computedOption.selected"
                          icon="check"
                        />
                      </slot>
                    </span>
                  </div>
                </slot>
              </AppMenuEntry>
            </AppMenuGroup>
          </div>
        </template>
      </AppMenu>
    </div>
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
import isEqual from 'lodash/isEqual';
import { useElementSize, onClickOutside } from '@vueuse/core';
import {
  type InputState, type ValidateInput, FloatingPlacement,
} from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import AppMenu from '@src/components/floating/AppMenu.vue';
import AppMenuEntry from '@src/components/AppMenuEntry.vue';
import AppMenuGroup from '@src/components/AppMenuGroup.vue';
import AppIcon from '@src/components/AppIcon.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';

type Value = unknown;

type AppInputSelectXOption<T> = {
  label: string;
  value: T;
  disabled?: boolean;
};

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fill?: boolean;
  options: AppInputSelectXOption<Value>[];
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

// Data management

const {
  onChange, onFocus, onBlur, state,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

function isSelectedOption(option: AppInputSelectXOption<Value>) {
  return isEqual(option.value, state.value.value);
}

function handleChange(newOption: AppInputSelectXOption<Value>) {
  if (isSelectedOption(newOption)) {
    return;
  }

  onChange({ value: newOption.value });
}

const computedOptions = computed(() => props.options.map((option, index) => {
  const selected = isSelectedOption(option);
  const interactive = !(selected || option.disabled || props.disabled);
  return {
    option,
    index,
    selected,
    interactive,
  };
}));

const currentOption = computed(() => props.options.find(isSelectedOption));

// Focus / Blur

const input = ref<HTMLDivElement | null>(null);
const menu = ref<HTMLDivElement | null>(null);
const label = ref<HTMLElement | null>(null);
let clickOutsideExecution: number | null = null;

function handleBlur() {
  console.log('blur');
  onBlur();
}

function handleFocus() {
  console.log('focus');
  onFocus();
}

function handleClickOutside() {
  if (clickOutsideExecution !== null) {
    cancelAnimationFrame(clickOutsideExecution);
  }
  clickOutsideExecution = requestAnimationFrame(handleBlur);
}

onClickOutside(input, handleClickOutside, {
  ignore: [menu, label],
});

onClickOutside(menu, handleClickOutside, {
  ignore: [input, label],
});

// Menu size

const cta = ref<HTMLDivElement | null>(null);

const { width } = useElementSize(cta, undefined, { box: 'border-box' });
const minWidth = computed(() => `${width.value}px`);

// Expose

defineExpose({
  focus: handleFocus,
  blur: handleBlur,
});
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputSelectX {
    --mk-input-select-x-background-color: var(--app-input-background-color);
    --mk-input-select-x-border-color: var(--app-input-border-color);
    --mk-input-select-x-border-radius: var(--app-input-border-radius);
    --mk-input-select-x-border-width: var(--app-input-border-width);
    --mk-input-select-x-color: var(--app-input-color);
    --mk-input-select-x-font-size: var(--app-input-font-size);
    --mk-input-select-x-line-height: var(--app-input-line-height);
    --mk-input-select-x-icon-size: 24px;
    --mk-input-select-x-padding-x-left: var(--app-input-padding-x);
    --mk-input-select-x-padding-x-right: calc(var(--app-input-padding-x) * 2 + var(--mk-input-select-x-icon-size));
    --mk-input-select-x-padding-y: var(--app-input-padding-y);

    $this: &;

    display: inline-block;

    &-cta {
        display: block;
        width: 100%;
        padding:
            var(--mk-input-select-x-padding-y)
            var(--mk-input-select-x-padding-x-right)
            var(--mk-input-select-x-padding-y)
            var(--mk-input-select-x-padding-x-left);
        font-size: var(--mk-input-select-x-font-size);
        line-height: var(--mk-input-select-x-line-height);
        color: var(--mk-input-select-x-color);
        text-align: left;
    }

    &-menu {
        max-width: 100vh;

        .mk-AppMenuEntry {
            &[aria-disabled="true"] {
                opacity: var(--app-input-opacity-disabled);
            }
        }
    }

    &-value {
        min-height: 19px;
    }

    &-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        &-icon {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .mk-AppIcon {
                --mk-icon-size: 20px;
            }
        }
    }

    &-input {
        position: relative;
        width: 100%;
        min-width: 180px;
        overflow: hidden;
        background-color: var(--mk-input-select-x-background-color);
        border: var(--mk-input-select-x-border-width) solid var(--mk-input-select-x-border-color);
        border-radius: var(--mk-input-select-x-border-radius);
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);

        .mk-AppIcon {
            --mk-icon-size: var(--mk-input-select-x-icon-size);

            position: absolute;
            top: 50%;
            right: calc((var(--mk-input-select-x-padding-x-right) - var(--mk-icon-size)) / 2);
            font-weight: 200;
            pointer-events: none;
            transform: translate(0, -50%);
        }
    }

    &-label {
        display: flex;
        flex-direction: column;
    }

    &[data-is-focused="true"] {
        #{$this} {
            &-input {
                border-color: var(--app-primary-color);
            }
        }
    }

    &[data-fill="true"] {
        @include mk-fill;
    }

    &[aria-disabled="true"] {
        #{$this} {
            &-input {
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
}
</style>
