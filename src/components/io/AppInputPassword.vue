<template>
  <div
    class="mk-AppInputPassword"
    :data-focus="focus || undefined"
    :data-fill="props.fill || undefined"
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
          @input="handleChange"
          @focus="onFocus"
          @blur="onBlur"
        >
        <button
          class="mk-AppInputPassword-toggle"
          @click="handleToggle"
        >
          <AppIcon :icon="icon" />
        </button>
      </div>
    </label>
    <AppInputHint v-if="props.hint">
      {{ props.hint }}
    </AppInputHint>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppIcon from '@src/components/AppIcon.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import useInput from '@src/composables/useInput';

type Value = string;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  fill?: boolean;
  hint?: string;
  label?: string;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const encrypted = ref(true);

const type = computed(() => (encrypted.value ? 'password' : 'text'));
const icon = computed(() => (type.value === 'password' ? 'visibility' : 'visibility_off'));

const {
  onChange, onFocus, onBlur, state, focus,
} = useInput<Value>({
  state: computed(() => props.modelValue),
  emits,
  validate: props.validate,
});

function handleToggle() {
  encrypted.value = !encrypted.value;
}

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { value } = evt.target as HTMLInputElement;

  onChange(value);
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

    display: inline-block;

    input {
        flex: 1;
        width: 100%;
        padding: var(--mk-input-password-padding-y) 0 var(--mk-input-password-padding-y) var(--mk-input-password-padding-x);
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
        background-color: rgb(var(--mk-input-password-background-color));
        border: 1px solid rgb(var(--mk-input-password-border-color));
        border-radius: var(--mk-input-password-border-radius);
        transition: border-color var(--app-transition-duration-1);
    }

    &[data-focus="true"] {
        --mk-input-password-border-color: var(--app-primary-color);
    }

    &[data-fill="true"] {
        display: block;
    }

    &-toggle {
        @include expand-click-area;

        padding: 0;
        font-size: 20px;

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
}
</style>
