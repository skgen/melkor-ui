<template>
  <div
    v-theme="theme"
    class="mk-AppInputPassword"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputPassword-input">

        <slot name="leading-icon" />
        <input
          ref="passwordInput"
          :name="props.name"
          :type="type"
          :value="state.value"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
        <AppInputTextableCancel
          v-if="isCancelable"
          :disabled="props.disabled"
          @click="handleCancel"
        >
          <slot name="cancel" />
        </AppInputTextableCancel>
        <button
          class="mk-AppInputPassword-toggle"
          :disabled="props.disabled"
          @click="handleToggle"
        >
          <AppIcon :icon="icon" />
        </button>

        <slot name="trailing-icon" />
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
import type { InputState, ValidateInput } from '@src/definition';
import AppIcon from '@src/components/AppIcon.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import AppInputTextableCancel from '@src/components/io/partials/AppInputTextableCancel.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';
import { isValue } from '@src/lib/modules/definition';

type Value = string | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  hint?: string;
  disabled?: boolean;
  label?: string;
  fill?: boolean;
  cancelable?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const passwordInput = ref<HTMLInputElement | null>(null);

const { theme } = useTheme();

const encrypted = ref(true);

const type = computed(() => (encrypted.value ? 'password' : 'text'));
const icon = computed(() => (type.value === 'password' ? 'visibility' : 'visibility_off'));

const {
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

function handleToggle() {
  encrypted.value = !encrypted.value;
}

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  if (value === '') {
    onChange(null);
  } else {
    onChange(value);
  }
}

const isCancelable = computed(() => props.cancelable && isValue(state.value.value));

function handleCancel() {
  onChange(null);
  requestAnimationFrame(() => {
    if (!passwordInput.value) {
      return;
    }
    passwordInput.value.blur();
  });
}

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputPassword {
    --mk-input-password-background-color: var(--app-input-background-color);
    --mk-input-password-border-color: var(--app-input-border-color);
    --mk-input-password-border-radius: var(--app-input-border-radius);
    --mk-input-password-border-width: var(--app-input-border-width);
    --mk-input-password-color: var(--app-input-color);
    --mk-input-password-font-size: var(--app-input-font-size);
    --mk-input-password-line-height: var(--app-input-line-height);
    --mk-input-password-icon-color: var(--app-input-icon-color);
    --mk-input-password-icon-size: var(--app-input-icon-size);
    --mk-input-password-padding-x: var(--app-input-padding-x);
    --mk-input-password-padding-y: var(--app-input-padding-y);
    --mk-input-password-spacing: var(--app-input-padding-x);

    $this: &;

    display: inline-block;

    input {
        flex: 1;
        width: 100%;
        padding: var(--mk-input-password-padding-y) 0;
        font-size: var(--mk-input-password-font-size);
        line-height: var(--mk-input-password-line-height);
        color: var(--mk-input-password-color);
        background-color: transparent;
        border: none;
        outline: none;
    }

    &-input {
        display: flex;
        gap: var(--mk-input-password-spacing);
        align-items: center;
        width: 100%;
        padding: 0 var(--mk-input-password-padding-x);
        background-color: var(--mk-input-password-background-color);
        border: var(--mk-input-password-border-width) solid var(--mk-input-password-border-color);
        border-radius: var(--mk-input-password-border-radius);
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);

        .mk-AppIcon {
            --mk-icon-size: var(--mk-input-password-icon-size);
            --mk-icon-color: var(--mk-input-password-icon-color);
        }
    }

    &[data-focus="true"] {
        #{$this} {
            &-input {
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

    &-toggle {
        padding: 0;
        color: currentcolor;

        &:not(:disabled) {
            @include expand-click-area;
        }

        .mk-AppIcon {
            display: block;
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

    .mk-AppInputTextableCancel {
        --mk-input-textable-cancel-color: var(--mk-input-password-icon-color);
        --mk-input-textable-cancel-size: var(--mk-input-password-icon-size);
    }
}
</style>
