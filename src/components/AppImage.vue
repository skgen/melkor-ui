<template>
  <div
    v-theme="theme"
    class="mk-AppImage"
    :data-ratio="ratio !== 'initial' || undefined"
    :data-fit="fit ?? undefined"
  >
    <div class="mk-AppImage-shape">
      <img
        :src="props.src"
        :alt="props.alt"
        :title="props.title"
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import useTheme from '@src/composables/useTheme';

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

const { theme } = useTheme();

const ratio = computed(() => {
  if (props.ratio && props.ratio[0] && props.ratio[1]) {
    return `${(props.ratio[1] / props.ratio[0]) * 100}%`;
  }
  return 'initial';
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
    $this: &;

    position: relative;

    &[data-ratio="true"] {

        #{$this} {
            &-shape {
                width: 100%;
                padding-top: v-bind("ratio");
            }
        }

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
