<template>
  <tr
    class="mk-AppTableRow"
    :data-active="props.active || undefined"
  >
    <slot />
  </tr>
</template>

<script lang="ts" setup>

type Props = {
  active? : boolean;
};

const props = withDefaults(
  defineProps<Props>(),
  {
    active: false,
  },
);

</script>
