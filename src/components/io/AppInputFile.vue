<template>
  <div class="mk-AppInputFile">
    <div
      v-if="state.value.length > 0"
      class="mk-AppInputFile-previews"
    >
      <AppFilePreview
        v-for="(file, index) in state.value"
        :key="index"
        class="mk-AppInputFile-previews-item"
        :file="file"
        @click="() => handleDelete(index)"
      />
    </div>

    <label class="mk-AppInputFile-label">
      <input
        ref="inputRef"
        :name="props.name"
        type="file"
        multiple
        @input="handleChange"
      >
      <AppButton @click="handleProxyInput">
        Select files <span v-if="state.value.length > 0">({{ state.value.length }})</span>
      </AppButton>

    </label>

    <AppInputError
      v-if="state.error"
      :error="state.error"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type {
  FileModel, InputState, ValidateInput,
} from '@src/definition';
import AppButton from '@src/components/AppButton.vue';
import AppFilePreview from '@src/components/AppFilePreview.vue';
import AppInputError from '@src/components/io/AppInputError.vue';
import useInput from '@src/composables/useInput';
import { isValue } from '@src/lib/modules/definition';
import { fileToFileModel } from '@src/lib/modules/file';

type Value = FileModel[];

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

const { onChange, state } = useInput<Value>({
  state: computed(() => props.modelValue),
  emits,
  validate: props.validate,
});

const inputRef = ref<HTMLInputElement | null>(null);

function handleDelete(indexToRemove: number) {
  const newValue = state.value.value.filter((v, index) => index !== indexToRemove);
  onChange(newValue);
}

function handleProxyInput() {
  if (!isValue(inputRef.value)) {
    return;
  }

  inputRef.value.click();
}

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { files } = evt.target as HTMLInputElement;

  if (!isValue(files)) {
    onChange([]);
  } else {
    const newFiles = [...state.value.value];
    for (let i = 0; i < files.length; i += 1) {
      newFiles.push(fileToFileModel(files[i]));
    }
    onChange(newFiles);
  }
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputFile {
    &-label {
        display: inline-flex;
    }

    &-previews {
        display: flex;
        gap: 8px;
        margin: 0 0 8px;

        &-item {
            cursor: pointer;
            transition: opacity 128ms;

            &:hover {
                opacity: 0.5;
            }
        }
    }

    input {
        @include a11y-hidden;
    }
}
</style>
