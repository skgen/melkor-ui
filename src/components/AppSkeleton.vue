<template>
  <div
    class="mk-AppSkeleton"
    :data-shape="shape"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

enum Shape {
  circle = 'circle',
  rectangle = 'rectangle',
}

type Props = {
  circle?: boolean;
  width?: string;
  height?: string;
  size?: string;
};

const props = withDefaults(defineProps<Props>(), {
  circle: false,
  width: undefined,
  height: undefined,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  size: defaultSize,
});

const shape = computed(() => {
  if (props.circle) {
    return Shape.circle;
  }
  return Shape.rectangle;
});

const height = computed(() => {
  if (props.height) {
    return props.height;
  }
  if (props.size) {
    return props.size;
  }
  return defaultSize;
});

const width = computed(() => {
  if (props.width) {
    return props.width;
  }
  if (props.size) {
    return props.size;
  }
  return defaultSize;
});

</script>

<script lang="ts">
const defaultSize = '100%';
</script>

<style lang="scss">
.mk-AppSkeleton {
    position: relative;
    width: v-bind("width");
    height: v-bind("height");
    background: rgb(130 130 130 / 0.2);
    background:
        linear-gradient(
            to right,
            rgb(130 130 130 / 0.2) 8%,
            rgb(130 130 130 / 0.3) 18%,
            rgb(130 130 130 / 0.2) 33%
        );
    background-size: 3200px 400px;
    animation-name: skeleton-animation;
    animation-duration: 2000ms;
    animation-timing-function: ease-out;
    animation-iteration-count: infinite;

    &[data-shape="rectangle"] {
        border-radius: 8px;
    }

    &[data-shape="circle"] {
        border-radius: 50%;
    }

    @keyframes skeleton-animation {
        0% {
            background-position: -1600px 0;
        }

        100% {
            background-position: 1600px 0;
        }
    }
}
</style>
