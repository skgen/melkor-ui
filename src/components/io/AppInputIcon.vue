<template>
  <div
    v-theme="theme"
    class="mk-AppInputIcon"
    :data-focus="state.focused || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <div class="mk-AppInputIcon-label">
      <AppInputLabel
        v-if="props.label"
        ref="labelElement"
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
          ref="inputElement"
          class="mk-AppInputIcon-input"
        >
          <div
            class="mk-AppInputIcon-select"
            @click="handleFocus"
          >
            <span class="mk-AppInputIcon-select-value">
              <template v-if="state.value">
                <AppIcon :icon="state.value" />
              </template>
              <template v-else>
                -----
              </template>
            </span>
            <AppIcon
              icon="expand_more"
              class="mk-AppInputIcon-select-arrow"
            />
          </div>
        </div>
        <template #menu>
          <div
            ref="menuElement"
            class="mk-AppInputIcon-menu"
            data-root="mk-AppInputIcon"
          >
            <div class="mk-AppInputIcon-options">
              <div class="mk-AppInputIcon-options-list">
                <AppInfiniteScroll
                  scrollable
                  bottom
                  :distance="200"
                  @infinite="handleInfinite"
                >
                  <template
                    v-for="(group, key) of currentIcons"
                    :key="key"
                  >
                    <div class="mk-AppInputIcon-options-title">
                      {{ $t(`melkor.component.AppInputIcon.${key}`) }}
                    </div>
                    <ul
                      v-if="group.length > 0"
                      class="mk-AppInputIcon-options-icons"
                    >
                      <li
                        v-for="icon of group"
                        :key="icon"
                        class="mk-AppInputIcon-options-icon"
                        data-type="icon"
                        :data-selected="isSelectedOption(icon)"
                        @click="() => handleChange(icon)"
                      >
                        <AppIcon :icon="icon" />
                      </li>
                    </ul>
                  </template>
                </AppInfiniteScroll>
              </div>
            </div>
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
import { onClickOutside } from '@vueuse/core';
import {
  type InputState, type ValidateInput, FloatingPlacement,
} from '@src/definition';
import AppIcon from '@src/components/AppIcon.vue';
import AppInfiniteScroll from '@src/components/AppInfiniteScroll.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import AppMenu from '@src/components/floating/AppMenu.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';
import { getIcons } from '@src/lib/modules/icons';
import FloatingVue from 'floating-vue';

type Value = string | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fill?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const iconsPage = ref(1);
const icons = getIcons();
const pageSize = 30;

const currentIcons = computed(() => {
  const ic: Record<string, string[]> = {};
  const keys = Object.keys(icons) as (keyof typeof icons)[];
  let keyIndex = 0;
  let levelIndex = 0;
  for (let i = 1; i <= iconsPage.value; i += 1) {
    for (let j = 0; j < pageSize; j += 1) {
      const icon = icons[keys[keyIndex]][levelIndex];
      if (isNil(ic[keys[keyIndex]])) {
        ic[keys[keyIndex]] = [];
      }
      if (!isNil(icon)) {
        ic[keys[keyIndex]].push(icon);
        levelIndex += 1;
      } else {
        levelIndex = 0;
        if (!isNil(keys[keyIndex + 1])) {
          keyIndex += 1;
        } else {
          return ic;
        }
      }
    }
  }
  return ic;
});

function handleInfinite() {
  iconsPage.value += 1;
}

function resetIcons() {
  iconsPage.value = 1;
}

const { theme } = useTheme();

const {
  onChange, onFocus, onBlur, state,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

function isSelectedOption(option: Value) {
  return isEqual(option, state.value.value);
}

function handleChange(newIcon: Value) {
  onChange({ value: newIcon });
}

// Focus / Blur

const inputElement = ref<HTMLElement | null>(null);
const menuElement = ref<HTMLElement | null>(null);
const labelElement = ref<HTMLElement | null>(null);
let clickOutsideExecution: number | null = null;

function handleBlur() {
  setTimeout(() => {
    requestAnimationFrame(() => {
      resetIcons();
    });
  }, FloatingVue.options.disposeTimeout);
  onBlur();
}

function handleFocus() {
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
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputIcon,
[data-root="mk-AppInputIcon"] {
    --mk-input-icon-background-color: var(--app-input-background-color);
    --mk-input-icon-border-color: var(--app-input-border-color);
    --mk-input-icon-border-radius: var(--app-input-border-radius);
    --mk-input-icon-border-width: var(--app-input-border-width);
    --mk-input-icon-font-size: var(--app-input-font-size);
    --mk-input-icon-line-height: var(--app-input-line-height);
    --mk-input-icon-color: var(--app-input-color);
    --mk-input-icon-icon-size: 24px;
    --mk-input-icon-option-background-color: var(--app-input-background-color);
    --mk-input-icon-option-background-color-hover: var(--app-background-color-highlight);
    --mk-input-icon-option-icon-size: 20px;
    --mk-input-icon-padding-x-left: var(--app-input-padding-x);
    --mk-input-icon-padding-x-right: calc(var(--app-input-padding-x) * 2 + var(--mk-input-icon-icon-size));
    --mk-input-icon-padding-y: var(--app-input-padding-y);
}

.mk-AppInputIcon {
    $this: &;

    display: inline-block;

    &-select {
        display: flex;
        width: 100%;
        padding:
            var(--mk-input-icon-padding-y)
            var(--mk-input-icon-padding-x-right)
            var(--mk-input-icon-padding-y)
            var(--mk-input-icon-padding-x-left);
        font-size: var(--mk-input-icon-font-size);
        line-height: var(--mk-input-icon-line-height);
        color: var(--mk-input-icon-color);
        background-color: var(--mk-input-icon-background-color);
        border: var(--mk-input-icon-border-width) solid var(--mk-input-icon-border-color);
        border-radius: var(--mk-input-icon-border-radius);
        outline: none;
        transition: border-color var(--app-transition-duration-color);
        appearance: none;

        &-value {
            display: flex;
            align-items: center;
            height: calc(var(--mk-input-icon-font-size) * var(--mk-input-icon-line-height));
        }

        &-arrow.mk-AppIcon {
            --mk-icon-size: var(--mk-input-icon-icon-size);
            --mk-icon-weight: 200;

            position: absolute;
            top: 50%;
            right: calc((var(--mk-input-icon-padding-x-right) - var(--mk-icon-size)) / 2);
            pointer-events: none;
            transform: translate(0, -50%);
        }

        &[disabled] {
            opacity: 1;
        }
    }

    &-input {
        position: relative;
        min-width: 180px;
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);
    }

    &-menu {
        max-width: 100vh;
    }

    &-options {
        $options: &;

        &-list {
            height: 201px;
        }

        &-title {
            display: flex;
            padding:
                var(--mk-input-icon-padding-y)
                var(--mk-input-icon-padding-x-left);
            font-weight: 700;
        }

        &-icons {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
            padding: 0 calc(var(--mk-input-icon-padding-x-left) - var(--mk-input-icon-padding-y));

            & + #{$options} {
                &-title {
                    border-top: var(--mk-input-icon-border-width) solid var(--mk-input-icon-border-color);
                }
            }
        }

        &-icon {
            padding: var(--mk-input-icon-padding-y);
            border-radius: var(--mk-input-icon-border-radius);
            transition: background-color var(--app-transition-duration-background);

            .mk-AppIcon {
                display: block;
                cursor: default;

                --mk-icon-size: var(--mk-input-icon-option-icon-size);
            }

            &:hover {
                background-color: var(--mk-input-icon-option-background-color-hover);
            }
        }
    }

    &-label {
        display: flex;
        flex-direction: column;
    }

    &[data-focus="true"] {
        #{$this} {
            &-select {
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
