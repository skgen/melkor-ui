<template>
  <div
    v-theme="{ scheme }"
    class="mk-AppFilePreview"
  >
    <div class="mk-AppFilePreview-wrapper">
      <div class="mk-AppFilePreview-icon">
        <img
          v-if="isImage && preview.url"
          :src="preview.url"
          :alt="preview.name ?? undefined"
          :title="preview.name ?? undefined"
        >
        <div
          v-else
          class="mk-AppFilePreview-placeholder"
        >
          <AppIcon icon="description" />
        </div>
      </div>
      <div class="mk-AppFilePreview-description">
        <span
          v-if="preview.name"
          class="mk-AppFilePreview-name"
        >
          {{ preview.name }}
        </span>
        <span
          v-if="size"
          class="mk-AppFilePreview-size"
        >
          {{ size }}
        </span>
      </div>
      <button
        class="mk-AppFilePreview-delete"
        @click="() => emit('delete')"
      >
        <AppIcon icon="close" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import fileSize from 'filesize';
import type { FileModel } from '@src/definition';
import { isFileModel, fileToFileModel, FileType } from '@src/lib/modules/file';
import AppIcon from '@src/components/AppIcon.vue';
import useComponentTheme from '@src/composables/useComponentTheme';

type Props = {
  file: FileModel | File;
};

type Emits = {
  (event: 'delete'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { scheme } = useComponentTheme();

const { locale } = useI18n();

const preview = computed(() => {
  if (isFileModel(props.file)) {
    return props.file;
  }
  return fileToFileModel(props.file);
});

const size = computed(() => {
  if (preview.value.size) {
    return fileSize.partial({ standard: 'jedec', locale: locale.value })(preview.value.size);
  }
  return null;
});

const isImage = computed(() => preview.value.type === FileType.image);
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppFilePreview {
    --mk-file-preview-border-color: var(--app-border-color-highlight);
    --mk-file-preview-border-radius: var(--app-border-radius);
    --mk-file-preview-icon-border-radius: calc(var(--app-border-radius) * 2);
    --mk-file-preview-icon-w: 54px;
    --mk-file-preview-icon-h: 54px;
    --mk-file-preview-icon-border-color: var(--app-border-color);
    --mk-file-preview-icon-color: var(--app-primary-color);
    --mk-file-preview-size-color: var(--app-text-color-soft);
    --mk-file-preview-delete-background-color: var(--app-background-color-highlight);
    --mk-file-preview-delete-background-color-hover: var(--app-background-color-highlight-hover);
    --mk-file-preview-delete-w: 38px;
    --mk-file-preview-delete-h: 38px;

    padding: var(--app-m-1) var(--app-m-2) var(--app-m-1) var(--app-m-1);
    border: 1px solid var(--mk-file-preview-border-color);
    border-radius: var(--mk-file-preview-border-radius);

    &-wrapper {
        display: flex;
        gap: var(--app-m-2);
        align-items: center;
    }

    &-icon {
        width: var(--mk-file-preview-icon-w);
        height: var(--mk-file-preview-icon-h);

        img {
            object-fit: contain;
            width: 100%;
            height: 100%;
            border-radius: var(--mk-file-preview-icon-border-radius);
        }
    }

    &-description {
        display: flex;
        flex-direction: column;
        gap: var(--app-m-1);
    }

    &-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--mk-file-preview-icon-color);
        border: 1px solid var(--mk-file-preview-icon-border-color);
        border-radius: var(--mk-file-preview-icon-border-radius);

        .mk-AppIcon {
            --mk-icon-size: 40px;
        }
    }

    &-name {
        display: block;
        font-size: 0.9375rem;
    }

    &-size {
        display: block;
        font-size: 0.75rem;
        color: var(--mk-file-preview-size-color);
    }

    &-delete {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--mk-file-preview-delete-w);
        height: var(--mk-file-preview-delete-h);
        padding: 0;
        margin-left: auto;
        cursor: pointer;
        background-color: var(--mk-file-preview-delete-background-color);
        border-radius: 50%;
        transition: background-color var(--app-transition-duration-background);

        .mk-AppIcon {
            --mk-icon-size: 20px;
        }

        &:hover {
            background-color: var(--mk-file-preview-delete-background-color-hover);
        }
    }
}
</style>
