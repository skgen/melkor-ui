<template>
  <div
    v-theme="theme"
    class="mk-AppInputCheckboxTree"
  >
    <AppInputLabel v-if="props.label">
      {{ props.label }}
    </AppInputLabel>
    <div class="mk-AppInputCheckboxTree-children">
      <AppInputCheckboxTreeLevel
        v-for="(level, index) in props.modelValue.value"
        :key="index"
        v-bind="level"
        :disabled="props.disabled"
        @update:level="(newLevel) => handleChange(newLevel, index)"
      />
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
import type {
  CheckboxTreeLevel, InputState, NonArray, ValidateInput,
} from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import AppInputCheckboxTreeLevel from '@src/components/io/partials/AppInputCheckboxTreeLevel.vue';
import useTheme from '@src/composables/useTheme';
import { computed } from 'vue';
import useInput from '@src/composables/useInput';

type Value = CheckboxTreeLevel<unknown, unknown>[];

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

const {
  onChange, state,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

function handleChange(newLevel: NonArray<Value>, index: number) {
  const newValue: Value = [...props.modelValue.value];
  newValue[index] = newLevel;
  onChange({
    value: newValue,
  });
}
</script>

<style lang="scss">
.mk-AppInputCheckboxTree {
    &-children {
        display: flex;
        flex-direction: column;
    }

    > .mk-AppInputLabel {
        display: block;
        margin-bottom: var(--app-m-1);
    }

    > .mk-AppInputHint {
        display: block;
        margin-top: var(--app-m-1);
    }

    > .mk-AppInputError {
        display: block;
        margin-top: var(--app-m-1);
    }
}
</style>
