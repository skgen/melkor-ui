<template>
  <AppFullscreenView
    :model-value="props.modelValue"
    fill
    @update:model-value="(state: boolean) => emit('update:model-value', state)"
  >
    <template #transition="{ active }">
      <div
        v-theme="theme"
        class="mk-AppFullscreenModal"
      >
        <div
          class="mk-AppFullscreenModal-veil"
          role="presentation"
          @click="handleClickVeil"
        />
        <div
          class="mk-AppFullscreenModal-content"
          :data-center="centerAttr"
        >
          <slot />
          <slot
            name="transition"
            :active="active"
          />
        </div>
      </div>
    </template>
  </AppFullscreenView>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import AppFullscreenView from '@src/components/fullscreen/AppFullscreenView.vue';
import useTheme from '@src/composables/useTheme';

type Props = {
  modelValue: boolean;
  center?: boolean;
  centerX?: boolean;
  centerY?: boolean;
};

type Emits = {
  (event: 'update:model-value', value: boolean): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

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

function handleClickVeil() {
  emit('update:model-value', false);
}

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppFullscreenModal {
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
    }
}
</style>
