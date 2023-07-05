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
        ref="dropZoneElement"
        class="mk-AppInputFile-input"
        :data-is-full="isFull || undefined"
      >
        <input
          v-if="!isFull"
          :key="inputRenderKey"
          :name="props.name"
          type="file"
          :multiple="props.multiple"
          :disabled="props.disabled"
          :accept="computedAccept ?? undefined"
          @input="handleInput"
        >
        <i18n-t
          keypath="melkor.component.AppInputFile.dragdrop"
          scope="global"
        >
          <template #search>
            <em>{{ t(`melkor.component.AppInputFile.search`) }}</em>
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
      <template
        v-for="(file, index) of state.value"
        :key="index"
      >
        <slot
          name="file"
          v-bind="{ file, index, onDelete: () => handleDelete(index) }"
        >
          <AppFilePreview
            :file="file"
            :disabled="props.disabled"
            @delete="() => handleDelete(index)"
          />
        </slot>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
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
import isNil from 'lodash/isNil';
import isNumber from 'lodash/isNumber';
import { nanoid } from 'nanoid';

type Value = FileModel[];

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fill?: boolean;
  multiple?: boolean;
  max?: number;
  accept?: string[];
  maxSize?: number;
};

type Emits = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const dropZoneElement = ref<HTMLDivElement>();
const inputRenderKey = ref(nanoid());

const { theme } = useTheme();

const { t } = useI18n();

const { onChange, state } = useInput<Value>({
  props: computed(() => props),
  emit,
});

const computedMax = computed(() => (isNumber(props.max) && props.max > 0 ? props.max : null));
const computedMaxSize = computed(() => (isNumber(props.maxSize) && props.maxSize > 0 ? props.maxSize : null));
const isFull = computed(() => !isNil(computedMax.value) && state.value.value.length >= computedMax.value);

function handleChange(newFiles: FileModel[]) {
  inputRenderKey.value = nanoid();
  onChange({ value: newFiles });
}

function processFiles(files: File[]) {
  let newFiles = [...state.value.value];
  for (let i = 0; i < files.length; i += 1) {
    newFiles.push(fileToFileModel(files[i]));
  }
  if (!isNil(computedMax.value)) {
    newFiles = newFiles.slice(0, computedMax.value);
  }
  if (!isNil(computedMaxSize.value)) {
    const maxSize = computedMaxSize.value;
    newFiles = newFiles.filter((newFile) => isNil(newFile.size) || newFile.size <= maxSize);
  }

  handleChange(newFiles);
}

watch(computedMax, () => {
  processFiles([]);
});

watch(computedMaxSize, () => {
  processFiles([]);
});

function handleDrop(files: File[] | null) {
  processFiles(isValue(files) ? [...files] : []);
}

function handleDelete(indexToRemove: number) {
  if (props.disabled) {
    return;
  }

  const newFiles = state.value.value.filter((v, index) => index !== indexToRemove);

  handleChange(newFiles);
}

function handleInput(evt: Event) {
  if (!evt.target) {
    return;
  }
  const { files } = evt.target as HTMLInputElement;

  processFiles(isValue(files) ? [...files] : []);
}

useDropZone(dropZoneElement, handleDrop);

const computedAccept = computed(() => (props.accept ? props.accept.join(', ') : null));
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputFile {
    --mk-input-file-border-color: var(--app-input-border-color);
    --mk-input-file-dropzone-background-color: var(--app-input-background-color);
    --mk-input-file-dropzone-border-radius: var(--app-input-border-radius);
    --mk-input-file-dropzone-border-width: var(--app-input-border-width);

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

        &[data-is-full="true"] {
            cursor: not-allowed;
            opacity: var(--app-input-opacity-disabled);
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
