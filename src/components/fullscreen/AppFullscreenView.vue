<template>
  <teleport
    v-if="renderActive"
    to="#mk-fullscreen-layer"
  >
    <div
      :id="id"
      v-theme="theme"
      class="mk-AppFullscreenView"
      v-bind="$attrs"
    >
      <div
        v-if="!preventAutoClose"
        class="mk-AppFullscreenView-veil"
        role="presentation"
        @click="handleClose"
      />
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
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { useFullscreenLayerStore } from '@src/stores/fullscreen-layer';
import useTheme from '@src/composables/useTheme';
import { nanoid } from 'nanoid';

type Props = {
  modelValue: boolean;
  center?: boolean;
  centerX?: boolean;
  centerY?: boolean;
  fill?: boolean;
  preventAutoClose?: boolean;
};

type Emits = {
  (event: 'update:model-value', value: boolean): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

const id = nanoid();
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

const layerStore = useFullscreenLayerStore();

function handleNotifyStore(active: boolean) {
  if (active) {
    layerStore.showView(id);
  } else {
    layerStore.hideView(id);
  }
}

function handleClose() {
  emit('update:model-value', false);
}

watch(renderActive, (newRenderActive) => {
  renderContent.value = newRenderActive;
}, {
  flush: 'post',
});

watch(() => props.modelValue, (newModelValue) => {
  handleNotifyStore(newModelValue);
  renderActive.value = newModelValue;
}, {
  immediate: true,
});

onUnmounted(() => {
  if (props.modelValue) {
    handleClose();
    handleNotifyStore(false);
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

    &:last-child {
        z-index: calc(var(--app-fullscreen-layer-order) + 2);
    }

    &-veil {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
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
