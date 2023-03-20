<template>
  <tr
    v-theme="theme"
    class="mk-AppTableRow"
    :data-header="props.header || undefined"
    :data-y="props.y ?? undefined"
    :data-is-current="props.isCurrent || undefined"
    :data-is-odd="props.isOdd|| undefined"
  >
    <slot />
  </tr>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

type Props = {
  header?: boolean;
  y?: number;
  isCurrent?: boolean;
  isOdd?: boolean;
};

const props = defineProps<Props>();

const { theme } = useTheme();

</script>
