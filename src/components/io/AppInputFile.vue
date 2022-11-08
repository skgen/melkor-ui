<template>
  <div
    v-theme="{ scheme }"
    class="mk-AppInputFile"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div class="mk-AppInputFile-dropzone">
        <input
          ref="inputRef"
          :name="props.name"
          type="file"
          multiple
          @input="handleChange"
        >
        <i18n-t
          keypath="melkor.component.inputFile.dragdrop"
          scope="global"
        >
          <template #search>
            <em>{{ t(`melkor.component.inputFile.search`) }}</em>
          </template>
        </i18n-t>
      </div>
    </label>
    <AppInputHint v-if="props.hint">
      {{ props.hint }}
    </AppInputHint>
    <div
      v-if="state.value.length > 0"
      class="mk-AppInputFile-previews"
    >
      <AppFilePreview
        v-for="(file, index) in state.value"
        :key="index"
        class="mk-AppInputFile-previews-item"
        :file="file"
        @delete="() => handleDelete(index)"
      />
    </div>
    <AppInputError v-if="state.error">
      {{ state.error }}
    </AppInputError>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type {
  FileModel, InputState, ValidateInput,
} from '@src/definition';
import AppFilePreview from '@src/components/AppFilePreview.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';
import { isValue } from '@src/lib/modules/definition';
import { fileToFileModel } from '@src/lib/modules/file';
import { useI18n } from 'vue-i18n';

import useComponentTheme from '@src/composables/useComponentTheme';

type Value = FileModel[];

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { scheme } = useComponentTheme();

const { t } = useI18n();

const { onChange, state } = useInput<Value>({
  props: computed(() => props),
  emits,
});

const inputRef = ref<HTMLInputElement | null>(null);

function handleDelete(indexToRemove: number) {
  const newValue = state.value.value.filter((v, index) => index !== indexToRemove);
  onChange(newValue);
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
    --mk-input-file-border-color: var(--app-border-color-highlight);
    --mk-input-file-dropzone-background-color: var(--app-background-color-soft);
    --mk-input-file-dropzone-border-width: 1px;
    --mk-input-file-dropzone-border-radius: var(--app-border-radius);

    &-dropzone {
        padding: var(--app-m-3);
        font-size: 0.875rem;
        color: var(--app-text-color-soft);
        text-align: center;
        cursor: pointer;
        background-color: var(--mk-input-file-dropzone-background-color);
        border: var(--mk-input-file-dropzone-border-width) dashed var(--mk-input-file-border-color);
        border-radius: var(--mk-input-file-dropzone-border-radius);

        em {
            font-style: normal;
            color: var(--app-primary-color);

            @include underline;
        }

        input {
            @include a11y-hidden;
        }
    }

    &-previews {
        display: flex;
        flex-direction: column;
        gap: var(--app-m-2);
        margin: var(--app-m-2) 0 0 0;
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
