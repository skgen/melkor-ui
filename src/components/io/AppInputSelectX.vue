<template>
  <div
    v-theme="theme"
    class="mk-AppInputSelectX"
    :data-is-focused="focused || undefined"
    :data-fill="props.fill || undefined"
    :aria-disabled="props.disabled || undefined"
  >
    <div class="mk-AppInputSelectX-label">
      <AppInputLabel
        v-if="props.label"
        ref="labelElement"
        @click="handleFocus"
      >
        {{ props.label }}
      </AppInputLabel>
      <AppMenu
        :fill="props.fill"
        :model-value="focused"
        :placement="FloatingPlacement.bottomStart"
      >
        <div
          ref="inputElement"
          class="mk-AppInputSelectX-input"
        >
          <div
            ref="containerElement"
            class="mk-AppInputSelectX-container"
            role="button"
            tabIndex="0"
            @click="() => !props.disabled ? handleFocus() : null"
          >
            <div class="mk-AppInputSelectX-content">
              <slot
                v-if="isArray(state.value)"
                v-bind="{ selection: state.value }"
                name="values"
              >
                <div
                  v-if="currentRender"
                  class="mk-AppInputSelectX-content-value"
                >
                  {{ currentRender }}
                </div>
              </slot>
              <slot
                v-else
                name="value"
                v-bind="{ selection: state.value }"
              >
                <div
                  v-if="currentRender"
                  class="mk-AppInputSelectX-content-value"
                >
                  {{ currentRender }}
                </div>
              </slot>
              <div
                v-if="props.search && isSearchable"
                class="mk-AppInputSelectX-content-search"
                :data-value="props.search.value"
              >
                <AppInputText
                  ref="searchElement"
                  :model-value="props.search"
                  @update:model-value="(newSearch: InputState<TextInputValue>) => emit('update:search', newSearch)"
                />
              </div>
            </div>
            <div
              ref="actionbarElement"
              class="mk-AppInputSelectX-actionbar"
            >
              <AppInputTextableCancel
                v-if="isCancelable"
                :disabled="props.disabled"
                @click.stop="handleCancel"
              />
              <AppIcon
                icon="expand_more"
                class="mk-AppInputSelectX-actionbar-arrow"
              />
            </div>
          </div>
        </div>
        <template #menu>
          <div
            ref="menuElement"
            class="mk-AppInputSelectX-menu"
            data-root="mk-AppInputSelectX"
            :style="{ minWidth: menuMinWidth }"
            role="listbox"
          >
            <AppMenuGroup>
              <slot name="options-header" />
              <AppMenuEntry v-if="!computedOptions.length">
                <slot name="options-empty">
                  {{ $t('melkor.component.AppInputSelectX.emptyOptions') }}
                </slot>
              </AppMenuEntry>
              <template v-else>
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
                          {{ `${computedOption.option.value}` }}
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
              </template>
              <slot name="options-footer" />
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
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import { useElementSize, onClickOutside } from '@vueuse/core';
import {
  type InputState, type ValidateInput, FloatingPlacement,
  type TextInputValue,
} from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import AppInputText from '@src/components/io/AppInputText.vue';
import AppInputTextableCancel from '@src/components/io/partials/AppInputTextableCancel.vue';
import AppMenu from '@src/components/floating/AppMenu.vue';
import AppMenuEntry from '@src/components/AppMenuEntry.vue';
import AppMenuGroup from '@src/components/AppMenuGroup.vue';
import AppIcon from '@src/components/AppIcon.vue';
import useInput, { validateInputState } from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';

type Value = unknown;

type AppInputSelectXOption<T> = {
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
  cancelable?: boolean;
  search?: InputState<TextInputValue>;
  hideSearchOnBlur?: boolean;
  cancelSearchOnBlur?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'update:search', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

// Data management

const {
  onChange, onFocus, onBlur, state, focused,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

function isSelectedOption(option: AppInputSelectXOption<Value>) {
  if (isArray(state.value.value)) {
    const candidate = state.value.value.find((valueOption) => isEqual(option.value, valueOption));
    return !!candidate;
  }
  return isEqual(option.value, state.value.value);
}

function handleChange(newOption: AppInputSelectXOption<Value>) {
  if (isArray(state.value.value)) {
    if (isSelectedOption(newOption)) {
      const newValue = state.value.value.filter((valueOption) => !isEqual(newOption.value, valueOption));
      onChange({ value: newValue });
      return;
    }
    onChange({ value: [...state.value.value, newOption.value] });
    return;
  }
  if (isSelectedOption(newOption)) {
    return;
  }

  onChange({ value: newOption.value });
}

const computedOptions = computed(() => props.options.map((option, index) => {
  const selected = isSelectedOption(option);
  let interactive = !(selected || option.disabled || props.disabled);
  if (isArray(state.value.value)) {
    interactive = !(option.disabled || props.disabled);
  }
  return {
    option,
    index,
    selected,
    interactive,
  };
}));

const currentRender = computed(() => {
  if (isArray(state.value.value)) {
    return state.value.value.join(', ');
  }
  return `${state.value.value}`;
});

// Menu size

const containerElement = ref<HTMLElement | null>(null);

const { width: nMenuMinWidth } = useElementSize(containerElement, undefined, { box: 'border-box' });
const menuMinWidth = computed(() => `${nMenuMinWidth.value}px`);

// Content size

const actionbarElement = ref<HTMLElement | null>(null);

const { width: nActionBarWidth } = useElementSize(actionbarElement, undefined, { box: 'border-box' });
const actionBarWidth = computed(() => `${nActionBarWidth.value}px`);

// Search

const searchElement = ref<HTMLInputElement | null>(null);
const isSearchable = computed(() => (!isNil(props.search) && (!props.hideSearchOnBlur || focused)));

// Focus / Blur

const inputElement = ref<HTMLElement | null>(null);
const menuElement = ref<HTMLElement | null>(null);
const labelElement = ref<HTMLElement | null>(null);
let clickOutsideExecution: number | null = null;

function handleBlur() {
  if (props.cancelSearchOnBlur && props.search) {
    emit('update:search', validateInputState({
      ...props.search,
      value: null,
    }));
  }
  onBlur();
}

function handleFocus() {
  if (props.hideSearchOnBlur) {
    requestAnimationFrame(() => {
      if (searchElement.value) {
        searchElement.value.focus();
      }
    });
  } else if (searchElement.value) {
    searchElement.value.focus();
  }
  onFocus();
}

function handleClickOutside() {
  if (clickOutsideExecution !== null) {
    cancelAnimationFrame(clickOutsideExecution);
  }
  clickOutsideExecution = requestAnimationFrame(handleBlur);
}

onClickOutside(inputElement, handleClickOutside, {
  ignore: [menuElement, labelElement],
});

onClickOutside(menuElement, handleClickOutside, {
  ignore: [inputElement, labelElement],
});

// Cancel

const isCancelable = computed(() => props.cancelable && !isNil(state.value.value));

function handleCancel() {
  onChange({ value: null });
}

// Expose

defineExpose({
  focus: handleFocus,
  blur: handleBlur,
});
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputSelectX,
[data-root="mk-AppInputSelectX"] {
    --mk-input-select-x-background-color: var(--app-input-background-color);
    --mk-input-select-x-border-color: var(--app-input-border-color);
    --mk-input-select-x-border-radius: var(--app-input-border-radius);
    --mk-input-select-x-border-width: var(--app-input-border-width);
    --mk-input-select-x-color: var(--app-input-color);
    --mk-input-select-x-font-size: var(--app-input-font-size);
    --mk-input-select-x-icon-size: 24px;
    --mk-input-select-x-line-height: var(--app-input-line-height);
    --mk-input-select-x-option-icon-size: 20px;
    --mk-input-select-x-padding-x: var(--app-input-padding-x);
    --mk-input-select-x-padding-y: var(--app-input-padding-y);
    --mk-input-select-x-search-color: var(--app-text-color-soft);
    --mk-input-select-x-spacing: var(--app-input-padding-x);
}

.mk-AppInputSelectX {
    $this: &;

    display: inline-block;
    max-width: 100%;

    &-content {
        display: flex;
        flex: 1 1 0%;
        flex-wrap: wrap;
        gap: calc(var(--mk-input-select-x-spacing) / 2);
        align-items: center;
        max-width: calc(100% - v-bind(actionBarWidth));
        min-height: calc(19px + var(--mk-input-select-x-padding-y) * 2);
        padding: var(--mk-input-select-x-padding-y) 0;
        overflow: hidden;
        font-size: var(--mk-input-select-x-font-size);
        line-height: var(--mk-input-select-x-line-height);
        color: var(--mk-input-select-x-color);

        &-search {
            display: inline-grid;
            flex: 1 1 auto;
            grid-template-columns: 0 min-content;
            color: var(--mk-input-select-x-search-color);

            .mk-AppInputText {
                grid-area: 1 / 2 / auto / auto;
                width: 100%;
                min-width: 2px;

                --mk-input-text-background-color: transparent;
                --mk-input-text-border-width: 0;
                --mk-input-text-padding-x: 0;
                --mk-input-text-padding-y: 0;
            }

            &::after {
                grid-area: 1 / 2 / auto / auto;
                white-space: pre;
                visibility: hidden;
                content: attr(data-value) " ";
            }
        }
    }

    &-menu {
        max-width: 100vh;

        .mk-AppMenuEntry {
            &[aria-disabled="true"] {
                opacity: var(--app-input-opacity-disabled);
            }
        }
    }

    &-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        &-label {
            line-height: 20px;
        }

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
    }

    &-container {
        display: flex;
        padding: 0 var(--mk-input-select-x-padding-x);
    }

    &-label {
        display: flex;
        flex-direction: column;
    }

    &-actionbar {
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        padding-left: var(--mk-input-select-x-spacing);

        &-arrow.mk-AppIcon {
            --mk-icon-size: var(--mk-input-select-x-icon-size);
            --mk-icon-weight: 200;

            pointer-events: none;
        }
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
