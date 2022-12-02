<template>
  <Tooltip
    v-theme="theme"
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
import useTheme from '@src/composables/useTheme';

type Props = {
  fill?: boolean;
};

const props = defineProps<Props>();

const { theme } = useTheme();
</script>

<style lang="scss">
.mk-AppTooltip {
    display: inline-block;

    &[data-fill="true"] {
        display: block;
    }
}
</style>
