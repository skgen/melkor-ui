<template>
  <Menu
    v-theme="theme"
    class="mk-AppMenu"
    v-bind="spreadProps"
    :shown="props.modelValue"
    :data-fill="props.fill || undefined"
    :auto-hide="props.autoHide"
    @hide="handleHide"
  >
    <slot />
    <template #popper="popperProps">
      <slot
        name="menu"
        v-bind="popperProps"
      />
    </template>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu } from 'floating-vue';
import { computed } from 'vue';
import useTheme from '@src/composables/useTheme';

type Props = {
  modelValue: boolean;
  autoHide?: boolean;
  fill?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value : boolean): void;
  (event: 'hide'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { theme } = useTheme();

const spreadProps = computed(() => {
  const { fill, modelValue, ...p } = props;
  return p;
});

function handleHide() {
  if (!props.modelValue) {
    return;
  }
  if (props.autoHide) {
    emit('update:modelValue', false);
    emit('hide');
  }
}
</script>

<style lang="scss">
.mk-AppMenu {
    display: inline-block;

    &[data-fill="true"] {
        display: block;
    }
}
</style>
