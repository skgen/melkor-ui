<template>
  <Tooltip
    class="mk-AppTooltip"
    :data-fill="props.fill || undefined"
    v-bind="props"
  >
    <slot />
    <template #popper>
      <slot name="tooltip" />
    </template>
  </Tooltip>
</template>

<script lang="ts" setup>
import { Tooltip } from 'floating-vue';

type Props = {
  fill?: boolean;
};

const props = defineProps<Props>();
</script>

<style lang="scss">
.mk-AppTooltip {
    display: inline-block;

    &[data-fill="true"] {
        display: block;
    }
}
</style>
