<template>
  <Menu
    class="mk-AppMenu"
    v-bind="spreadProps"
    :shown="props.modelValue"
    :data-fill="props.fill || undefined"
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

const spreadProps = computed(() => {
  const { fill, modelValue, ...p } = props;
  return p;
});

function handleHide() {
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
