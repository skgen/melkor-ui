<template>
  <div
    v-theme="theme"
    class="mk-AppFilePreview"
    :data-disabled="props.disabled || undefined"
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
        :disabled="props.disabled"
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
import useTheme from '@src/composables/useTheme';

type Props = {
  file: FileModel | File;
  disabled?: boolean;
};

type Emits = {
  (event: 'delete'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

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
    --mk-input-file-preview-border-radius: var(--app-input-border-radius);
    --mk-input-file-preview-icon-border-radius: calc(var(--app-border-radius) * 2);
    --mk-input-file-preview-icon-w: 54px;
    --mk-input-file-preview-icon-h: 54px;
    --mk-input-file-preview-icon-border-color: var(--app-border-color);
    --mk-input-file-preview-icon-color: var(--app-primary-color);
    --mk-input-file-preview-size-color: var(--app-text-color-soft);
    --mk-input-file-preview-delete-background-color: var(--app-background-color-highlight);
    --mk-input-file-preview-delete-background-color-hover: var(--app-background-color-highlight-hover);
    --mk-input-file-preview-delete-w: 38px;
    --mk-input-file-preview-delete-h: 38px;

    @include light {
        --mk-input-file-preview-border-color: var(--app-border-color);
    }

    @include dark {
        --mk-input-file-preview-border-color: var(--app-border-color-highlight);
    }

    $this: &;

    padding: var(--app-m-1) var(--app-m-2) var(--app-m-1) var(--app-m-1);
    border: 1px solid var(--mk-input-file-preview-border-color);
    border-radius: var(--mk-input-file-preview-border-radius);
    transition:
        border-color var(--app-transition-duration-color),
        opacity  var(--app-transition-duration-opacity);

    &-wrapper {
        display: flex;
        gap: var(--app-m-2);
        align-items: center;
    }

    &-icon {
        width: var(--mk-input-file-preview-icon-w);
        height: var(--mk-input-file-preview-icon-h);
        transition: filter var(--app-transition-duration-color);

        img {
            object-fit: contain;
            width: 100%;
            height: 100%;
            border-radius: var(--mk-input-file-preview-icon-border-radius);
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
        color: var(--mk-input-file-preview-icon-color);
        border: 1px solid var(--mk-input-file-preview-icon-border-color);
        border-radius: var(--mk-input-file-preview-icon-border-radius);

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
        color: var(--mk-input-file-preview-size-color);
    }

    &-delete {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--mk-input-file-preview-delete-w);
        height: var(--mk-input-file-preview-delete-h);
        padding: 0;
        margin-left: auto;
        color: currentcolor;
        background-color: var(--mk-input-file-preview-delete-background-color);
        border-radius: 50%;
        transition: background-color var(--app-transition-duration-background);

        .mk-AppIcon {
            --mk-icon-size: 20px;
        }
    }

    &:not([data-disabled="true"]) {
        #{$this} {
            &-delete {
                cursor: pointer;

                &:hover {
                    background-color: var(--mk-input-file-preview-delete-background-color-hover);
                }
            }
        }
    }

    &[data-disabled="true"] {
        border-color: var(--app-input-color-disabled);
        opacity: var(--app-input-opacity-disabled);

        #{$this} {
            &-icon {
                filter: grayscale(100%);
            }
        }
    }
}
</style>
