<template>
  <div
    v-theme="theme"
    class="mk-AppTabs"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue';
import useTheme from '@src/composables/useTheme';
import { tabsContextKey } from '@src/definition';
import isEqual from 'lodash/isEqual';

type Props = {
  modelValue: unknown;
  collapsible?: boolean;
};

type Emits = {
  (event: 'update:model-value', value : unknown): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

const index = computed({
  get() {
    return props.modelValue;
  },
  set(newIndex) {
    if (isEqual(newIndex, props.modelValue)) {
      if (props.collapsible) {
        emit('update:model-value', undefined);
      }
    } else {
      emit('update:model-value', newIndex);
    }
  },
});

provide(tabsContextKey, index);
</script>

<style lang="scss">
.mk-AppTabs {
    display: flex;
    gap: var(--app-m-4);
}
</style>
