<template>
  <div class="mk-AppFilePreview">
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
        <!-- <DocumentIcon /> -->
      </div>
    </div>
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
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import fileSize from 'filesize';
// import DocumentIcon from '@heroicons/vue/24/outline/DocumentIcon';
import type { FileModel } from '@src/definition';
import { isFileModel, fileToFileModel, FileType } from '@src/lib/modules/file';

type Props = {
  file: FileModel | File;
};

const props = defineProps<Props>();

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
.mk-AppFilePreview {
    font-size: 0.8rem;

    &-icon {
        width: 100px;
        height: 100px;
        padding: 5px;
        border: 1px solid var(--app-border-color);

        img {
            object-fit: contain;
            width: 100%;
            height: 100%;
        }
    }

    &-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        svg {
            width: 80%;
        }
    }

    &-name {
        display: block;
    }

    &-size {
        display: block;
    }
}
</style>
