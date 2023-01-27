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
        <input
          :name="props.name"
          :type="type"
          :value="state.value"
          :disabled="props.disabled"
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
        <button
          class="mk-AppInputPassword-toggle"
          :disabled="props.disabled"
          @click="handleToggle"
        >
          <AppIcon :icon="icon" />
        </button>
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
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';

type Value = string | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  hint?: string;
  disabled?: boolean;
  label?: string;
  fill?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { theme } = useTheme();

const encrypted = ref(true);

const type = computed(() => (encrypted.value ? 'password' : 'text'));
const icon = computed(() => (type.value === 'password' ? 'visibility' : 'visibility_off'));

const {
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
  props: computed(() => props),
  emits,
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

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputPassword {
    --mk-input-password-padding-x: var(--app-input-padding-x);
    --mk-input-password-padding-y: var(--app-input-padding-y);
    --mk-input-password-border-radius: var(--app-border-radius);
    --mk-input-password-background-color: var(--app-input-background-color);
    --mk-input-password-border-color: var(--app-input-border-color);

    $this: &;

    display: inline-block;

    input {
        flex: 1;
        width: 100%;
        padding: var(--mk-input-password-padding-y) 0 var(--mk-input-password-padding-y) var(--mk-input-password-padding-x);
        color: currentcolor;
        background-color: transparent;
        border: none;
        outline: none;
    }

    &-input {
        display: inline-flex;
        gap: calc(var(--mk-input-password-padding-x) / 2);
        align-items: center;
        width: 100%;
        padding-right: var(--mk-input-password-padding-x);
        background-color: var(--mk-input-password-background-color);
        border: 1px solid var(--mk-input-password-border-color);
        border-radius: var(--mk-input-password-border-radius);
        transition:
            border-color var(--app-transition-duration-color),
            opacity var(--app-transition-duration-opacity);
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

            --mk-icon-size: 20px;
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
