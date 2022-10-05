<template>
  <div
    class="mk-AppImage"
    :data-ratio="!!ratio || undefined"
    :data-fit="fit ?? undefined"
  >
    <img
      :src="props.src"
      :alt="props.alt"
      :title="props.title"
    >
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

enum Fit {
  cover = 'cover',
  contain = 'contain',
}

type Props = {
  src: string;
  alt?: string;
  title?: string;
  ratio?: [number, number];
  cover?: boolean;
  contain?: boolean;
};

const props = defineProps<Props>();

const ratio = computed(() => {
  if (props.ratio && props.ratio[0] && props.ratio[1]) {
    return `${(props.ratio[1] / props.ratio[0]) * 100}%`;
  }
  return null;
});

const fit = computed(() => {
  if (props.cover) {
    return Fit.cover;
  }
  if (props.contain) {
    return Fit.contain;
  }
  return null;
});

</script>

<style lang="scss">
.mk-AppImage {
    position: relative;

    &[data-ratio="true"] {
        padding-top: v-bind("ratio");

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }

    &[data-fit="contain"] {
        img {
            object-fit: contain;
        }
    }

    &[data-fit="cover"] {
        img {
            object-fit: cover;
        }
    }
}
</style>
