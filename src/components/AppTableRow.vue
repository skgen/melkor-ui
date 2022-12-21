<template>
  <div
    v-theme="theme"
    class="mk-AppTableRow"
    :data-active="props.active || undefined"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

type Props = {
  active? : boolean;
};

const props = withDefaults(
  defineProps<Props>(),
  {
    active: false,
  },
);

const { theme } = useTheme();

</script>

<style lang="scss">
.mk-AppTableRow {
    display: contents;
}
</style>
