<template>
  <teleport
    v-if="renderActive"
    to="#fs-layer"
  >
    <div
      v-theme="theme"
      class="mk-AppFullscreenView"
    >
      <div
        class="mk-AppFullscreenView-content"
        :data-center="centerAttr"
        :data-fill="props.fill || undefined"
      >
        <slot />
        <slot
          name="transition"
          :active="renderContent"
        />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted, ref, watch,
} from 'vue';
import { useLayerStore } from '@src/stores/layer';
import useTheme from '@src/composables/useTheme';

type Props = {
  modelValue: boolean;
  center?: boolean;
  centerX?: boolean;
  centerY?: boolean;
  fill?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: boolean): void;
};

const props = defineProps<Props>();
defineEmits<Emits>();

const { theme } = useTheme();

const renderActive = ref(false);
const renderContent = ref(renderActive.value);

const centerAttr = computed(() => {
  if (props.center || (props.centerX && props.centerY)) {
    return 'true';
  }
  if (props.centerX) {
    return 'x';
  }
  if (props.centerY) {
    return 'y';
  }
  return undefined;
});

const layerStore = useLayerStore();

function handleNotifyStore(active: boolean) {
  layerStore.mutateFsLayer(active);
}

watch([
  () => props.modelValue,
  () => layerStore.fsLayerActive,
], ([valueActive, fsLayerActive]) => {
  requestAnimationFrame(() => {
    renderActive.value = valueActive && fsLayerActive;
  });
});

watch(renderActive, (newRenderActive) => {
  requestAnimationFrame(() => {
    renderContent.value = newRenderActive;
  });
});

watch(() => props.modelValue, (newModelValue) => {
  handleNotifyStore(newModelValue);
});

onMounted(() => {
  if (props.modelValue) {
    handleNotifyStore(props.modelValue);
  }
});

</script>

<style lang="scss">
.mk-AppFullscreenView {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;

    &:last-child {
        z-index: 2;
    }

    &-content {
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        overflow: auto;

        &[data-center="true"] {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        &[data-center="x"] {
            left: 50%;
            transform: translate(-50%, 0);
        }

        &[data-center="y"] {
            top: 50%;
            transform: translate(0, -50%);
        }

        &[data-fill="true"] {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
