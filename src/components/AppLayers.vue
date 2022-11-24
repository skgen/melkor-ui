<template>
  <div
    v-theme="{ scheme }"
    class="mk-AppLayers"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue';
import useComponentTheme from '@src/composables/useComponentTheme';
import { layersContextKey } from '@src/definition';

type Props = {
  modelValue: unknown;
};

type Emits = {
  (event: 'update:modelValue', value : unknown): void;
};

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const { scheme } = useComponentTheme();

const index = computed({
  get() {
    return props.modelValue;
  },
  set(newIndex) {
    emit('update:modelValue', newIndex);
  },
});

provide(layersContextKey, index);
</script>
