<template>
  <label class="mk-AppInputPassword">
    <input
      :name="props.name"
      :type="type"
      :value="state.value"
      @input="handleChange"
    >
    <AppButton
      class="mk-AppInputPassword-toggle"
      @click="handleToggle"
    >
      <!-- <EyeIcon v-if="!encrypted" />
      <EyeSlashIcon v-else /> -->
    </AppButton>
    <AppInputError
      v-if="state.error"
      :error="state.error"
    />
  </label>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
// import EyeIcon from '@heroicons/vue/24/outline/EyeIcon';
// import EyeSlashIcon from '@heroicons/vue/24/outline/EyeSlashIcon';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputError from '@src/components/io/AppInputError.vue';
import AppButton from '@src/components/AppButton.vue';
import useInput from '@src/composables/useInput';

type Value = string;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const encrypted = ref(true);

const type = computed(() => (encrypted.value ? 'password' : 'text'));

const { onChange, state } = useInput<Value>({
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
.mk-AppInputPassword {
    display: flex;

    &-toggle {
        svg {
            width: 18px;
        }
    }
}
</style>
