<template>
  <div class="mk-AppTabs">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { WritableComputedRef } from 'vue';
import { computed, provide } from 'vue';

type Props = {
  modelValue: unknown;
};

type Emits = {
  (event: 'update:modelValue', value : unknown): void;
};

const emit = defineEmits<Emits>();

const props = defineProps<Props>();

const index = computed({
  get() {
    return props.modelValue;
  },
  set(newIndex) {
    emit('update:modelValue', newIndex);
  },
});

provide<WritableComputedRef<unknown>>('tabs-index', index);
</script>

<style lang="scss">
.mk-AppTabs {
    display: flex;
    gap: var(--app-m-4);
}
</style>
