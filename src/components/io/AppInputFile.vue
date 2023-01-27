<template>
  <div
    v-theme="theme"
    class="mk-AppInputFile"
    :data-fill="props.fill || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <label>
      <AppInputLabel v-if="props.label">
        {{ props.label }}
      </AppInputLabel>
      <div
        ref="dropZoneRef"
        class="mk-AppInputFile-input"
      >
        <input
          :name="props.name"
          type="file"
          multiple
          :disabled="props.disabled"
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
    <AppInputError v-if="state.error">
      {{ state.error }}
    </AppInputError>
    <div
      v-if="state.value.length > 0"
      class="mk-AppInputFile-previews"
    >
      <AppFilePreview
        v-for="(file, index) in state.value"
        :key="index"
        class="mk-AppInputFile-previews-item"
        :file="file"
        :disabled="props.disabled"
        @delete="() => handleDelete(index)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type {
  FileModel, InputState, ValidateInput,
} from '@src/definition';
import AppFilePreview from '@src/components/io/partials/AppInputFilePreview.vue';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import AppInputError from '@src/components/io/decoration/AppInputError.vue';
import useInput from '@src/composables/useInput';
import { isValue } from '@src/lib/modules/definition';
import { fileToFileModel } from '@src/lib/modules/file';
import { useI18n } from 'vue-i18n';
import useTheme from '@src/composables/useTheme';
import { useDropZone } from '@vueuse/core';

type Value = FileModel[];

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
const emits = defineEmits<Emits>();

const dropZoneRef = ref<HTMLDivElement>();

const { theme } = useTheme();

const { t } = useI18n();

const { onChange, state } = useInput<Value>({
  props: computed(() => props),
  emits,
});

function processFiles(files: File[] | null) {
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

function handleDrop(files: File[] | null) {
  processFiles(isValue(files) ? [...files] : null);
}

function handleDelete(indexToRemove: number) {
  if (props.disabled) {
    return;
  }
  const newValue = state.value.value.filter((v, index) => index !== indexToRemove);
  onChange(newValue);
}

function handleChange(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { files } = evt.target as HTMLInputElement;

  processFiles(isValue(files) ? [...files] : null);
}

useDropZone(dropZoneRef, handleDrop);
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputFile {
    --mk-input-file-border-color: var(--app-border-color);
    --mk-input-file-dropzone-background-color: var(--app-background-color-soft);
    --mk-input-file-dropzone-border-width: 1px;
    --mk-input-file-dropzone-border-radius: var(--app-border-radius);

    $this: &;

    display: inline-block;

    &-input {
        padding: var(--app-m-3);
        font-size: 0.875rem;
        color: var(--app-text-color-soft);
        text-align: center;
        cursor: pointer;
        background-color: var(--mk-input-file-dropzone-background-color);
        border: var(--mk-input-file-dropzone-border-width) dashed var(--mk-input-file-border-color);
        border-radius: var(--mk-input-file-dropzone-border-radius);
        transition: opacity var(--app-transition-duration-opacity);

        em {
            font-style: normal;
            color: var(--app-primary-color);

            @include underline;

            transition: opacity var(--app-transition-duration-color);
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

    &[data-fill="true"] {
        @include mk-fill;
    }

    &[data-disabled="true"] {
        #{$this} {
            &-input {
                cursor: default;
                opacity: var(--app-input-opacity-disabled);

                em {
                    color: var(--app-input-color-disabled);
                }
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
