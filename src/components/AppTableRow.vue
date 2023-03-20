<template>
  <tr
    v-theme="theme"
    class="mk-AppTableRow"
    :data-is-current="props.isCurrent || undefined"
  >
    <slot />
  </tr>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

type Props = {
  isCurrent? : boolean;
};

const props = defineProps<Props>();

const { theme } = useTheme();

</script>

<style lang="scss">
.mk-AppTableRow {
    display: contents;

    // &[data-is-current="true"] {
    // }
}
</style>
