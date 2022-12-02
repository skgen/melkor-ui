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
import { isEqual } from 'lodash';

type Props = {
  modelValue: unknown;
  collapsible?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value : unknown): void;
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
        emit('update:modelValue', undefined);
      }
    } else {
      emit('update:modelValue', newIndex);
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
