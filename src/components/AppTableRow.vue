<template>
  <tr
    v-theme="{ scheme }"
    class="mk-AppTableRow"
    :data-active="props.active || undefined"
  >
    <slot />
  </tr>
</template>

<script lang="ts" setup>
import useComponentTheme from '@src/composables/useComponentTheme';

type Props = {
  active? : boolean;
};

const props = withDefaults(
  defineProps<Props>(),
  {
    active: false,
  },
);

const { scheme } = useComponentTheme();

</script>
