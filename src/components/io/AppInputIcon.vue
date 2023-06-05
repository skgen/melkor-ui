<template>
  <div
    v-theme="theme"
    class="mk-AppInputIcon"
    :data-focus="state.focused || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div
        ref="input"
        class="mk-AppInputIcon-input"
      >
        <div
          class="mk-AppInputIcon-select"
          @click="handleToggle"
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
        <transition name="mk-fade">
          <div
            v-if="open"
            class="mk-AppInputIcon-options"
          >
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
                    {{ $t(`melkor.component.inputIcon.${key}`) }}
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
        </transition>
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

<script lang="ts" setup>
import { computed, ref } from 'vue';
import isEqual from 'lodash/isEqual';
import type {
  InputState, ValidateInput,
} from '@src/definition';
import AppIcon from '@src/components/AppIcon.vue';
import AppInfiniteScroll from '@src/components/AppInfiniteScroll.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';
import { getIcons } from '@src/lib/modules/icons';

import { onClickOutside } from '@vueuse/core';
import { isValue } from '@src/lib/modules/definition';

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

const currentIcons = computed(() => {
  const ic: Record<string, string[]> = {};
  const keys = Object.keys(icons) as (keyof typeof icons)[];
  let keyIndex = 0;
  let levelIndex = 0;
  for (let i = 1; i <= iconsPage.value; i += 1) {
    for (let j = 0; j < 16; j += 1) {
      const icon = icons[keys[keyIndex]][levelIndex];
      if (!isValue(ic[keys[keyIndex]])) {
        ic[keys[keyIndex]] = [];
      }
      if (isValue(icon)) {
        ic[keys[keyIndex]].push(icon);
        levelIndex += 1;
      } else {
        levelIndex = 0;
        if (isValue(keys[keyIndex + 1])) {
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

const open = ref(false);
const input = ref<HTMLDivElement | null>(null);

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

function handleOpen() {
  onFocus();
  open.value = true;
}

function handleClose() {
  onBlur();
  resetIcons();
  open.value = false;
}

function handleToggle() {
  if (open.value) {
    handleClose();
  } else {
    handleOpen();
  }
}

onClickOutside(input, handleClose);
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputIcon {
    --mk-input-icon-background-color: var(--app-input-background-color);
    --mk-input-icon-border-color: var(--app-input-border-color);
    --mk-input-icon-border-radius: var(--app-input-border-radius);
    --mk-input-icon-border-width: var(--app-input-border-width);
    --mk-input-icon-font-size: var(--app-input-font-size);
    --mk-input-icon-line-height: var(--app-input-line-height);
    --mk-input-icon-color: var(--app-input-color);
    --mk-input-icon-icon-size: 24px;
    --mk-input-icon-padding-x-left: var(--app-input-padding-x);
    --mk-input-icon-padding-x-right: calc(var(--app-input-padding-x) * 2 + var(--mk-input-icon-icon-size));
    --mk-input-icon-padding-y: var(--app-input-padding-y);
    --mk-input-icon-options-distance: 2px;
    --mk-input-icon-option-background-color: var(--app-input-background-color);
    --mk-input-icon-option-background-color-hover: var(--app-background-color-highlight);

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

            position: absolute;
            top: 50%;
            right: calc((var(--mk-input-icon-padding-x-right) - var(--mk-icon-size)) / 2);
            font-weight: 200;
            pointer-events: none;
            transform: translate(0, -50%);
        }

        &[disabled] {
            opacity: 1;
        }
    }

    &-input {
        position: relative;
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);
    }

    &-options {
        $options: &;

        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        background-color: var(--mk-input-icon-option-background-color);
        border: var(--mk-input-icon-border-width) solid var(--mk-input-icon-border-color);
        border-radius: var(--mk-input-icon-border-radius);
        transform: translate(0, calc(100% + var(--mk-input-icon-options-distance)));

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
            grid-template-columns: 1fr 1fr 1fr 1fr;
            padding: 0 calc(var(--mk-input-icon-padding-x-left) - var(--mk-input-icon-padding-y));

            & + #{$options} {
                &-title {
                    border-top: var(--mk-input-icon-border-width) solid var(--mk-input-icon-border-color);
                }
            }
        }

        &-icon {
            padding: var(--mk-input-icon-padding-y);
            transition: background-color var(--app-transition-duration-background);

            .mk-AppIcon {
                display: block;

                --mk-icon-size: 24px;
            }

            &:hover {
                background-color: var(--mk-input-icon-option-background-color-hover);
            }
        }
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
